import { describe, it, expect } from 'vitest';
import { buildTimeline, nowLineIndex, FamilyHubAgenda } from '../src/views/agenda-view.js';

const ana = { id: 'ana', name: 'Ana', color: '#4A9EFF' };
const ben = { id: 'ben', name: 'Ben', color: '#FF4A87' };

const people = [
  {
    ...ana,
    events: [
      { id: 'a1', summary: 'Site', start: new Date('2026-08-03T06:00:00Z'), end: new Date('2026-08-03T18:00:00Z'), allDay: false },
      { id: 'a2', summary: 'Call', start: new Date('2026-08-03T19:30:00Z'), end: new Date('2026-08-03T20:00:00Z'), allDay: false },
    ],
  },
  {
    ...ben,
    events: [
      { id: 'b1', summary: 'Closed', start: new Date('2026-08-02T23:00:00Z'), end: new Date('2026-08-03T23:00:00Z'), allDay: true },
      { id: 'b2', summary: 'Swimming', start: new Date('2026-08-03T09:00:00Z'), end: new Date('2026-08-03T10:00:00Z'), allDay: false },
    ],
  },
];

describe('buildTimeline', () => {
  it('merges people into one chronological list with all-day first', () => {
    const t = buildTimeline(people);
    expect(t.map((r) => r.event.summary)).toEqual(['Closed', 'Site', 'Swimming', 'Call']);
  });

  it('tags each row with its owning person', () => {
    const t = buildTimeline(people);
    expect(t.find((r) => r.event.summary === 'Swimming').person.name).toBe('Ben');
  });

  it('returns an empty list when nobody has events', () => {
    expect(buildTimeline([{ ...ana, events: [] }])).toEqual([]);
  });
});

describe('nowLineIndex', () => {
  const timeline = buildTimeline(people);

  it('places the line before the first event still to come', () => {
    expect(nowLineIndex(timeline, new Date('2026-08-03T08:00:00Z'))).toBe(2);
  });

  it('returns -1 before any timed event has started', () => {
    expect(nowLineIndex(timeline, new Date('2026-08-03T05:00:00Z'))).toBe(-1);
  });

  it('places the line at the end once everything has started', () => {
    expect(nowLineIndex(timeline, new Date('2026-08-03T21:00:00Z'))).toBe(4);
  });

  it('ignores all-day rows when positioning', () => {
    expect(nowLineIndex(buildTimeline([people[1]]), new Date('2026-08-03T10:00:00Z'))).toBe(2);
  });
});

describe('undo window', () => {
  function makeView(confirmWindow = 3) {
    const view = new FamilyHubAgenda();
    view.confirmWindow = confirmWindow;
    view.requestUpdate = () => {};
    const fired = [];
    view.dispatchEvent = (e) => { fired.push(e.detail); return true; };
    return { view, fired };
  }

  it('does not fire the completion while the window is open', () => {
    const { view, fired } = makeView();
    view._tap('ana', 'c1');
    expect(fired).toEqual([]);
    expect(view._pending.size).toBe(1);
  });

  it('cancels the completion when tapped again inside the window', () => {
    const { view, fired } = makeView();
    view._tap('ana', 'c1');
    view._tap('ana', 'c1');
    expect(fired).toEqual([]);
    expect(view._pending.size).toBe(0);
  });

  it('fires immediately when confirmWindow is 0', () => {
    const { view, fired } = makeView(0);
    view._tap('ana', 'c1');
    expect(fired).toEqual([{ personId: 'ana', choreId: 'c1' }]);
  });

  it('flushes queued completions rather than dropping them', () => {
    const { view, fired } = makeView();
    view._tap('ana', 'c1');
    view._tap('ben', 'c2');
    view.flushPending();
    expect(fired).toEqual([
      { personId: 'ana', choreId: 'c1' },
      { personId: 'ben', choreId: 'c2' },
    ]);
    expect(view._pending.size).toBe(0);
  });

  it('fires the completion when the window expires', async () => {
    const { view, fired } = makeView(0.05);
    view._tap('ana', 'c1');
    await new Promise((r) => setTimeout(r, 120));
    expect(fired).toEqual([{ personId: 'ana', choreId: 'c1' }]);
    expect(view._pending.size).toBe(0);
  });
});
