# Lighthouse — before / after

Measured on 2026-08-28 with the Lighthouse mobile
preset, median of 3 runs. Both builds were served from the same local
machine, so neither benefits from a CDN the other does not have.

## Category scores

| Category | Before | After | Change |
|---|---|---|---|
| Performance | 75 | 99 | +24 |
| Accessibility | 100 | 100 | — |
| Best practices | 100 | 100 | — |
| SEO | 100 | 100 | — |

## Metrics

| Metric | Before | After | Change |
|---|---|---|---|
| First Contentful Paint | 3.9 s | 1.5 s | -61% |
| Largest Contentful Paint | 4.2 s | 1.8 s | -57% |
| Total Blocking Time | 0 ms | 40 ms | — |
| Cumulative Layout Shift | 0 | 0 | — |
| Speed Index | 4.9 s | 1.5 s | -69% |

## Payload

| | Before | After | Change |
|---|---|---|---|
| Network requests | 11 | 9 | -2 |
| Total transferred | 138 kB | 164 kB | +19% |

## Run-to-run spread

A single Lighthouse pass varies on a developer machine, which is why the
median is reported rather than the best run.

- before: 65, 81, 75
- after: 99, 99, 99
