# Security Policy

The Family Hub card is a Lovelace frontend card. It runs entirely in the
browser, inside your Home Assistant dashboard, using the signed-in user's own
session. It has no backend, stores nothing, and talks to nothing except your own
Home Assistant instance:

- `GET /api/calendars/<entity>` to list a day's events.
- The `todo/item/list` WebSocket command to list chores.
- The `todo.update_item` service to tick a chore off.
- Ordinary entity-state reads for points, weather and the header subtitle.

Everything it can do, the logged-in user could already do. There is no cloud
service and no telemetry.

Given that, the most plausible classes of issue are:

- **Rendering untrusted text unsafely.** Event summaries, chore names and
  TaskMate completion names come from data the card doesn't control. Lit escapes
  interpolated text by default; a change that introduces `unsafeHTML`, or that
  injects one of those strings into a `style` attribute, could break that.
- **Information disclosure through configuration.** The card renders whatever
  entities it is pointed at. A dashboard visible to a restricted user shows that
  user everything configured on the card.
- **A dependency compromise** in the small build chain (`lit`, `rollup`,
  `vitest`) reaching `dist/family-hub-card.js`, which is the file HACS serves.

## Supported versions

Only the **latest released version** receives security fixes. Before reporting,
please update to the newest release and confirm the issue still reproduces.

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Report privately using GitHub's
[private vulnerability reporting](https://github.com/tempus2016/family-hub-card/security/advisories/new)
(the **Report a vulnerability** button under the repository's **Security** tab).
This keeps the details private until a fix is available.

When reporting, please include:

- The card version and Home Assistant version.
- A description of the issue and its impact.
- Steps to reproduce, including the card YAML and any entity state involved.

## What to expect

This is a community project maintained in spare time, so timelines are
best-effort:

- **Acknowledgement** of your report as soon as is practical.
- An assessment and, if confirmed, a fix in a subsequent release.
- Credit in the release notes, unless you'd prefer to stay anonymous.

Thank you for helping keep the card and its users safe.
