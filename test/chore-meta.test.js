import { describe, it, expect } from 'vitest';
import { choreMeta, iconFor, needsOf, asksOf } from '../src/data/chore-meta.js';
import { buildTasks } from '../src/data/tasks.js';

const hass = { states: { 'sensor.taskmate_chores': { state: '3', attributes: { chores: [
  { id: 'c1', name: 'Make bed', points: 10, icon: 'mdi:bed' },
  { id: 'c2', name: 'Read', points: 5, effective_points: 7.5, quantity_unit: 'pages', quantity_max: 40 },
  { id: 'c3', name: 'Something extra', points: 0, open_ended: true },
  { id: 'c4', name: 'Room photo', points: 20, require_photo: true },
] } } } };

describe('choreMeta', () => {
  it('maps to-do uids to icon, stars and block reason', () => {
    const m = choreMeta(hass, 'sensor.taskmate_chores');
    expect(m.get('c1')).toMatchObject({ icon: 'mdi:bed', stars: 10, needs: null });
    expect(m.get('c2')).toMatchObject({ stars: 7.5, needs: 'quantity', unit: 'pages', max: 40 });
    expect(m.get('c3').needs).toBe('note');
    expect(m.get('c4').needs).toBe('photo');
  });

  it('is empty without a sensor', () => {
    expect(choreMeta(hass, null).size).toBe(0);
    expect(choreMeta({ states: {} }, 'sensor.nope').size).toBe(0);
  });
});

describe('iconFor', () => {
  it('prefers the TaskMate icon', () => {
    expect(iconFor('Make bed', { icon: 'mdi:bed-king' })).toBe('mdi:bed-king');
  });

  it('guesses from the name for stock lists', () => {
    expect(iconFor('Brush teeth')).toBe('mdi:toothbrush');
    expect(iconFor('Take the bins out')).toBe('mdi:trash-can-outline');
    expect(iconFor('Feed the dog')).toBe('mdi:dog');
  });

  it('falls back to a neutral tick', () => {
    expect(iconFor('Zorbulate the frim')).toBe('mdi:check-circle-outline');
  });
});

describe('needsOf', () => {
  it('is null for an ordinary chore', () => {
    expect(needsOf({})).toBeNull();
  });

  it('lets a photo requirement win over a count, as TaskMate checks the photo first', () => {
    expect(needsOf({ require_photo: true, quantity_unit: 'pages' })).toBe('photo');
  });
});

describe('buildTasks with meta', () => {
  it('carries icon, stars and what a chore needs onto each task, keeping it tappable', () => {
    const person = { id: 'ana', todo: 'todo.ana', chores: [
      { id: 'c1', summary: 'Make bed', status: 'needs_action' },
      { id: 'c3', summary: 'Something extra', status: 'needs_action' },
    ], completedToday: [] };
    const meta = choreMeta(hass, 'sensor.taskmate_chores');
    const tasks = buildTasks(person, { now: new Date('2026-10-18T10:00:00Z'), tz: 'Europe/London', meta });
    expect(tasks[0]).toMatchObject({ icon: 'mdi:bed', stars: 10, needs: null, tappable: true });
    expect(tasks[1]).toMatchObject({ needs: 'note', tappable: true });
  });
});

describe('asksOf', () => {
  it('lists every field TaskMate will check, so a photo-and-note chore asks for both', () => {
    expect(asksOf({ require_photo: true, open_ended: true })).toEqual(['photo', 'note']);
    expect(asksOf({ require_photo: true, quantity_unit: 'pages' })).toEqual(['photo', 'quantity']);
  });

  it('drops the count on an open-ended or timed chore, as TaskMate ignores it there', () => {
    expect(asksOf({ open_ended: true, quantity_unit: 'pages' })).toEqual(['note']);
    expect(asksOf({ task_type: 'timed', quantity_unit: 'pages' })).toEqual([]);
  });
});
