import { describe, it, expect } from 'vitest';
import { buildTimeline, nowLineIndex, linkPerson, collapseChores } from '../src/data/timeline.js';

const ana = { id: 'ana', name: 'Ana', color: '#4A9EFF' };
const ben = { id: 'ben', name: 'Ben', color: '#FF4A87' };
const people = [
  { ...ana, events: [
    { id: 'a1', summary: 'Site', start: new Date('2026-08-03T06:00:00Z'), end: new Date('2026-08-03T18:00:00Z'), allDay: false },
    { id: 'a2', summary: 'Call', start: new Date('2026-08-03T19:30:00Z'), end: new Date('2026-08-03T20:00:00Z'), allDay: false },
  ] },
  { ...ben, events: [
    { id: 'b1', summary: 'Closed', start: new Date('2026-08-02T23:00:00Z'), end: new Date('2026-08-03T23:00:00Z'), allDay: true },
    { id: 'b2', summary: 'Swimming', start: new Date('2026-08-03T09:00:00Z'), end: new Date('2026-08-03T10:00:00Z'), allDay: false },
  ] },
];

describe('buildTimeline', () => {
  it('merges people into one chronological list with all-day first', () => {
    expect(buildTimeline(people).map((r) => r.event.summary)).toEqual(['Closed', 'Site', 'Swimming', 'Call']);
  });

  it('shows a shared event once, naming everyone', () => {
    const zoo = { id: 'calendar.family:Zoo:x', summary: 'Zoo', start: new Date('2026-08-03T13:00:00Z'), end: new Date('2026-08-03T15:00:00Z'), allDay: false };
    const rows = buildTimeline([{ ...ana, events: [zoo] }, { ...ben, events: [zoo] }]);
    expect(rows).toHaveLength(1);
    expect(rows[0].people.map((p) => p.name)).toEqual(['Ana', 'Ben']);
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
});

describe('linkPerson', () => {
  const p = { ...ana, todo: 'todo.ana', events: [{ id: 'e1', summary: 'Make bed' }], chores: [{ id: '1', summary: 'Make bed', status: 'needs_action' }], completedToday: [] };
  it('matches an event to a task when inline chores are on', () => {
    const { pairs, matched } = linkPerson(p, true);
    expect(pairs[0].chore.id).toBe('1');
    expect(matched.size).toBe(1);
  });
  it('matches nothing when off', () => {
    expect(linkPerson(p, false).pairs[0].chore).toBeNull();
  });
});

describe('collapseChores', () => {
  const mk = (id, personId, summary, isChore, start = '2026-10-18T06:00:00Z') => ({ id, personId, summary, isChore, start: new Date(start), end: new Date(start), allDay: false });
  const people = [
    { ...ana, progress: { done: 2, total: 4 }, events: [mk('a1', 'ana', 'Make bed', true), mk('a2', 'ana', 'Brush teeth', true), mk('a3', 'ana', 'Dentist', false, '2026-10-18T13:00:00Z')] },
    { ...ben, progress: { done: 0, total: 1 }, events: [mk('b1', 'ben', 'Make bed', true)] },
  ];

  it('replaces each person’s chore events with one summary row after the real events', () => {
    const rows = collapseChores(buildTimeline(people), { isToday: true });
    expect(rows.map((r) => r.kind || r.event.summary)).toEqual(['Dentist', 'chores', 'chores']);
    const ana_ = rows.find((r) => r.kind === 'chores' && r.person.id === 'ana');
    expect(ana_).toMatchObject({ count: 2, done: 2, total: 4 });
  });

  it('counts events rather than progress on other days', () => {
    const rows = collapseChores(buildTimeline(people), { isToday: false });
    expect(rows.find((r) => r.kind === 'chores' && r.person.id === 'ana')).toMatchObject({ count: 2, done: null, total: 2 });
  });

  it('leaves a timeline with no chore events alone', () => {
    const rows = buildTimeline([{ ...ana, events: [mk('x', 'ana', 'Dentist', false)] }]);
    expect(collapseChores(rows, { isToday: true })).toBe(rows);
  });
});
