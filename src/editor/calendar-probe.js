import { localDayWindow } from '../data/time.js';

/**
 * Ask each calendar what it holds over the next week.
 *
 * A calendar entity's state only describes its current or next event, so
 * "is this calendar actually going to show anything" cannot be answered from
 * `hass.states` — it needs the same REST call the card makes. Worth doing in
 * the editor: picking a calendar that turns out to be empty looks exactly like
 * the card being broken.
 *
 * One call per calendar, only while the editor is open, so the cost lands on
 * config time rather than on the wall display.
 */
export async function probeCalendars(hass, entityIds, now = new Date(), tz = 'UTC') {
  const { start, end } = localDayWindow(now, tz, 7);
  const qs = `start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`;

  const results = {};
  await Promise.all(
    (entityIds || []).map(async (id) => {
      try {
        const raw = await hass.callApi('GET', `calendars/${encodeURIComponent(id)}?${qs}`);
        results[id] = { count: (raw || []).length };
      } catch (err) {
        results[id] = { error: err?.message || String(err) };
      }
    }),
  );
  return results;
}
