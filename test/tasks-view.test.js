import { describe, it, expect } from 'vitest';
import { visibleGroups } from '../src/views/tasks-view.js';

const task = (summary) => ({ id: summary, summary, done: false, pending: false, tappable: true, start: null });

describe('visibleGroups', () => {
  it('returns groups in day order with their labels', () => {
    const groups = {
      morning: [task('Make bed')],
      afternoon: [task('Pack bag')],
      evening: [task('Brush teeth')],
      chores: [task('Tidy bedroom')],
    };
    expect(visibleGroups(groups).map((g) => g.key)).toEqual(['morning', 'afternoon', 'evening', 'chores']);
    expect(visibleGroups(groups).map((g) => g.label)).toEqual(['Morning', 'Afternoon', 'Evening', 'Chores']);
  });

  it('omits an empty group', () => {
    const groups = { morning: [task('Make bed')], afternoon: [], evening: [], chores: [] };
    expect(visibleGroups(groups).map((g) => g.key)).toEqual(['morning']);
  });

  it('returns nothing for a person with no tasks', () => {
    expect(visibleGroups({ morning: [], afternoon: [], evening: [], chores: [] })).toEqual([]);
  });
});
