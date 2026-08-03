import { describe, it, expect } from 'vitest';
import { readPoints, readCompletions, completionsForPerson } from '../src/data/taskmate-source.js';

describe('readPoints', () => {
  it('returns null when the person has no points entity', () => {
    expect(readPoints({ states: {} }, { id: 'ana', points: null })).toBeNull();
  });

  it('returns null when the entity is missing from hass', () => {
    expect(readPoints({ states: {} }, { id: 'ana', points: 'sensor.ana_points' })).toBeNull();
  });

  it('reads balance and unit', () => {
    const hass = {
      states: { 'sensor.ana_points': { state: '142', attributes: { unit_of_measurement: 'Stars' } } },
    };
    const p = readPoints(hass, { id: 'ana', points: 'sensor.ana_points' });
    expect(p.balance).toBe(142);
    expect(p.unit).toBe('Stars');
  });

  it('leaves earnedToday null when the attribute is absent', () => {
    const hass = { states: { 'sensor.ana_points': { state: '142', attributes: {} } } };
    expect(readPoints(hass, { id: 'ana', points: 'sensor.ana_points' }).earnedToday).toBeNull();
  });

  it('reads earnedToday and pendingToday when present', () => {
    const hass = {
      states: {
        'sensor.ana_points': {
          state: '142',
          attributes: { points_earned_today: 12, points_pending_today: 8 },
        },
      },
    };
    const p = readPoints(hass, { id: 'ana', points: 'sensor.ana_points' });
    expect(p.earnedToday).toBe(12);
    expect(p.pendingToday).toBe(8);
  });

  it('treats an unavailable state as no balance', () => {
    const hass = { states: { 'sensor.ana_points': { state: 'unavailable', attributes: {} } } };
    expect(readPoints(hass, { id: 'ana', points: 'sensor.ana_points' }).balance).toBeNull();
  });
});

describe('readCompletions', () => {
  const hass = {
    states: {
      'sensor.taskmate_chores': {
        state: '4',
        attributes: {
          todays_completions: [
            { chore_id: 'c1', child_id: 'k1', chore_name: 'Bins out', approved: true, completed_at: '2026-08-03T08:00:00+01:00' },
            { chore_id: 'c2', child_id: '__parent__', chore_name: 'Food shop', approved: true, completed_at: '2026-08-03T09:00:00+01:00' },
            { chore_id: 'c3', child_id: 'k1', chore_name: 'Tidy room › Shelves', approved: false, completed_at: '2026-08-03T10:00:00+01:00' },
          ],
        },
      },
    },
  };

  it('returns an empty list when the entity is absent', () => {
    expect(readCompletions({ states: {} }, 'sensor.taskmate_chores')).toEqual([]);
  });

  it('returns an empty list when no entity is configured', () => {
    expect(readCompletions(hass, null)).toEqual([]);
  });

  it('drops __parent__ records', () => {
    const out = readCompletions(hass, 'sensor.taskmate_chores');
    expect(out.map((c) => c.choreId)).toEqual(['c1', 'c3']);
  });

  it('preserves the pre-formatted subtask name and approval flag', () => {
    const out = readCompletions(hass, 'sensor.taskmate_chores');
    expect(out[1].name).toBe('Tidy room › Shelves');
    expect(out[1].approved).toBe(false);
    expect(out[1].completedAt.toISOString()).toBe('2026-08-03T09:00:00.000Z');
  });
});

describe('completionsForPerson', () => {
  const completions = [
    { choreId: 'c1', childId: 'k1', name: 'A', approved: true, completedAt: new Date() },
    { choreId: 'c2', childId: 'k2', name: 'B', approved: true, completedAt: new Date() },
  ];

  it('matches on the taskmate child id carried by the points sensor', () => {
    const out = completionsForPerson(completions, { id: 'ana', taskmateChildId: 'k1' });
    expect(out.map((c) => c.choreId)).toEqual(['c1']);
  });

  it('returns nothing when the person has no taskmate child id', () => {
    expect(completionsForPerson(completions, { id: 'ana' })).toEqual([]);
  });
});
