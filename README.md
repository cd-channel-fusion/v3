# Connected Platform 2028: Design Prototype

Interactive concept prototypes for a reimagined, AI-led Connected Platform. These are **design and research probes, not product code**. All brands (Velocity Auto Group), people, locations and figures are fictional.

## Pages

| Page | What it shows | Research records |
|---|---|---|
| `index.html` | Gallery and entry point | — |
| `design-language.html` | Principles, color, glass tiers, type, motion tokens, signature patterns | — |
| `briefing.html` | A location's home: suggested playbooks, card-deck filters, running work, money on the table | J04, J17 |
| `playbook.html` | Running a playbook: coverflow steps, include / modify / skip, chat edits, brand checks, review-all grid, audience details with edit and swap | J04, J05, J07.A, PJ09 |
| `after-launch.html` | Commit → running → delivered → determined → challenge resolved → paid → received | J07.A, J07, J15, T06, J16 |
| `on-your-behalf.html` | Every act done in the dealer's name, who did it, the authority it relied on, and editable limits | PT01, G03 |
| `brand-coverage.html` | Where a national initiative actually ran across 64 locations, and why the rest didn't | PJ14, PJ19 |

Record IDs refer to the Connected Platform jobs-to-be-done research catalog, which is still a draft and hasn't been validated with customers.

## Run it

It's a static site with no build step.

- **Locally:** from this folder, run `python3 -m http.server 8000` and open http://localhost:8000. Opening the files straight from disk also works in most browsers.
- **GitHub Pages:** push this folder to a repository, then go to Settings → Pages → Deploy from a branch, and pick the branch and the root folder. `.nojekyll` is included so the assets are served as-is.

## How it's built

Each page keeps its markup as a template inside `<x-dc>`, plus a `<script type="text/x-dc" data-dc-script>` block that defines a `Component` class with a `renderVals()` method. `assets/dc-runtime.js` is a small renderer for that format. It handles:

- `{{ }}` lookups
- `<sc-for>` and `<sc-if>`
- event handlers

It renders through React 18 (vendored in `assets/vendor`, MIT license included) so transitions and animations behave as designed.

To change a page, edit its template markup or its `Component` class directly.

## Assets

- `assets/fonts/`: Switzer (Channel Fusion's brand typeface), weights 400–700. Check that its license allows web redistribution before making the repository public.
- `assets/logo-mark.svg`: Channel Fusion logo mark.
- `assets/vendor/`: React and React DOM 18.3.1 (production UMD builds).
