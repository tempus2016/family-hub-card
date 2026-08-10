import { describe, it, expect } from 'vitest';
import { columnFor, eventTime } from '../src/views/columns-view.js';

const TZ = 'Europe/London';

const person = (over = {}) => ({
  id: 'ana', name: 'Ana', color: '#4A9EFF', initials: 'A',
  events: [], chores: [], completedToday: [], points: null, failures: [], todo: 'todo.ana',
  ...over,
});

describe('eventTime', () => {
  it('renders an all-day event as All day', () => {
    expect(eventTime({ allDay: true, start: new Date('2026-08-03T00:00:00Z') }, TZ)).toBe('All day');
  });

  it('renders a start time for a point event', () => {
    const e = { allDay: false, start: new Date('2026-08-03T13:30:00Z'), end: new Date('2026-08-03T13:30:00Z') };
    expect(eventTime(e, TZ)).toBe('14:30');
  });

  it('renders a range when the event has a distinct end', () => {
    const e = { allDay: false, start: new Date('2026-08-03T06:00:00Z'), end: new Date('2026-08-03T18:00:00Z') };
    expect(eventTime(e, TZ)).toBe('07:00 – 19:00');
  });
});

describe('columnFor', () => {
  it('splits chores into outstanding and done, done last', () => {
    const p = person({
      chores: [
        { id: '1', summary: 'Car fuel', status: 'needs_action' },
        { id: '2', summary: 'Bins out', status: 'completed' },
      ],
    });
    const col = columnFor(p);
    expect(col.chores.map((c) => c.summary)).toEqual(['Car fuel', 'Bins out']);
    expect(col.chores.map((c) => c.done)).toEqual([false, true]);
  });

  it('appends TaskMate completions that have left the list', () => {
    const p = person({
      chores: [{ id: '1', summary: 'Car fuel', status: 'needs_action' }],
      completedToday: [{ choreId: 'c9', name: 'Tidy room', approved: true }],
    });
    const col = columnFor(p);
    expect(col.chores.map((c) => c.summary)).toEqual(['Car fuel', 'Tidy room']);
    expect(col.chores[1].done).toBe(true);
    expect(col.chores[1].tappable).toBe(false);
  });

  it('marks an unapproved completion as pending', () => {
    const p = person({ completedToday: [{ choreId: 'c9', name: 'Dog', approved: false }] });
    expect(columnFor(p).chores[0].pending).toBe(true);
  });

  it('does not duplicate a chore present in both sources', () => {
    const p = person({
      chores: [{ id: '1', summary: 'Bins out', status: 'completed' }],
      completedToday: [{ choreId: 'c1', name: 'Bins out', approved: true }],
    });
    expect(columnFor(p).chores).toHaveLength(1);
  });

  it('reports the outstanding count for the divider', () => {
    const p = person({
      chores: [
        { id: '1', summary: 'A', status: 'needs_action' },
        { id: '2', summary: 'B', status: 'needs_action' },
        { id: '3', summary: 'C', status: 'completed' },
      ],
    });
    expect(columnFor(p).outstanding).toBe(2);
  });

  it('says a person has no chore list rather than showing an empty section', () => {
    expect(columnFor(person({ todo: null })).hasChores).toBe(false);
  });

  it('keeps the chores section for a person whose list is merely empty', () => {
    expect(columnFor(person({ todo: 'todo.ana', chores: [] })).hasChores).toBe(true);
  });
});

