import { useEffect, useState } from 'react'

/**
 * Returns `value` only once it has stopped changing for `delay` ms.
 *
 * The search field calls the GitHub API on every change, and GitHub's
 * unauthenticated search endpoint allows 10 requests per minute. Typing
 * "react" would burn five of them; debouncing spends one.
 */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    // Cleared on every keystroke, so the timer only fires once typing stops.
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
