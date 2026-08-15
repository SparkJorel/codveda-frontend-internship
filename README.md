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
| **Level 2 — Intermediate** | Not started | — |
| **Level 3 — Advanced** | Not started | — |

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
