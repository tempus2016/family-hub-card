import { localDayWindow } from './time.js';

/**
 * A calendar entity's state only ever describes the current or next event, so
 * a day's list has to come from the REST endpoint rather than the state
 * machine. One HTTP call per calendar entity per refresh.
 */

function parseAllDay(dateStr, tz) {
  // `start.date` is a bare local date; anchor it to local midnight.
  const [y, m, d] = dateStr.split('-').map(Number);
  const { start } = localDayWindow(new Date(Date.UTC(y, m - 1, d, 12)), tz);
  return start;
}

export function normaliseEvent(raw, personId, tz) {
  const allDay = Boolean(raw.start?.date && !raw.start?.dateTime);
  const start = allDay ? parseAllDay(raw.start.date, tz) : new Date(raw.start.dateTime);
  const end = allDay
    ? parseAllDay(raw.end?.date || raw.start.date, tz)
    : new Date(raw.end?.dateTime || raw.start.dateTime);
  const summary = raw.summary || '';
  return {
    id: `${personId}:${summary}:${start.toISOString()}`,
    personId,
    summary,
    start,
    end,
    allDay,
    location: raw.location || '',
  };
}

export async function fetchEvents(hass, people, now, tz) {
  const { start, end } = localDayWindow(now, tz);
  const qs = `start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`;

  const jobs = [];
  for (const person of people) {
    for (const entity of person.calendars || []) {
      jobs.push({ person, entity });
    }
  }

  const failures = [];
  const results = await Promise.all(
    jobs.map(async ({ person, entity }) => {
      try {
        const raw = await hass.callApi('GET', `calendars/${entity}?${qs}`);
        return (raw || []).map((r) => normaliseEvent(r, person.id, tz));
      } catch {
        failures.push(entity);
        return [];
      }
    }),
  );

  const events = results.flat().sort((a, b) => {
    if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
    return a.start - b.start;
  });

  return { events, failures };
}
