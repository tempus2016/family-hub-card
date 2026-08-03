# Contributing to Family Hub Card

Thanks for your interest in improving the Family Hub card! This is a Home
Assistant Lovelace card for a wall-mounted family tablet. Contributions of all
kinds are welcome — bug reports, feature ideas, docs, and code.

## Before you start

- **Bugs and features:** please open an issue first using the
  [issue templates](https://github.com/tempus2016/family-hub-card/issues/new/choose).
  For features especially, it's worth agreeing on the approach before writing
  code.
- **Questions and ideas:** use
  [Discussions](https://github.com/tempus2016/family-hub-card/discussions)
  rather than an issue.
- **Check the [wiki](https://github.com/tempus2016/family-hub-card/wiki)** —
  configuration reference, troubleshooting and FAQ live there.

## Project layout

```
src/
├── family-hub-card.js       # card entry: header, timers, hass plumbing
├── data/
│   ├── config.js            # YAML → normalised config, with validation
│   ├── hub-data.js          # the data layer: fetch, cache, refresh, complete
│   ├── calendar-source.js   # calendar REST fetch + event normalisation
│   ├── todo-source.js       # todo websocket list + completion service call
│   ├── taskmate-source.js   # TaskMate sensor reads (points, completions)
│   └── time.js              # timezone-correct day windows and rollover
├── views/agenda-view.js     # the agenda layout, now-line, undo window
├── editor/                  # visual editor (entity discovery only)
└── styles/shared.js         # the two type tiers and shared tokens

test/                        # vitest, one file per src module
dist/family-hub-card.js      # built bundle — committed, served by HACS
```

### Design constraints worth knowing

These aren't arbitrary; pushing against them is how the card gets worse:

- **Two type tiers, not three.** Tier 1 is legible from 2–3 metres across a
  room; tier 2 is arm's-length detail. A third tier turns the layout to mush.
- **Timezones come from Home Assistant, not the browser.** A tablet set to UTC
  in a `Europe/London` household must still roll over at local midnight. Use the
  helpers in `data/time.js`; never reach for `Date#getHours()` and friends.
- **The data layer keeps last-good data per person.** One broken calendar
  shouldn't blank out everybody else's day.
- **TaskMate is read through public sensors only.** Its websocket API is
  admin-gated and a wall tablet is usually signed in as a non-admin user.
- **The undo window is client-side and fires the service call on expiry.** It
  does not complete-then-reverse: TaskMate's un-tick is deliberately inert, so a
  reversing undo would work on stock lists and silently fail on TaskMate.

## Development setup

```bash
npm install
npm test          # vitest, watch-free single run
npm run lint      # eslint over src/ and test/
npm run build     # rollup → dist/family-hub-card.js
```

The fastest loop against a real instance:

1. Copy or symlink `dist/family-hub-card.js` into your HA config's `www/`
   directory (or point a HACS custom repository at your fork).
2. Add it as a Lovelace resource of type **JavaScript Module**.
3. After every `npm run build`, **hard-refresh** the browser (Ctrl/Cmd + Shift
   + R) — the browser caches the module aggressively.

If you change anything in `src/`, run `npm run build` and commit the updated
`dist/family-hub-card.js` in the same PR. CI fails the build if the committed
bundle doesn't match a fresh build of `src/`.

## Testing

Every data-layer module has a matching test file. New behaviour needs a test —
the data layer is pure functions and a class with injected clock/scheduler
precisely so it can be tested without a browser or a live HA.

- Inject time. `HubData` takes `getNow` and `schedule`; don't call `Date.now()`
  or `setInterval` directly in testable code.
- Test the timezone edges. Midnight rollover, DST, and all-day events are where
  the bugs actually are.
- Rendering tests use Lit's `render()` into a detached element — see
  `test/agenda-view.test.js`.

Unit tests are the floor. Anything that changes what the card renders should
also be looked at on a real HA instance at both tablet and phone width before
the PR is marked ready.

## Code style

- Vanilla JS modules, Lit for the components. No TypeScript, no build-time
  frameworks beyond rollup.
- Comments explain **why**, not what. If a line looks odd, say what would break
  without it.
- Keep `setConfig` validation loud: a config error should throw with a message
  naming the offending person or key, not fail silently at render time.

## Commits and PRs

- One logical change per PR.
- Conventional-ish commit subjects (`fix:`, `feat:`, `docs:`, `build:`) — the
  release notes are generated from them.
- Fill in the PR template, including the testing section.
- Please don't add AI co-author trailers or "generated with" footers to commits.

## Releases

Maintainer only:

1. Bump `version` in `package.json`.
2. `npm run build`, commit `dist/`.
3. Tag and publish a GitHub release — the release workflow re-runs lint, tests
   and the build, then attaches `family-hub-card.js` to the release, and a
   release-announcement discussion is posted automatically.

## Licence

By contributing you agree that your contributions are licensed under the
[MIT Licence](../LICENSE).
