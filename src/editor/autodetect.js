import { PALETTE } from '../data/config.js';

/**
 * Find TaskMate children in hass and propose card people for them.
 *
 * The child's name comes from a sensor's `child_name` attribute. The matching
 * to-do entity has to be paired heuristically, because it carries no
 * `child_name` of its own — verified on a live instance:
 *
 *   sensor.taskmate_ana_points  child_name=Ana  "TaskMate Ana Points"
 *   todo.taskmate_ana           (none)            "TaskMate Ana"
 *
 * Both pairing rules lean on names a user can change, which is why callers show
 * these as proposals to confirm rather than applying them directly.
 */

/** Sensors that name a TaskMate child, preferring `_points` over `_stats`. */
function pointsSensorsByChild(states) {
  const byChild = new Map();
  for (const [id, st] of Object.entries(states)) {
    if (!id.startsWith('sensor.')) continue;
    const child = st?.attributes?.child_name;
    if (!child) continue;
    const existing = byChild.get(child);
    // The points sensor is the one carrying the balance the card renders.
    if (!existing || (id.endsWith('_points') && !existing.endsWith('_points'))) {
      byChild.set(child, id);
    }
  }
  return byChild;
}

function pairTodo(states, sensorId, sensorName) {
  const todoIds = Object.keys(states).filter((id) => id.startsWith('todo.'));

  // 1. friendly_name minus the " Points" suffix.
  if (sensorName?.endsWith(' Points')) {
    const want = sensorName.slice(0, -' Points'.length);
    const hit = todoIds.find((id) => states[id]?.attributes?.friendly_name === want);
    if (hit) return hit;
  }

  // 2. entity_id with the sensor prefix and _points suffix stripped.
  const slug = sensorId.replace(/^sensor\./, '').replace(/_(points|stats)$/, '');
  const byId = `todo.${slug}`;
  if (states[byId]) return byId;

  return null;
}

export function detectPeople(hass, existingPeople = []) {
  const states = hass?.states;
  if (!states) return [];

  const taken = new Set(
    (existingPeople || []).map((p) => String(p.name || '').trim().toLowerCase()),
  );

  const out = [];
  let paletteIndex = (existingPeople || []).length;

  for (const [child, sensorId] of pointsSensorsByChild(states)) {
    if (taken.has(child.trim().toLowerCase())) continue;
    out.push({
      name: child,
      color: PALETTE[paletteIndex % PALETTE.length],
      calendars: [],
      todo: pairTodo(states, sensorId, states[sensorId]?.attributes?.friendly_name),
      points: sensorId,
    });
    paletteIndex += 1;
  }

  return out;
}
