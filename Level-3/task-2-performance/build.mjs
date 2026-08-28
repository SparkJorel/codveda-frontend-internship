/**
 * Level 3 · Task 2 — the optimisation pipeline.
 *
 * Reads the unmodified Level 1 landing page from `before/` and writes an
 * optimised build to `after/`. Every step below maps to one of the four
 * objectives in the brief.
 *
 *   1. Modern image formats + lazy loading
 *   2. Minified and bundled JavaScript / CSS
 *   3. Caching strategy            (headers live in serve.mjs / _headers)
 *   4. Fewer render-blocking resources
 *
 * Run with: npm run build
 */
import { mkdir, readFile, readdir, rm, writeFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import * as esbuild from 'esbuild'

const run = promisify(execFile)
const SRC = 'before'
const OUT = 'after'

const steps = []
function log(step, detail) {
  steps.push({ step, detail })
  console.log(`  ${step.padEnd(34)} ${detail}`)
}

async function sizeOf(path) {
  try { return (await stat(path)).size } catch { return 0 }
}

/* ============================================================
   1. Fonts — self-host to remove the render-blocking CDN hop
   ============================================================
   The original page loads a stylesheet from fonts.googleapis.com, which
   blocks rendering while the browser resolves DNS, negotiates TLS,
   downloads the CSS, and only *then* discovers the font files on a second
   origin (fonts.gstatic.com). Self-hosting collapses that to one
   same-origin request that can be preloaded. */
async function selfHostFonts(html) {
  const cssUrl =
    'https://fonts.googleapis.com/css2?family=Inter:wght@500;600&family=Poppins:wght@400;500;600&display=swap'

  // Only the weights the stylesheet actually uses are requested. Auditing
  // the original revealed the page pulls seven faces but renders with
  // five: Inter 400 and Poppins 700 are never applied by any rule. Inter
  // alone is 48 kB per weight against Poppins' 8 kB, so dropping the two
  // dead faces removes ~56 kB of font payload for no visual change.
  //
  // A modern UA is required or Google serves the legacy TTF payload.
  const UA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

  let css
  try {
    const res = await fetch(cssUrl, { headers: { 'User-Agent': UA } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    css = await res.text()
  } catch (error) {
    log('fonts', `SKIPPED — could not reach Google Fonts (${error.message})`)
    return { html, css: null }
  }

  await mkdir(join(OUT, 'fonts'), { recursive: true })

  // Keep only the latin subset: the page has no Cyrillic or Greek text, and
  // the full set is roughly four times the bytes.
  const blocks = css.split('@font-face').slice(1)
  const latin = blocks.filter((b) => /unicode-range:\s*U\+0000/.test(b))

  let out = ''
  let downloaded = 0
  let bytes = 0

  for (const block of latin) {
    const urlMatch = block.match(/url\((https:\/\/[^)]+\.woff2)\)/)
    const familyMatch = block.match(/font-family:\s*'([^']+)'/)
    const weightMatch = block.match(/font-weight:\s*(\d+)/)
    if (!urlMatch || !familyMatch) continue

    const family = familyMatch[1].replace(/\s+/g, '-')
    const weight = weightMatch ? weightMatch[1] : '400'
    const name = `${family}-${weight}.woff2`

    const fontRes = await fetch(urlMatch[1], { headers: { 'User-Agent': UA } })
    const buffer = Buffer.from(await fontRes.arrayBuffer())
    await writeFile(join(OUT, 'fonts', name), buffer)
    downloaded += 1
    bytes += buffer.length

    out += block
      .replace(urlMatch[0], `url(fonts/${name})`)
      .replace(/^\s*/, '@font-face')
      .replace(/\n\s*/g, '')
    out = out.replace('@font-face@font-face', '@font-face')
  }

  log('fonts self-hosted', `${downloaded} woff2 files, ${(bytes / 1024).toFixed(1)} kB (latin subset only)`)

  // Drop the three external font tags; the faces now ship in the CSS.
  const cleaned = html
    .replace(/\s*<link rel="preconnect"[^>]*>/g, '')
    .replace(/\s*<link href="https:\/\/fonts\.googleapis\.com[^>]*>/g, '')
    .replace(/\s*<!-- Poppins \+ Inter[^>]*-->/g, '')

  return { html: cleaned, css: out }
}

/* ============================================================
   2. Images — WebP with a PNG fallback, plus lazy loading
   ============================================================ */
async function convertImages() {
  await mkdir(join(OUT, 'assets'), { recursive: true })

  const files = await readdir(join(SRC, 'assets'))
  const results = []

  for (const file of files) {
    if (!file.endsWith('.png')) continue
    const from = join(SRC, 'assets', file)
    const to = join(OUT, 'assets', file)
    await writeFile(to, await readFile(from))

    const webpPath = to.replace(/\.png$/, '.webp')
    try {
      // These are flat palette PNGs — a logo and a glyph, few colours and
      // hard edges. Lossy WebP is the wrong tool for that: it came out 84%
      // *larger* than the source. Lossless WebP is the right comparison,
      // and even then the result is only kept when it actually wins.
      await run('python', [
        '-c',
        `from PIL import Image; im=Image.open(r"${from}").convert("RGBA"); im.save(r"${webpPath}", "WEBP", lossless=True, quality=100, method=6)`,
      ])

      const before = await sizeOf(from)
      const after = await sizeOf(webpPath)

      if (after < before) {
        results.push({ file, before, after, kept: true })
      } else {
        // Shipping a heavier "modern format" would be a regression dressed
        // up as an optimisation. Drop it and keep the PNG.
        await rm(webpPath, { force: true })
        results.push({ file, before, after, kept: false })
      }
    } catch (error) {
      log('webp', `SKIPPED ${file} — ${error.message.split(String.fromCharCode(10))[0]}`)
    }
  }

  const kept = results.filter((r) => r.kept)
  const rejected = results.filter((r) => !r.kept)

  if (kept.length) {
    const before = kept.reduce((n, r) => n + r.before, 0)
    const after = kept.reduce((n, r) => n + r.after, 0)
    const saved = (100 * (1 - after / before)).toFixed(0)
    log('images converted to WebP', `${kept.length} kept, ${(before / 1024).toFixed(1)} kB -> ${(after / 1024).toFixed(1)} kB (-${saved}%)`)
  }
  if (rejected.length) {
    log('webp rejected', `${rejected.length} file(s) were larger as WebP — PNG kept instead`)
  }

  return kept.map((r) => r.file.replace(/\.png$/, ''))
}

/** Swap each <img> for a <picture> that prefers WebP, and lazy-load the
 *  ones below the fold. The header logo stays eager: it is the LCP-adjacent
 *  element and lazy-loading it would delay first paint. */
function rewriteImages(html, webpNames) {
  let eagerDone = false
  let count = 0

  const rewritten = html.replace(
    /<img([^>]*?)src="assets\/([^"]+)\.png"([^>]*?)>/g,
    (match, pre, name, post) => {
      count += 1
      const attrs = (pre + post).trim()
      const loading = eagerDone
        ? 'loading="lazy" decoding="async"'
        : 'fetchpriority="high" decoding="async"'
      eagerDone = true

      const img = `<img src="assets/${name}.png" ${attrs} ${loading}>`
      // Only wrap in <picture> when a smaller WebP was actually produced.
      return webpNames.includes(name)
        ? `<picture><source srcset="assets/${name}.webp" type="image/webp">${img}</picture>`
        : img
    }
  )

  log('images rewritten', `${count} <img> processed, ${count - 1} lazy-loaded, ${webpNames.length} served as WebP first`)
  return rewritten
}

