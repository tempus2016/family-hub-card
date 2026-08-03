<h1 align="center">Family Hub Card</h1>

<p align="center">
  <strong>Everyone's day on one screen, and the chores nobody can claim they forgot.</strong><br>
  A Home Assistant Lovelace card for the wall tablet in your kitchen.
</p>

<p align="center">
  <a href="https://github.com/hacs/default"><img src="https://img.shields.io/badge/HACS-Custom-41BDF5.svg" alt="HACS Custom"></a>
  <a href="https://github.com/tempus2016/family-hub-card/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License"></a>
  <img src="https://img.shields.io/badge/Home%20Assistant-2024.1+-blue" alt="HA Version">
</p>

<!-- Add once v0.1.0 is published — both render as red error badges until the
     first release exists:
  <a href="https://github.com/tempus2016/family-hub-card/releases"><img src="https://img.shields.io/github/v/release/tempus2016/family-hub-card" alt="Latest Release"></a>
  <a href="https://github.com/tempus2016/family-hub-card/releases"><img src="https://img.shields.io/github/downloads/tempus2016/family-hub-card/total" alt="Downloads"></a>
-->

<p align="center">
  <a href="https://github.com/tempus2016/family-hub-card/actions/workflows/validate.yml"><img src="https://github.com/tempus2016/family-hub-card/actions/workflows/validate.yml/badge.svg" alt="HACS Validation"></a>
  <a href="https://github.com/tempus2016/family-hub-card/actions/workflows/tests.yml"><img src="https://github.com/tempus2016/family-hub-card/actions/workflows/tests.yml/badge.svg" alt="Lint &amp; Test"></a>
</p>

---

A Home Assistant Lovelace card for a wall-mounted family tablet: today's
schedule for everyone in one timeline, plus who owes which chore — tap to tick
it off.

Works with any `calendar.*` and `todo.*` entities. No cloud, no account.

![Family Hub Card on a wall tablet](images/agenda-tablet.png)

Everyone's day in one timeline with a live "now" line, and each person's
outstanding chores beside it. Tapping a chore ticks it off, with a few seconds
to undo before anything is sent.

On a phone the chore panel drops below the timeline, so the same dashboard works
on the wall and in your pocket:

<img src="images/agenda-phone.png" alt="Family Hub Card at phone width" width="360">

📖 **[Full documentation is in the wiki](https://github.com/tempus2016/family-hub-card/wiki)** —
configuration reference, wall-tablet setup, troubleshooting and FAQ.

## Install

HACS → Frontend → custom repository `tempus2016/family-hub-card`, category
Lovelace. Then add the resource if your instance does not do it automatically —
type **JavaScript Module**, not JavaScript file.

Full instructions, including manual install: [Installation](https://github.com/tempus2016/family-hub-card/wiki/Installation).

## Configuration

```yaml
type: custom:family-hub-card
view: agenda
theme: auto
refresh_interval: 300
chore_filter: today
confirm_window: 3
header:
  clock: true
  weather: weather.home
  subtitle: sensor.bin_collection
people:
  - name: Ana
    color: "#4A9EFF"
    calendars: [calendar.ana_work, calendar.family]
    todo: todo.ana_chores
```

| Option | Default | Notes |
|---|---|---|
| `theme` | `auto` | `auto` follows Home Assistant's dark mode. `dark` or `light` pins it — useful for a wall tablet |
| `view` | `agenda` | `columns` and `week` are accepted but render agenda for now |
| `refresh_interval` | `300` | Seconds; minimum 60. One HTTP call per calendar per refresh |
| `chore_filter` | `today` | `today` = overdue, due today and undated. `all` = everything |
| `confirm_window` | `3` | Seconds to undo a tick before it is sent. `0` completes immediately |
| `taskmate_chores` | — | TaskMate's chores sensor, for completed-today and approval state |
| `people[].points` | — | A points sensor, shown as a balance beside the person |

Each person needs `calendars`, `todo`, or both. Every option, including the
per-person keys and the validation rules:
[Configuration](https://github.com/tempus2016/family-hub-card/wiki/Configuration).

## Chores

Chores come from one `todo.*` list per person. Any to-do list works — Home
Assistant's built-in Local To-do, Google Tasks, or anything else exposing a
`todo` entity.

[TaskMate](https://github.com/tempus2016/taskmate) is supported as an enhanced
backend: it already exposes one to-do list per child, so point `todo:` at it and
optionally add `points:` to show balances. Set `taskmate_chores:` to also show
what has been completed today, including chores waiting on a parent's approval.

Note that completed-today rows need **both** `points:` and `taskmate_chores:` —
the card matches completions to a person using the `child_id` attribute on the
points sensor. See
[TaskMate Integration](https://github.com/tempus2016/family-hub-card/wiki/TaskMate-Integration).

## Development

```bash
npm install
npm test          # vitest
npm run lint      # eslint
npm run build     # rollup → dist/family-hub-card.js
```

`dist/family-hub-card.js` is committed because HACS serves it straight from the
repo, so **run `npm run build` and commit the result whenever you change
`src/`** — CI fails the build if the committed bundle doesn't match a fresh one.

Verified against a local Home Assistant instance at tablet and phone widths.

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) before opening a PR, and
[Development](https://github.com/tempus2016/family-hub-card/wiki/Development)
for the design constraints behind the code.

## Links

- [Documentation wiki](https://github.com/tempus2016/family-hub-card/wiki)
- [Report a bug or request a feature](https://github.com/tempus2016/family-hub-card/issues/new/choose)
- [Discussions](https://github.com/tempus2016/family-hub-card/discussions)
- [Security policy](.github/SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

## Licence

[MIT](LICENSE)
