import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SearchBar from '../components/SearchBar.jsx'
import RepoCard from '../components/RepoCard.jsx'
import { EmptyState, ErrorState, SkeletonGrid } from '../components/StateMessage.jsx'
import { useDebounce } from '../hooks/useDebounce.js'
import { searchRepositories } from '../lib/github.js'
import { useApp } from '../context/AppContext.jsx'

const NUMBER = new Intl.NumberFormat('en-US')

export default function Explore() {
  const [query, setQuery] = useState('react')
  const [language, setLanguage] = useState('')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const { saved, clearSaved, recentSearches, rememberSearch } = useApp()

  const debouncedQuery = useDebounce(query, 400)
  const controllerRef = useRef(null)

  useEffect(() => {
    const term = debouncedQuery.trim()

    if (!term) {
      setResult(null)
      setStatus('idle')
      return
    }

    // Drop any request still in flight — otherwise a slow early response can
    // land after a fast later one and overwrite the correct results.
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    setStatus('loading')
    setError(null)

    searchRepositories(term, { language, signal: controller.signal })
      .then((data) => {
        setResult(data)
        setStatus('ready')
        rememberSearch(term)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return // superseded, not a failure
        setError(err)
        setStatus('error')
      })

    return () => controller.abort()
  }, [debouncedQuery, language, reloadKey, rememberSearch])

  const retry = useCallback(() => setReloadKey((k) => k + 1), [])

  // The field is ahead of the request while the debounce timer runs.
  const settling = query.trim() !== debouncedQuery.trim()
  const busy = settling || status === 'loading'

  const heading = useMemo(() => {
    if (status !== 'ready' || !result) return null
    return `${NUMBER.format(result.total)} ${result.total === 1 ? 'repository' : 'repositories'} found`
  }, [status, result])

  return (
    <div className="route-view mx-auto max-w-[1280px] px-4 py-14 sm:px-8">
      <header className="mb-10 max-w-[46rem]">
        <p className="eyebrow mb-3">Explore &mdash; GitHub REST API</p>
        <h1 className="mb-4 text-4xl sm:text-5xl">Find the tools our teams build with.</h1>
        <p className="text-base">
          A live search against the public GitHub REST API. Type to filter, narrow by
          language, and save repositories to a shortlist that follows you across the
          other pages.
        </p>
      </header>

      <div className="mb-10">
        <SearchBar
          query={query}
          onQuery={setQuery}
          language={language}
          onLanguage={setLanguage}
          busy={busy}
        />

        {recentSearches.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-ui text-xs uppercase tracking-[0.14em] text-stone">Recent</span>
            {recentSearches.map((term) => (
              <button key={term} type="button" className="chip hover:border-ink" onClick={() => setQuery(term)}>
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Screen readers are told the result count changed without a visual jump */}
      <p className="sr-only" role="status" aria-live="polite">
        {busy ? 'Searching' : heading ?? ''}
      </p>

      {saved.length > 0 && (
        <section className="mb-10 rounded-[4px] border border-line bg-band px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-ui text-sm">
              <strong className="font-semibold text-ink">{saved.length}</strong> saved
              {' '}{saved.length === 1 ? 'repository' : 'repositories'} &mdash; kept in
              React Context, so they survive navigation and a page reload.
            </p>
            <button type="button" className="btn btn-ghost" onClick={clearSaved}>
              Clear list
            </button>
          </div>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {saved.map((repo) => (
              <li key={repo.id}>
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="chip hover:border-ink">
                  {repo.fullName}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {heading && status === 'ready' && (
        <p className="font-ui mb-4 text-sm text-stone">{heading}</p>
      )}

      {status === 'loading' && <SkeletonGrid />}

      {status === 'error' && <ErrorState error={error} onRetry={retry} />}

      {status === 'idle' && (
        <EmptyState title="Start typing">
          Enter a keyword above to search public repositories on GitHub.
        </EmptyState>
      )}

      {status === 'ready' && result.items.length === 0 && (
        <EmptyState title="No matches">
          Nothing came back for &ldquo;{debouncedQuery}&rdquo;
          {language && ` in ${language}`}. Try a broader keyword.
        </EmptyState>
      )}

      {status === 'ready' && result.items.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </ul>
      )}
    </div>
  )
}
