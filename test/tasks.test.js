import { describe, it, expect } from 'vitest';
import { buildTasks, progressOf, tasksOf } from '../src/data/tasks.js';

const TZ = 'Europe/London';
const NOW = new Date('2026-08-10T10:00:00Z');

const person = (over = {}) => ({
  id: 'ana', name: 'Ana', todo: 'todo.ana', chores: [], completedToday: [], ...over,
});

describe('buildTasks', () => {
  it('lists outstanding first, then completed, then TaskMate completions', () => {
    const p = person({
      chores: [
        { id: '1', summary: 'Bins out', status: 'completed' },
        { id: '2', summary: 'Car fuel', status: 'needs_action' },
      ],
      completedToday: [{ choreId: 'c9', name: 'Tidy room', approved: true }],
    });
    const t = buildTasks(p, { now: NOW, tz: TZ });
    expect(t.map((x) => x.summary)).toEqual(['Car fuel', 'Bins out', 'Tidy room']);
    expect(t.map((x) => x.done)).toEqual([false, true, true]);
    expect(t.map((x) => x.tappable)).toEqual([true, false, false]);
  });

  it('does not list a chore present in both sources twice', () => {
    const p = person({
      chores: [{ id: '1', summary: 'Bins out', status: 'completed' }],
      completedToday: [{ choreId: 'c1', name: 'Bins out', approved: true }],
    });
    expect(buildTasks(p, { now: NOW, tz: TZ })).toHaveLength(1);
  });

  it('marks an unapproved TaskMate completion as pending', () => {
    const p = person({ completedToday: [{ choreId: 'c9', name: 'Dog', approved: false }] });
    expect(buildTasks(p, { now: NOW, tz: TZ })[0]).toMatchObject({ done: true, pending: true });
  });

  it('shows at most maxCompleted completed items from the to-do list', () => {
    const p = person({
      chores: [
        { id: '1', summary: 'Open', status: 'needs_action' },
        { id: '2', summary: 'Old 1', status: 'completed' },
        { id: '3', summary: 'Old 2', status: 'completed' },
        { id: '4', summary: 'Old 3', status: 'completed' },
        { id: '5', summary: 'Old 4', status: 'completed' },
      ],
      completedToday: [{ choreId: 'c9', name: 'Dog', approved: true }],
    });
    const t = buildTasks(p, { now: NOW, tz: TZ, maxCompleted: 2 });
    expect(t.map((x) => x.summary)).toEqual(['Open', 'Old 1', 'Old 2', 'Dog']);
  });

  it('keeps the full count for progress even when the list is capped', () => {
    const p = person({
      chores: [
        { id: '1', summary: 'Open', status: 'needs_action' },
        { id: '2', summary: 'Old 1', status: 'completed' },
        { id: '3', summary: 'Old 2', status: 'completed' },
      ],
    });
    expect(progressOf(p)).toEqual({ done: 2, total: 3, pct: 67 });
  });

  it('flags a chore due before today as overdue', () => {
    const p = person({
      chores: [
        { id: '1', summary: 'Late', status: 'needs_action', due: new Date('2026-08-08T12:00:00Z') },
        { id: '2', summary: 'Today', status: 'needs_action', due: new Date('2026-08-10T12:00:00Z') },
        { id: '3', summary: 'Undated', status: 'needs_action', due: null },
      ],
    });
    expect(buildTasks(p, { now: NOW, tz: TZ }).map((x) => x.overdue)).toEqual([true, false, false]);
  });

  it('never flags a completed chore as overdue', () => {
    const p = person({
      chores: [{ id: '1', summary: 'Late', status: 'completed', due: new Date('2026-08-08T12:00:00Z') }],
    });
    expect(buildTasks(p, { now: NOW, tz: TZ })[0].overdue).toBe(false);
  });

  it('carries the due date through', () => {
    const due = new Date('2026-08-10T16:30:00Z');
    const p = person({ chores: [{ id: '1', summary: 'X', status: 'needs_action', due }] });
    expect(buildTasks(p, { now: NOW, tz: TZ })[0].due).toBe(due);
  });
});

describe('tasksOf', () => {
  it('prefers the tasks already built onto the person', () => {
    const p = person({ tasks: [{ id: 'pre', summary: 'Prebuilt' }] });
    expect(tasksOf(p).map((t) => t.summary)).toEqual(['Prebuilt']);
  });

  it('builds them on the fly for a bare person', () => {
    const p = person({ chores: [{ id: '1', summary: 'X', status: 'needs_action' }] });
    expect(tasksOf(p).map((t) => t.summary)).toEqual(['X']);
  });
});