/* ============================================================
   3. CSS — minify, and inline it to remove the last blocking request
   ============================================================ */
async function buildCss(fontCss) {
  const original = await readFile(join(SRC, 'css/styles.css'), 'utf8')
  const combined = (fontCss ? fontCss + '\n' : '') + original

  const { code } = await esbuild.transform(combined, {
    loader: 'css',
    minify: true,
  })

  const saved = (100 * (1 - code.length / combined.length)).toFixed(0)
  log('css minified', `${(combined.length / 1024).toFixed(1)} kB → ${(code.length / 1024).toFixed(1)} kB (−${saved}%)`)
  return code
}

/* ============================================================
   4. JavaScript — minify and keep it deferred
   ============================================================ */
async function buildJs() {
  const result = await esbuild.build({
    entryPoints: [join(SRC, 'js/main.js')],
    bundle: true,
    minify: true,
    format: 'iife',
    target: ['es2018'],
    write: false,
  })

  const code = result.outputFiles[0].text
  const before = await sizeOf(join(SRC, 'js/main.js'))
  const saved = (100 * (1 - code.length / before)).toFixed(0)

  await mkdir(join(OUT, 'js'), { recursive: true })
  await writeFile(join(OUT, 'js/main.js'), code)

  log('js minified + bundled', `${(before / 1024).toFixed(1)} kB → ${(code.length / 1024).toFixed(1)} kB (−${saved}%)`)
  return code
}

