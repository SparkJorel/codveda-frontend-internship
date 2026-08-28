# Codveda Technologies — Front-End Development Internship

Internship deliverables for **Codveda Technologies**, submitted by
**Tiomela Zangue Jorel**.

The brief provides three tasks per level and requires **any two per level** to be
completed. Each level lives in its own folder.

---

## Levels

| Level | Status | Tasks completed |
|---|---|---|
| **Level 1 — Basic** | Complete | Responsive landing page · Interactive form · DOM counter *(bonus)* |
| **Level 2 — Intermediate** | Complete | React SPA · REST API integration · Customised Tailwind theme *(bonus)* |
| **Level 3 — Advanced** | Complete | Performance optimisation · Advanced GSAP animations |

All three levels exceed the two-tasks-per-level requirement.

---

## Level 1 — Basic

[`Level-1/`](Level-1/) · [detailed notes](Level-1/README.md)

Open [`Level-1/index.html`](Level-1/index.html) in a browser. No build step, no
dependencies, no package manager.

### Task 1 — Responsive Landing Page

`Level-1/task-1-landing-page/`

A landing page for Codveda Technologies: navigation, hero, about with mission and
vision, six services, four internship tracks, student testimonials, call to action
and a footer carrying the company's published registrations.

- Semantic HTML with a full landmark structure, JSON-LD `Organization` data,
  meta description and Open Graph tags
- CSS Grid for the 12-column layout, Flexbox for components
- Mobile-first, with breakpoints at 700 px and 1000 px
- Smooth scrolling with a header offset, scroll-triggered reveals via
  `IntersectionObserver`, animated statistics

### Task 2 — Interactive Form

`Level-1/task-2-interactive-form/`

Account registration with real-time validation of name, email, phone number and
password.

- A field is only judged once it has been left for the first time, then
  re-validates on every keystroke — no "invalid email" while the user is still
  typing the first letter
- Four-level password strength meter with a live requirement checklist
- Errors announced through `role="alert"`, wired with `aria-describedby`
- No page reload; entirely client-side, nothing is stored or transmitted

### Task 3 — Basic DOM Manipulation *(bonus)*

`Level-1/task-3-counter/`

A counter driven by a single state object. `render()` pushes state into the DOM and
nothing ever reads the value back out of the markup, so the UI cannot drift out of
sync. The zero floor is guarded twice — the decrement button is disabled and the
state function refuses negative values — so keyboard shortcuts cannot bypass it.

---

## Level 2 — Intermediate

[`Level-2/`](Level-2/) · [detailed notes](Level-2/README.md)

A Vite + React 19 single-page application.

```bash
cd Level-2 && npm install && npm run dev
```

### Task 1 — Single Page Application

Four client-side routes plus a 404, wired with React Router 7. Shared state lives in a
React Context above the router, so a saved-repository shortlist survives navigation and,
through `localStorage`, a page reload. Route changes reset scroll and move focus to
`<main>` so the view change is announced to assistive technology.

### Task 2 — REST API Integration

Live search against the public GitHub search endpoint with native `fetch`. Queries are
debounced by 400 ms because the unauthenticated endpoint allows only ten requests per
minute, and each search aborts the previous one so a slow early response cannot overwrite
a fast later one. Loading, empty and error states are handled separately, with rate
limiting distinguished from other 403 responses.

### Task 3 — CSS Framework *(bonus)*

Tailwind CSS v4 with its palette, type stack and radii replaced by Codveda's tokens, so
utilities read as `bg-accent` and `text-ink` rather than `bg-blue-600`.

---

## Level 3 — Advanced

[`Level-3/`](Level-3/) · [detailed notes](Level-3/README.md)

### Task 2 — Performance Optimisation

The Level 1 landing page optimised and **measured**, not merely claimed. Lighthouse
mobile preset, median of three runs, both builds served from the same local machine:

| | Before | After |
|---|---|---|
| Performance | 75 | **99** |
| First Contentful Paint | 3.9 s | **1.5 s** |
| Largest Contentful Paint | 4.2 s | **1.8 s** |
| Speed Index | 4.9 s | **1.5 s** |
| Network requests | 11 | **9** |

The largest win was self-hosting the fonts, which removes a serial chain of four
round-trips across two third-party origins before any text can paint. Auditing also
revealed the original page requested seven font weights but applied only five — and Inter
costs 48 kB per weight.

Two findings are documented as honestly as the wins: lossy WebP came out 84 % *larger*
than the source PNGs, so the pipeline uses lossless and keeps the result only when it is
genuinely smaller; and total bytes transferred still rise 19 %, a deliberate trade of
payload for round-trips.

### Task 3 — Advanced Animations

GSAP 3 with ScrollTrigger: an entrance timeline, a staggered grid, a pinned section
scrubbed by the scrollbar, tweened counters and magnetic buttons. Only `transform` and
`opacity` are animated. Nothing is hidden by CSS, so a blocked script leaves a complete
page rather than a blank one. Motion can be disabled both by `prefers-reduced-motion` and
by a visible switch in the header.

### Task 1 — not attempted, and why

The brief's Level 3 Task 1 page is self-contradictory: the description asks for a Django
web application with authentication, while the title and all four objectives describe a
front-end component library documented with Storybook and published to NPM. The question
has been raised with the Codveda team; the two unambiguous tasks were completed in the
meantime.

---

## Design

All three projects share one system, built from Codveda's own published assets:

| | |
|---|---|
| **Logo** | The official wordmark on the blue bars, the official glyph on white grounds. Neither file is modified. |
| **Colour** | `#2563EB` primary and `#103EB2` deep blue from the site palette; `#1A73E8`, `#FFA500` and `#FF3131` from the logo's three shapes; `#E0E3EB` borders; `#F9FBFF` and `#1B1F29` grounds and text |
| **Type** | Poppins and Inter — the two families `codveda.com` itself loads |
| **Approach** | Light, flat colour only. No gradients, no textures, no drop shadows. Depth comes from white cards sitting on the off-white page. |

Colour contrast meets WCAG AA throughout. `#FFA500` and `#FF3131` fail AA as text on
white, so they are used only as rules, bullets and fills — coloured text is limited
to `#2563EB` and `#103EB2`.

## Accessibility

- Full keyboard navigation with a visible `:focus-visible` ring everywhere
- Skip links on the landing page and the form
- `aria-live` and `role="alert"` on every announced state change
- `prefers-reduced-motion: reduce` honoured across all three projects

## Browser support

Recent Chrome, Edge, Firefox and Safari. No framework, no NPM dependency.

---

## Note

These pages are a **student recreation** built for the internship, not the official
Codveda Technologies website. Content, figures and testimonials are reproduced from
`codveda.com` for the exercise.
