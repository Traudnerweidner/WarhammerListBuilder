# AGENTS.md

Warhammer 40k (11th Edition) list builder. Plain browser JavaScript, no build step, runs offline from `index.html`.

## Structure
- `rules.js`, `play.js`: ES3 only (they also run under Windows Script Host). No `forEach`/`indexOf`/`JSON`/`trim` etc.
- `app.js`: browser UI (ES5 allowed, but must still parse under JScript).
- `data/index.js`, `data/factions/*.js`: **generated**, never edit by hand.
- `tools/`: Node generator and checks, using `@alpaca-software/40kdc-data` (pinned version in `tools/package.json`).
- `tools/overlays/adepta-sororitas*.{js,json}`: hand-transcribed Sororitas rules texts, hints and name aliases, merged into the generated data.

## Commands
- Tests (WSH): `cscript //nologo tests.wsf`
- Regenerate data (in `tools/`): `npm run build-data`
- Verify against the library (in `tools/`): `npm run verify-data`
- UI smoke test in headless Edge (in `tools/`): `npm run ui-test`

After changing `rules.js`, `play.js`, `app.js` or the generator: run all four commands.

## Notes
- Public deployments must show "Powered by 40kdc-data" linking to https://40kdc.alpacasoft.dev (already in the footer and in the sources panel).
- The dataset contains no official rules text; only Sororitas has texts (from the overlay). Leave other texts empty.