describe('columnFor with inline chores', () => {
  const evt = (summary) => ({
    id: `e-${summary}`, summary, allDay: false,
    start: new Date('2026-08-10T06:00:00Z'), end: new Date('2026-08-10T12:00:00Z'),
  });

  it('leaves events unpaired and chores intact when inlineChores is off', () => {
    const p = person({
      events: [evt('Make bed')],
      chores: [{ id: '1', summary: 'Make bed', status: 'needs_action' }],
    });
    const col = columnFor(p);
    expect(col.events.map((x) => x.chore)).toEqual([null]);
    expect(col.chores.map((c) => c.summary)).toEqual(['Make bed']);
  });

  it('moves a matched chore onto its event when inlineChores is on', () => {
    const p = person({
      events: [evt('Make bed')],
      chores: [{ id: '1', summary: 'Make bed', status: 'needs_action' }],
    });
    const col = columnFor(p, true);
    expect(col.events[0].chore.summary).toBe('Make bed');
    expect(col.events[0].chore.tappable).toBe(true);
    expect(col.chores).toEqual([]);
  });

  it('keeps an unmatched chore in the list', () => {
    const p = person({
      events: [evt('Make bed')],
      chores: [
        { id: '1', summary: 'Make bed', status: 'needs_action' },
        { id: '2', summary: 'Tidy bedroom', status: 'needs_action' },
      ],
    });
    const col = columnFor(p, true);
    expect(col.chores.map((c) => c.summary)).toEqual(['Tidy bedroom']);
    expect(col.outstanding).toBe(1);
  });

  it('moves a completed chore onto its event too', () => {
    const p = person({
      events: [evt('Make bed')],
      chores: [{ id: '1', summary: 'Make bed', status: 'completed' }],
    });
    const col = columnFor(p, true);
    expect(col.events[0].chore.done).toBe(true);
    expect(col.events[0].chore.tappable).toBe(false);
    expect(col.chores).toEqual([]);
  });

  it('moves a TaskMate-only completion onto its event, still untappable', () => {
    const p = person({
      events: [evt('Make bed')],
      chores: [],
      completedToday: [{ choreId: 'c1', name: 'Make bed', approved: false }],
    });
    const col = columnFor(p, true);
    expect(col.events[0].chore.done).toBe(true);
    expect(col.events[0].chore.pending).toBe(true);
    expect(col.events[0].chore.tappable).toBe(false);
    expect(col.chores).toEqual([]);
  });

  it('prefers the outstanding chore over a completed one of the same name', () => {
    const p = person({
      events: [evt('Make bed')],
      chores: [
        { id: 'done', summary: 'Make bed', status: 'completed' },
        { id: 'open', summary: 'Make bed', status: 'needs_action' },
      ],
    });
    const col = columnFor(p, true);
    expect(col.events[0].chore.id).toBe('open');
    expect(col.chores.map((c) => c.id)).toEqual(['done']);
  });

  // Otherwise the column prints "Chores · all done" over a person who has done
  // nothing at all — their chores have merely moved onto their event rows.
  it('drops the chores block when every chore moved to an event', () => {
    const p = person({
      events: [evt('Make bed')],
      chores: [{ id: '1', summary: 'Make bed', status: 'needs_action' }],
    });
    expect(columnFor(p, true).hasChores).toBe(false);
  });

  it('keeps the chores block when a leftover chore remains', () => {
    const p = person({
      events: [evt('Make bed')],
      chores: [
        { id: '1', summary: 'Make bed', status: 'needs_action' },
        { id: '2', summary: 'Tidy bedroom', status: 'needs_action' },
      ],
    });
    expect(columnFor(p, true).hasChores).toBe(true);
  });

  it('still shows an empty chores block for a person with a list when inline is off', () => {
    expect(columnFor(person({ todo: 'todo.ana', chores: [] }), false).hasChores).toBe(true);
  });

  // These lock the data contract the event-row markup depends on. The markup
  // itself can only be checked on the dev instance — the node test environment
  // has no DOM.
  it('marks an unapproved completion pending so the event row can flag it', () => {
    const p = person({
      events: [evt('Make bed')],
      chores: [],
      completedToday: [{ choreId: 'c1', name: 'Make bed', approved: false }],
    });
    expect(columnFor(p, true).events[0].chore.pending).toBe(true);
  });

  it('does not mark an approved completion pending', () => {
    const p = person({
      events: [evt('Make bed')],
      chores: [],
      completedToday: [{ choreId: 'c1', name: 'Make bed', approved: true }],
    });
    expect(columnFor(p, true).events[0].chore.pending).toBe(false);
  });
});
