/**
 * Runs Lighthouse against `before/` and `after/` under identical
 * conditions and writes a comparison to reports/.
 *
 * Both builds are served locally by serve.mjs so neither benefits from a
 * CDN the other does not have. Each is audited three times and the median
 * run is kept — a single Lighthouse pass varies by several points on a
 * developer machine, and reporting one lucky run would be dishonest.
 *
 * Run with: npm run audit
 */
import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'

const RUNS = 3
const TARGETS = [
  { name: 'before', port: 5001 },
  { name: 'after', port: 5002 },
]

const METRICS = [
  ['first-contentful-paint', 'First Contentful Paint'],
  ['largest-contentful-paint', 'Largest Contentful Paint'],
  ['total-blocking-time', 'Total Blocking Time'],
  ['cumulative-layout-shift', 'Cumulative Layout Shift'],
  ['speed-index', 'Speed Index'],
]

function startServer(dir, port) {
  const child = spawn(process.execPath, ['serve.mjs', dir, String(port)], {
    stdio: ['ignore', 'pipe', 'inherit'],
  })
  return new Promise((resolve) => {
    child.stdout.once('data', () => resolve(child))
  })
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

async function auditOnce(url, port) {
  const result = await lighthouse(
    url,
    {
      port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      // Lighthouse's default mobile throttling. Kept identical for both
      // builds so the comparison is like for like.
      formFactor: 'mobile',
      screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
    }
  )
  return result.lhr
}

async function main() {
  await mkdir('reports', { recursive: true })

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
  })

  const collected = {}

  try {
    for (const target of TARGETS) {
      const server = await startServer(target.name, target.port)
      const url = `http://localhost:${target.port}/`
      console.log(`\nAuditing ${target.name} — ${RUNS} runs`)

      const runs = []
      for (let i = 0; i < RUNS; i += 1) {
        const lhr = await auditOnce(url, chrome.port)
        runs.push(lhr)
        process.stdout.write(
          `  run ${i + 1}: performance ${Math.round(lhr.categories.performance.score * 100)}\n`
        )
      }

      // Pick the run whose performance score is the median.
      const scores = runs.map((r) => Math.round(r.categories.performance.score * 100))
      const target_score = median(scores)
      const chosen = runs[scores.indexOf(target_score)]

      collected[target.name] = chosen
      await writeFile(
        `reports/${target.name}.json`,
        JSON.stringify(
          {
            categories: Object.fromEntries(
              Object.entries(chosen.categories).map(([k, v]) => [k, Math.round(v.score * 100)])
            ),
            metrics: Object.fromEntries(
              METRICS.map(([id, label]) => [
                label,
                { value: chosen.audits[id]?.numericValue, display: chosen.audits[id]?.displayValue },
              ])
            ),
            allRuns: scores,
            requests: chosen.audits['network-requests']?.details?.items?.length ?? null,
            totalBytes: chosen.audits['total-byte-weight']?.numericValue ?? null,
          },
          null,
          2
        )
      )

      server.kill()
    }
  } finally {
    try {
      await chrome.kill()
    } catch (error) {
      // chrome-launcher fails to remove its own temp profile on Windows
      // (EPERM). The audit is already complete at this point, so a cleanup
      // failure must not discard the results.
      console.warn(`  (chrome cleanup skipped: ${error.code ?? error.message})`)
    }
  }

  await writeComparison()
}

/**
 * Builds reports/comparison.md from the two summary files. Kept separate
 * from the audit so the table can be regenerated in a second, without
 * spending several minutes re-running Lighthouse.
 */
export async function writeComparison() {
  const before = JSON.parse(await readFile('reports/before.json', 'utf8'))
  const after = JSON.parse(await readFile('reports/after.json', 'utf8'))

  const lines = []
  lines.push('# Lighthouse — before / after', '')
  lines.push(`Measured on ${new Date().toISOString().slice(0, 10)} with the Lighthouse mobile`)
  lines.push(`preset, median of ${RUNS} runs. Both builds were served from the same local`)
  lines.push('machine, so neither benefits from a CDN the other does not have.', '')

  lines.push('## Category scores', '')
  lines.push('| Category | Before | After | Change |')
  lines.push('|---|---|---|---|')
  const LABELS = {
    performance: 'Performance',
    accessibility: 'Accessibility',
    'best-practices': 'Best practices',
    seo: 'SEO',
  }
  for (const key of Object.keys(LABELS)) {
    const b = before.categories[key]
    const a = after.categories[key]
    const d = a - b
    lines.push(`| ${LABELS[key]} | ${b} | ${a} | ${d > 0 ? '+' : ''}${d || '—'} |`)
  }

  lines.push('', '## Metrics', '')
  lines.push('| Metric | Before | After | Change |')
  lines.push('|---|---|---|---|')
  for (const [, label] of METRICS) {
    const b = before.metrics[label]
    const a = after.metrics[label]
    let change = '—'
    if (b?.value > 0 && a?.value != null) {
      const pct = Math.round(((a.value - b.value) / b.value) * 100)
      change = `${pct > 0 ? '+' : ''}${pct}%`
    }
    lines.push(`| ${label} | ${b?.display ?? '—'} | ${a?.display ?? '—'} | ${change} |`)
  }

  lines.push('', '## Payload', '')
  lines.push('| | Before | After | Change |')
  lines.push('|---|---|---|---|')
  const reqDelta = after.requests - before.requests
  lines.push(`| Network requests | ${before.requests} | ${after.requests} | ${reqDelta > 0 ? '+' : ''}${reqDelta} |`)
  const kb = (n) => (n / 1024).toFixed(0) + ' kB'
  const byteDelta = Math.round(((after.totalBytes - before.totalBytes) / before.totalBytes) * 100)
  lines.push(`| Total transferred | ${kb(before.totalBytes)} | ${kb(after.totalBytes)} | ${byteDelta > 0 ? '+' : ''}${byteDelta}% |`)

  lines.push('', '## Run-to-run spread', '')
  lines.push('A single Lighthouse pass varies on a developer machine, which is why the')
  lines.push('median is reported rather than the best run.', '')
  lines.push(`- before: ${before.allRuns.join(', ')}`)
  lines.push(`- after: ${after.allRuns.join(', ')}`)

  const report = lines.join(String.fromCharCode(10)) + String.fromCharCode(10)
  await writeFile('reports/comparison.md', report)
  console.log(String.fromCharCode(10) + report)
}

const reportOnly = process.argv.includes('--report-only')

;(reportOnly ? writeComparison() : main()).catch((error) => {
  console.error(error)
  process.exit(1)
})
