import { describe, it, expect } from 'vitest';
import {
  buildTimeline, nowLineIndex, FamilyHubAgenda, choreCandidates, linkPerson,
} from '../src/views/agenda-view.js';

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

describe('read-only paging', () => {
  function makeView(readOnly) {
    const view = new FamilyHubAgenda();
    view.confirmWindow = 3;
    view.readOnly = readOnly;
    view.requestUpdate = () => {};
    const fired = [];
    view.dispatchEvent = (e) => { fired.push(e.detail); return true; };
    return { view, fired };
  }

  it('ignores taps when paged away from today', () => {
    const { view, fired } = makeView(true);
    view._tap('ana', 'c1');
    expect(fired).toEqual([]);
    expect(view._pending.size).toBe(0);
  });

  it('still accepts taps on today', () => {
    const { view } = makeView(false);
    view._tap('ana', 'c1');
    expect(view._pending.size).toBe(1);
  });
});

const withChores = (over = {}) => ({
  id: 'ana', name: 'Ana', color: '#4A9EFF',
  events: [], chores: [], completedToday: [], todo: 'todo.ana',
  ...over,
});

describe('choreCandidates', () => {
  it('orders outstanding, then completed, then TaskMate completions', () => {
    const p = withChores({
      chores: [
        { id: 'd', summary: 'Done one', status: 'completed' },
        { id: 'o', summary: 'Open one', status: 'needs_action' },
      ],
      completedToday: [{ choreId: 't', name: 'TaskMate one', approved: true }],
    });
    expect(choreCandidates(p).map((c) => c.summary)).toEqual(['Open one', 'Done one', 'TaskMate one']);
    expect(choreCandidates(p).map((c) => c.kind)).toEqual(['chore', 'chore', 'today']);
  });

  it('points ref at the original object', () => {
    const chore = { id: 'o', summary: 'Open one', status: 'needs_action' };
    const p = withChores({ chores: [chore] });
    expect(choreCandidates(p)[0].ref).toBe(chore);
  });
});

describe('linkPerson', () => {
  it('matches nothing when inlineChores is off', () => {
    const chore = { id: '1', summary: 'Make bed', status: 'needs_action' };
    const p = withChores({ events: [{ id: 'e1', summary: 'Make bed' }], chores: [chore] });
    const { pairs, matchedRefs } = linkPerson(p, false);
    expect(pairs[0].chore).toBe(null);
    expect(matchedRefs.size).toBe(0);
  });

  it('matches an event to a chore and reports the original ref', () => {
    const chore = { id: '1', summary: 'Make bed', status: 'needs_action' };
    const p = withChores({ events: [{ id: 'e1', summary: 'Make bed' }], chores: [chore] });
    const { pairs, matchedRefs } = linkPerson(p, true);
    expect(pairs[0].chore.ref).toBe(chore);
    expect(matchedRefs.has(chore)).toBe(true);
  });

  it('reports a TaskMate completion ref by its name', () => {
    const done = { choreId: 'c1', name: 'Make bed', approved: false };
    const p = withChores({ events: [{ id: 'e1', summary: 'Make bed' }], completedToday: [done] });
    const { pairs, matchedRefs } = linkPerson(p, true);
    expect(pairs[0].chore.kind).toBe('today');
    expect(matchedRefs.has(done)).toBe(true);
  });

  it('leaves an unmatched chore out of matchedRefs', () => {
    const a = { id: '1', summary: 'Make bed', status: 'needs_action' };
    const b = { id: '2', summary: 'Tidy bedroom', status: 'needs_action' };
    const p = withChores({ events: [{ id: 'e1', summary: 'Make bed' }], chores: [a, b] });
    const { matchedRefs } = linkPerson(p, true);
    expect(matchedRefs.has(a)).toBe(true);
    expect(matchedRefs.has(b)).toBe(false);
  });
});

describe('buildTimeline with links', () => {
  it('attaches the matched chore to its row', () => {
    const chore = { id: '1', summary: 'Make bed', status: 'needs_action' };
    const p = withChores({
      events: [{ id: 'e1', summary: 'Make bed', start: new Date('2026-08-10T06:00:00Z'), allDay: false }],
      chores: [chore],
    });
    const linked = new Map([[p.id, linkPerson(p, true)]]);
    const rows = buildTimeline([p], linked);
    expect(rows[0].chore.ref).toBe(chore);
  });

  it('leaves rows unlinked when no map is supplied', () => {
    const p = withChores({
      events: [{ id: 'e1', summary: 'Make bed', start: new Date('2026-08-10T06:00:00Z'), allDay: false }],
      chores: [{ id: '1', summary: 'Make bed', status: 'needs_action' }],
    });
    expect(buildTimeline([p])[0].chore).toBe(null);
  });
});
