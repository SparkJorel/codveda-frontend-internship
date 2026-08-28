const ENDPOINT = 'https://api.github.com/search/repositories'

/** Raised for responses the UI needs to explain differently. */
export class ApiError extends Error {
  constructor(message, { status, rateLimited = false } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.rateLimited = rateLimited
  }
}

/**
 * Search public repositories.
 *
 * `signal` comes from an AbortController so a stale request is dropped when
 * the query changes — without it, a slow early response can land after a
 * fast later one and overwrite the correct results.
 */
export async function searchRepositories(query, { language, signal } = {}) {
  const q = [query.trim(), language ? `language:${language}` : '']
    .filter(Boolean)
    .join(' ')

  const url = `${ENDPOINT}?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=12`

  let response
  try {
    response = await fetch(url, {
      signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError('Network unreachable. Check your connection and try again.')
  }

  if (!response.ok) {
    // 403 here is almost always the unauthenticated rate limit, not a
    // permission problem, so it gets its own message.
    if (response.status === 403) {
      throw new ApiError(
        'GitHub rate limit reached. Unauthenticated search allows 10 requests per minute — please wait a moment.',
        { status: 403, rateLimited: true }
      )
    }
    if (response.status === 422) {
      throw new ApiError('That query is not valid for the GitHub search API.', { status: 422 })
    }
    throw new ApiError(`GitHub replied with ${response.status}.`, { status: response.status })
  }

  const data = await response.json()

  return {
    total: data.total_count,
    items: data.items.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      owner: repo.owner?.login,
      updatedAt: repo.updated_at,
    })),
  }
}
