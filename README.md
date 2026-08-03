# Family Hub Card

A Home Assistant Lovelace card for a wall-mounted family tablet: today's
schedule for everyone in one timeline, plus who owes which chore — tap to tick
it off.

Works with any `calendar.*` and `todo.*` entities. No cloud, no account.

## Install

HACS → Frontend → custom repository `tempus2016/family-hub-card`, category
Lovelace. Then add the resource if your instance does not do it automatically.

## Configuration

```yaml
type: custom:family-hub-card
view: agenda
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
| `view` | `agenda` | `columns` and `week` are accepted but render agenda for now |
| `refresh_interval` | `300` | Seconds; minimum 60. One HTTP call per calendar per refresh |
| `chore_filter` | `today` | `today` = overdue, due today and undated. `all` = everything |
| `confirm_window` | `3` | Seconds to undo a tick before it is sent. `0` completes immediately |
| `taskmate_chores` | — | TaskMate's chores sensor, for completed-today and approval state |
| `people[].points` | — | A points sensor, shown as a balance beside the person |

Each person needs `calendars`, `todo`, or both.

## Chores

Chores come from one `todo.*` list per person. Any to-do list works — Home
Assistant's built-in Local To-do, Google Tasks, or anything else exposing a
`todo` entity.

[TaskMate](https://github.com/tempus2016/taskmate) is supported as an enhanced
backend: it already exposes one to-do list per child, so point `todo:` at it and
optionally add `points:` to show balances. Set `taskmate_chores:` to also show
what has been completed today, including chores waiting on a parent's approval.

## Development

```bash
npm install
npm test
npm run build
```

Verified against a local Home Assistant instance at tablet and phone widths.
