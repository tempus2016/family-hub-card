import { describe, it, expect } from 'vitest';
import { normaliseEvent, fetchEvents } from '../src/data/calendar-source.js';

const TZ = 'Europe/London';

describe('normaliseEvent', () => {
  it('normalises a timed event', () => {
    const e = normaliseEvent(
      {
        summary: 'Dentist',
        start: { dateTime: '2026-08-03T14:30:00+01:00' },
        end: { dateTime: '2026-08-03T15:00:00+01:00' },
        location: 'Inverness',
      },
      'ana',
      TZ,
    );
    expect(e.summary).toBe('Dentist');
    expect(e.allDay).toBe(false);
    expect(e.start.toISOString()).toBe('2026-08-03T13:30:00.000Z');
    expect(e.location).toBe('Inverness');
    expect(e.personId).toBe('ana');
  });

  it('normalises an all-day event to local midnight', () => {
    const e = normaliseEvent(
      { summary: 'Nursery closed', start: { date: '2026-08-03' }, end: { date: '2026-08-04' } },
      'cal',
      TZ,
    );
    expect(e.allDay).toBe(true);
    expect(e.start.toISOString()).toBe('2026-08-02T23:00:00.000Z');
  });

  it('gives distinct ids to events with identical summaries at different times', () => {
    const mk = (t) =>
      normaliseEvent({ summary: 'Walk', start: { dateTime: t }, end: { dateTime: t } }, 'ana', TZ);
    expect(mk('2026-08-03T09:00:00Z').id).not.toBe(mk('2026-08-03T17:00:00Z').id);
  });
});

describe('fetchEvents', () => {
  const people = [
    { id: 'ana', calendars: ['calendar.ana'] },
    { id: 'ben', calendars: ['calendar.ben_a', 'calendar.ben_b'] },
  ];
  const now = new Date('2026-08-03T10:00:00Z');

  it('calls the API once per calendar entity and tags events with their person', async () => {
    const calls = [];
    const hass = {
      callApi: async (method, path) => {
        calls.push([method, path]);
        return [{ summary: 'X', start: { dateTime: '2026-08-03T09:00:00Z' }, end: { dateTime: '2026-08-03T10:00:00Z' } }];
      },
    };
    const { events, failures } = await fetchEvents(hass, people, now, TZ);
    expect(calls).toHaveLength(3);
    expect(calls[0][0]).toBe('GET');
    expect(calls[0][1]).toMatch(/^calendars\/calendar\.ana\?start=.*&end=.*$/);
    expect(failures).toEqual([]);
    expect(events.filter((e) => e.personId === 'ben')).toHaveLength(2);
  });

  it('reports a failing calendar without losing the others', async () => {
    const hass = {
      callApi: async (_m, path) => {
        if (path.includes('ben_a')) throw new Error('boom');
        return [{ summary: 'X', start: { dateTime: '2026-08-03T09:00:00Z' }, end: { dateTime: '2026-08-03T10:00:00Z' } }];
      },
    };
    const { events, failures } = await fetchEvents(hass, people, now, TZ);
    expect(failures).toEqual(['calendar.ben_a']);
    expect(events).toHaveLength(2);
  });

  it('sorts events chronologically with all-day first', async () => {
    const hass = {
      callApi: async () => [
        { summary: 'Late', start: { dateTime: '2026-08-03T18:00:00Z' }, end: { dateTime: '2026-08-03T19:00:00Z' } },
        { summary: 'AllDay', start: { date: '2026-08-03' }, end: { date: '2026-08-04' } },
        { summary: 'Early', start: { dateTime: '2026-08-03T08:00:00Z' }, end: { dateTime: '2026-08-03T09:00:00Z' } },
      ],
    };
    const { events } = await fetchEvents(hass, [{ id: 'ana', calendars: ['calendar.ana'] }], now, TZ);
    expect(events.map((e) => e.summary)).toEqual(['AllDay', 'Early', 'Late']);
  });
});
