# Connected Platform 2028: Design Prototype

Interactive concept prototypes for a reimagined, AI-led Connected Platform, seen from both sides of the channel. These are **design and research probes, not product code**. All brands (Velocity Auto Group), people, locations and figures are fictional.

Start at `index.html` and choose an experience.

## Brand experience (David Lenzen, Velocity corporate marketing)

| Page | What it shows |
|---|---|
| `brand-home.html` | Status-first home: what's waiting on David, and where the network stands (initiative coverage, co-op committed, library gaps, AI build quality, claims, expiring pieces) |
| `brand-library.html` | The brand library of **pieces**, not finished ads: vehicles, logos, scenes, offers, copy, disclaimers, templates, video. Each piece shows how the AI will use it in real formats, what the AI recognized, and its usage rules (channels, regions, dates, required and forbidden pairings, rights). The upload flow recognizes each file, removes backgrounds, checks quality and brand rules, blurs real license plates, and closes the gaps dealers hit |
| `brand-approvals.html` | Only what the rules can't settle: dealer creative, co-op exceptions, asset requests, rule exceptions, shared buys. Each item carries the AI's recommendation and evidence, with one-click bulk approval of the confident ones and "make it a rule" for repeat decisions |
| `brand-coverage.html` | Where a national initiative actually ran across 64 locations, and why the rest didn't |

## Dealer experience (Maria Chen, Velocity Auto Riverside)

| Page | What it shows |
|---|---|
| `briefing.html` | Status first: what needs her, where she stands on tier, co-op, claims, payments, rebates and orders, direct answers to questions, a full claim review before attesting, then suggested playbooks |
| `playbook.html` | Running a playbook assembled from the brand's pieces: coverflow steps, chat edits, brand checks, audiences |
| `after-launch.html` | From committing money to co-op cash confirmed received, including a challenged determination |
| `on-your-behalf.html` | Everything done in her name, who did it, the permission it relied on, and editable limits |

`design-language.html` is the visual spec.

## Navigation

Every working page has the same left navigation, showing everything the platform does today, grouped by job. Items that aren't designed yet stay in the menu, and the browser tooltip names which of today's modules each one covers. The logo returns to the start page, the arrow collapses the menu to icons, and the card at the bottom switches between the brand and dealer views.

## Run it

It's a static site with no build step. Run `python3 -m http.server 8000` in this folder and open http://localhost:8000, or publish with GitHub Pages (Settings → Pages → deploy from branch, root folder). `.nojekyll` is included.

## How it's built

Each page keeps its markup as a template inside `<x-dc>`, plus a `Component` class in a `<script type="text/x-dc" data-dc-script>` block. `assets/dc-runtime.js` renders that format through React 18, which is vendored in `assets/vendor` with its MIT license.

## Assets

`assets/fonts/` holds Switzer (weights 400–700). Check that its license allows web redistribution before making the repository public. `assets/logo-mark.svg` is the Channel Fusion logo mark.
