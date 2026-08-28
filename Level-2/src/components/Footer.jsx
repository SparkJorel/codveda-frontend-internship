import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-bone">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-12 sm:px-8 md:grid-cols-3">
        <div>
          {/* On white, the lockup is the official glyph beside the name in
              Poppins — the white wordmark would be invisible here. */}
          <Link to="/" className="mb-4 inline-flex items-center gap-2" aria-label="Codveda Technologies">
            <img src="/favicon.png" width="192" height="192" alt="" className="h-7 w-7" />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold text-ink">Codveda</span>
              <span className="font-ui text-[0.58rem] font-medium uppercase tracking-[0.22em] text-stone">
                Technologies
              </span>
            </span>
          </Link>
          <p className="max-w-[34ch] text-sm">
            We&rsquo;re passionate about helping businesses and individuals navigate the
            digital landscape with innovative IT solutions.
          </p>
        </div>

        <nav aria-label="Footer — Pages">
          <p className="eyebrow mb-4 text-stone">Pages</p>
          <ul className="grid gap-2 text-sm">
            <li><Link to="/" className="hover:text-accent">Home</Link></li>
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><Link to="/explore" className="hover:text-accent">Explore</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </nav>

        <div>
          <p className="eyebrow mb-4 text-stone">Contact</p>
          <ul className="grid gap-2 text-sm">
            <li>Chandrapur, Maharashtra</li>
            <li><a href="mailto:support@codveda.com" className="hover:text-accent">support@codveda.com</a></li>
            <li>
              <a href="https://www.codveda.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                www.codveda.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="font-ui mx-auto flex max-w-[1280px] flex-col gap-1 px-4 py-5 text-xs text-stone sm:flex-row sm:justify-between sm:px-8">
          <p>&copy; {new Date().getFullYear()} Codveda Technologies.</p>
          <p>Student recreation &middot; Level 2 &middot; built by Tiomela Zangue Jorel</p>
        </div>
      </div>
    </footer>
  )
}
