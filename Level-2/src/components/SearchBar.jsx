const LANGUAGES = ['', 'JavaScript', 'TypeScript', 'Python', 'Java', 'Dart', 'Go']

export default function SearchBar({ query, onQuery, language, onLanguage, busy }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
      <div>
        <label htmlFor="repo-search" className="eyebrow mb-2 block text-stone">
          Search repositories
        </label>
        <div className="relative">
          <input
            id="repo-search"
            type="search"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="react, tailwind, django…"
            autoComplete="off"
            className="w-full rounded-[4px] border border-line bg-bone px-4 py-3 text-base text-ink transition-colors placeholder:text-stone hover:border-ink focus:border-accent focus:outline-none"
            aria-describedby="search-hint"
          />
          {busy && (
            <span
              className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-line border-t-accent"
              aria-hidden="true"
            />
          )}
        </div>
        <p id="search-hint" className="font-ui mt-2 text-xs text-stone">
          Requests are debounced by 400&nbsp;ms — GitHub allows 10 unauthenticated searches per minute.
        </p>
      </div>

      <div>
        <label htmlFor="repo-language" className="eyebrow mb-2 block text-stone">
          Language
        </label>
        <select
          id="repo-language"
          value={language}
          onChange={(event) => onLanguage(event.target.value)}
          className="w-full rounded-[4px] border border-line bg-bone px-4 py-3 text-base text-ink transition-colors hover:border-ink focus:border-accent focus:outline-none sm:w-44"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang || 'any'} value={lang}>
              {lang || 'Any language'}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
