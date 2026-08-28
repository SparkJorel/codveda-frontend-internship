/**
 * The three non-happy states of a data view, in one place: loading,
 * error and empty. Keeping them together stops each page from inventing
 * its own wording and layout.
 */
export function SkeletonGrid({ count = 6 }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="card p-6">
          <div className="mb-4 h-3 w-20 animate-pulse rounded bg-line" />
          <div className="mb-3 h-5 w-3/4 animate-pulse rounded bg-line" />
          <div className="mb-2 h-3 w-full animate-pulse rounded bg-line" />
          <div className="mb-6 h-3 w-5/6 animate-pulse rounded bg-line" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-line" />
        </li>
      ))}
    </ul>
  )
}

export function ErrorState({ error, onRetry }) {
  return (
    <div
      role="alert"
      className="rounded-[4px] border border-signal/40 bg-tint-red px-6 py-8 text-center"
    >
      <p className="font-display mb-2 text-lg font-semibold text-ink">
        {error?.rateLimited ? 'Rate limit reached' : 'Something went wrong'}
      </p>
      <p className="mx-auto mb-5 max-w-[52ch] text-sm">
        {error?.message ?? 'The request could not be completed.'}
      </p>
      {onRetry && (
        <button type="button" className="btn btn-ghost" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, children }) {
  return (
    <div className="rounded-[4px] border border-dashed border-line px-6 py-12 text-center">
      <p className="font-display mb-2 text-lg font-semibold text-ink">{title}</p>
      <p className="mx-auto max-w-[52ch] text-sm">{children}</p>
    </div>
  )
}