/* ============================================================
   Assemble
   ============================================================ */
async function main() {
  console.log('\nOptimising the Level 1 landing page\n')

  if (existsSync(OUT)) await rm(OUT, { recursive: true, force: true })
  await mkdir(OUT, { recursive: true })

  let html = await readFile(join(SRC, 'index.html'), 'utf8')

  const { html: withoutCdnFonts, css: fontCss } = await selfHostFonts(html)
  html = withoutCdnFonts

  const webpNames = await convertImages()
  html = rewriteImages(html, webpNames)

  const css = await buildCss(fontCss)
  await buildJs()

  // The stylesheet was the last render-blocking request. Inlining it means
  // the browser can paint from the HTML response alone — one round trip
  // instead of two. It is small enough (well under the ~14 kB first
  // congestion window after gzip) for this to be a clear win.
  html = html.replace(
    /\s*<link rel="stylesheet" href="css\/styles\.css"\s*\/?>/,
    `\n  <style>${css}</style>`
  )
  log('css inlined', 'stylesheet request removed from the critical path')

  // Preload the two faces actually used above the fold so they are fetched
  // in parallel with the HTML parse rather than after the CSS is applied.
  const preloads = [
    '<link rel="preload" href="fonts/Poppins-600.woff2" as="font" type="font/woff2" crossorigin>',
    '<link rel="preload" href="fonts/Inter-600.woff2" as="font" type="font/woff2" crossorigin>',
  ]
  if (fontCss) {
    html = html.replace('</head>', `  ${preloads.join('\n  ')}\n</head>`)
    log('fonts preloaded', 'the two above-the-fold faces')
  }

  // Minify the HTML itself: collapse comments and inter-tag whitespace.
  const htmlBefore = html.length
  html = html
    .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
    .replace(/\n\s*\n/g, '\n')
    .replace(/>\s+</g, '><')
    .trim()
  log('html minified', `${(htmlBefore / 1024).toFixed(1)} kB → ${(html.length / 1024).toFixed(1)} kB`)

  await writeFile(join(OUT, 'index.html'), html)

  // A Netlify/Vercel-style headers file so the caching strategy travels
  // with the build rather than living only in the local test server.
  await writeFile(
    join(OUT, '_headers'),
    [
      '/assets/*',
      '  Cache-Control: public, max-age=31536000, immutable',
      '/fonts/*',
      '  Cache-Control: public, max-age=31536000, immutable',
      '/js/*',
      '  Cache-Control: public, max-age=604800',
      '/*.html',
      '  Cache-Control: no-cache',
      '',
    ].join('\n')
  )
  log('cache headers written', 'after/_headers')

  console.log('\nBuild complete → after/\n')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
