import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import BrandBar from './BrandBar.jsx'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/explore', label: 'Explore' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { saved } = useApp()

  const linkClass = ({ isActive }) =>
    [
      'font-ui text-sm font-medium transition-opacity',
      isActive ? 'opacity-100 underline underline-offset-8 decoration-2' : 'opacity-80 hover:opacity-100',
    ].join(' ')

  return (
    <header className="sticky top-0 z-50">
      <BrandBar />

      <div className="bg-accent text-white">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-8">
          {/* The bar is brand blue, so the official white wordmark sits on
              the background it was drawn for. Used exactly as published. */}
          <Link to="/" aria-label="Codveda Technologies — home" className="shrink-0">
            <img
              src="/codveda-logo.png"
              width="500"
              height="167"
              alt="Codveda Technologies"
              className="h-7 w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
            <SavedBadge count={saved.length} />
          </nav>

          <button
            type="button"
            className="font-ui rounded-[4px] border border-white/45 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>

        {open && (
          <nav
            id="mobile-nav"
            aria-label="Primary"
            className="border-t border-white/20 px-4 pb-4 sm:px-8 md:hidden"
          >
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className="font-display block border-b border-white/20 py-3 text-xl font-medium"
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-4">
              <SavedBadge count={saved.length} />
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

function SavedBadge({ count }) {
  return (
    <Link
      to="/explore"
      className="font-ui inline-flex items-center gap-2 rounded-[4px] bg-white px-3 py-1.5 text-xs font-semibold text-accent"
    >
      Saved
      <span
        className="inline-grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[0.7rem] text-white"
        aria-label={`${count} repositories saved`}
      >
        {count}
      </span>
    </Link>
  )
}
