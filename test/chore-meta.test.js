import { describe, it, expect } from 'vitest';
import { choreMeta, iconFor, blockedReason } from '../src/data/chore-meta.js';
import { buildTasks } from '../src/data/tasks.js';

const hass = { states: { 'sensor.taskmate_chores': { state: '3', attributes: { chores: [
  { id: 'c1', name: 'Make bed', points: 10, icon: 'mdi:bed' },
  { id: 'c2', name: 'Read', points: 5, effective_points: 7.5, quantity_unit: 'pages' },
  { id: 'c3', name: 'Something extra', points: 0, open_ended: true },
  { id: 'c4', name: 'Room photo', points: 20, require_photo: true },
] } } } };

describe('choreMeta', () => {
  it('maps to-do uids to icon, stars and block reason', () => {
    const m = choreMeta(hass, 'sensor.taskmate_chores');
    expect(m.get('c1')).toMatchObject({ icon: 'mdi:bed', stars: 10, blocked: null });
    expect(m.get('c2')).toMatchObject({ stars: 7.5, blocked: 'quantity' });
    expect(m.get('c3').blocked).toBe('note');
    expect(m.get('c4').blocked).toBe('photo');
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

describe('blockedReason', () => {
  it('is null for an ordinary chore', () => {
    expect(blockedReason({})).toBeNull();
  });
});

describe('buildTasks with meta', () => {
  it('carries icon, stars and blocked onto each task and makes blocked ones untappable', () => {
    const person = { id: 'ana', todo: 'todo.ana', chores: [
      { id: 'c1', summary: 'Make bed', status: 'needs_action' },
      { id: 'c3', summary: 'Something extra', status: 'needs_action' },
    ], completedToday: [] };
    const meta = choreMeta(hass, 'sensor.taskmate_chores');
    const tasks = buildTasks(person, { now: new Date('2026-10-18T10:00:00Z'), tz: 'Europe/London', meta });
    expect(tasks[0]).toMatchObject({ icon: 'mdi:bed', stars: 10, blocked: null, tappable: true });
    expect(tasks[1]).toMatchObject({ blocked: 'note', tappable: false });
  });
});
