import { useApp } from '../context/AppContext.jsx'

const NUMBER = new Intl.NumberFormat('en-US')

export default function RepoCard({ repo }) {
  const { isSaved, toggleSaved } = useApp()
  const saved = isSaved(repo.id)

  return (
    <li className="card flex h-full flex-col p-6">
      <p className="font-ui mb-3 text-xs font-medium uppercase tracking-[0.14em] text-stone">
        {repo.owner}
      </p>

      <h3 className="mb-2 text-lg">
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent"
        >
          {repo.name}
        </a>
      </h3>

      <p className="mb-5 flex-1 text-sm">
        {repo.description || <span className="text-stone italic">No description provided.</span>}
      </p>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {repo.language && <span className="chip">{repo.language}</span>}
        <span className="chip">{NUMBER.format(repo.stars)} stars</span>
        <span className="chip">{NUMBER.format(repo.forks)} forks</span>
      </div>

      <button
        type="button"
        onClick={() => toggleSaved(repo)}
        aria-pressed={saved}
        className={[
          'btn w-full',
          saved ? 'btn-accent' : 'btn-ghost',
        ].join(' ')}
      >
        {saved ? 'Saved' : 'Save'}
      </button>
    </li>
  )
}
