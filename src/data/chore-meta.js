/**
 * What TaskMate knows about a chore beyond what its to-do list says.
 *
 * The to-do item carries only a name and a uid. TaskMate's chores sensor
 * lists the same chores with the same ids, plus the icon, the points, and the
 * flags that make a plain tick impossible: an open-ended chore needs a note,
 * a photo chore needs a photo, a quantity chore needs a number. TaskMate
 * refuses a bare `todo.update_item` on those (verified on 7.0.0), so the card
 * shows a label instead of a box rather than a box that un-ticks itself.
 */

export function blockedReason(chore) {
  if (!chore) return null;
  if (chore.open_ended) return 'note';
  if (chore.require_photo) return 'photo';
  if (chore.quantity_unit) return 'quantity';
  return null;
}

/** Map of to-do uid → { icon, stars, blocked, requiresApproval }. */
export function choreMeta(hass, entityId) {
  const out = new Map();
  if (!entityId) return out;
  const list = hass?.states?.[entityId]?.attributes?.chores;
  if (!Array.isArray(list)) return out;
  for (const c of list) {
    if (!c?.id) continue;
    out.set(c.id, {
      icon: c.icon || null,
      stars: Number(c.effective_points ?? c.points) || 0,
      blocked: blockedReason(c),
      requiresApproval: c.requires_approval !== false,
    });
  }
  return out;
}

// A small guess for stock lists, which carry no icon at all. Order matters:
// first match wins, so the specific words sit above the general ones.
const GUESSES = [
  [/teeth|toothbrush/i, 'mdi:toothbrush'],
  [/bed(room)?\b/i, 'mdi:bed'],
  [/dress|clothes|uniform/i, 'mdi:tshirt-crew'],
  [/school ?bag|backpack|pack(ing)?\b/i, 'mdi:bag-personal'],
  [/bin|rubbish|trash|recycl/i, 'mdi:trash-can-outline'],
  [/dish|plate|washing[- ]up/i, 'mdi:silverware-clean'],
  [/laundry|wash(ing)?\b|iron/i, 'mdi:washing-machine'],
  [/hoover|vacuum|sweep|mop|floor/i, 'mdi:robot-vacuum'],
  [/dog|walk/i, 'mdi:dog'],
  [/cat|litter/i, 'mdi:cat'],
  [/fish|tank/i, 'mdi:fish'],
  [/plant|water|garden|lawn|grass/i, 'mdi:flower'],
  [/homework|read|book|study|revis/i, 'mdi:book-open-page-variant'],
  [/piano|music|guitar|practi[sc]e/i, 'mdi:music'],
  [/tidy|clean|room/i, 'mdi:broom'],
  [/shower|bath|wash/i, 'mdi:shower'],
  [/table|dinner|lunch|breakfast|cook/i, 'mdi:silverware-fork-knife'],
  [/shop|grocer/i, 'mdi:cart-outline'],
  [/car\b|fuel/i, 'mdi:car'],
  [/screen|tablet|game/i, 'mdi:gamepad-variant'],
];

export function iconFor(summary, meta) {
  if (meta?.icon) return meta.icon;
  const s = String(summary || '');
  for (const [re, icon] of GUESSES) if (re.test(s)) return icon;
  return 'mdi:check-circle-outline';
}
