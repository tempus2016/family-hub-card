import { describe, it, expect } from 'vitest';
import { probeCalendars } from '../src/editor/calendar-probe.js';

const evt = { summary: 'X', start: { dateTime: '2026-08-04T09:00:00Z' }, end: { dateTime: '2026-08-04T10:00:00Z' } };

describe('probeCalendars', () => {
  it('reports the event count per calendar', async () => {
    const hass = { callApi: async (_m, p) => (p.includes('busy') ? [evt, evt] : []) };
    const out = await probeCalendars(hass, ['calendar.busy', 'calendar.empty']);
    expect(out['calendar.busy']).toEqual({ count: 2 });
    expect(out['calendar.empty']).toEqual({ count: 0 });
  });

  it('asks for a week from today', async () => {
    const paths = [];
    const hass = { callApi: async (_m, p) => { paths.push(p); return []; } };
    await probeCalendars(hass, ['calendar.a'], new Date('2026-08-03T10:00:00Z'), 'Europe/London');
    const q = new URLSearchParams(paths[0].split('?')[1]);
    expect(new Date(q.get('end')) - new Date(q.get('start'))).toBe(7 * 24 * 3600 * 1000);
  });

  it('records a failure rather than throwing', async () => {
    const hass = { callApi: async () => { throw new Error('gone'); } };
    const out = await probeCalendars(hass, ['calendar.missing']);
    expect(out['calendar.missing'].error).toBe('gone');
    expect(out['calendar.missing'].count).toBeUndefined();
  });

  it('keeps a working calendar when another fails', async () => {
    const hass = {
      callApi: async (_m, p) => {
        if (p.includes('bad')) throw new Error('gone');
        return [evt];
      },
    };
    const out = await probeCalendars(hass, ['calendar.good', 'calendar.bad']);
    expect(out['calendar.good'].count).toBe(1);
    expect(out['calendar.bad'].error).toBeTruthy();
  });

  it('returns an empty result for no calendars', async () => {
    expect(await probeCalendars({ callApi: async () => [] }, [])).toEqual({});
  });
});
