import { describe, it, expect } from 'vitest';
import { detectPeople } from '../src/editor/autodetect.js';

// Shapes taken from a live instance.
const states = {
  'sensor.taskmate_ana_points': {
    attributes: { child_name: 'Ana', friendly_name: 'TaskMate Ana Points' },
  },
  'sensor.taskmate_ana_stats': {
    attributes: { child_name: 'Ana', friendly_name: 'TaskMate Ana Stats' },
  },
  'sensor.taskmate_ben_points': {
    attributes: { child_name: 'Ben', friendly_name: 'TaskMate Ben Points' },
  },
  'todo.taskmate_ana': { attributes: { friendly_name: 'TaskMate Ana' } },
  'todo.taskmate_ben': { attributes: { friendly_name: 'TaskMate Ben' } },
  'todo.taskmate_i641_repro': { attributes: { friendly_name: 'TaskMate I641 Repro' } },
  'todo.shopping_list': { attributes: { friendly_name: 'Shopping List' } },
};

describe('detectPeople', () => {
  it('finds a person per TaskMate child', () => {
    const found = detectPeople({ states }, []);
    expect(found.map((p) => p.name).sort()).toEqual(['Ana', 'Ben']);
  });

  it('prefers the points sensor over the stats sensor', () => {
    const ana = detectPeople({ states }, []).find((p) => p.name === 'Ana');
    expect(ana.points).toBe('sensor.taskmate_ana_points');
  });

  it('pairs the todo entity by friendly name', () => {
    const ana = detectPeople({ states }, []).find((p) => p.name === 'Ana');
    expect(ana.todo).toBe('todo.taskmate_ana');
  });

  it('falls back to the entity_id pattern when names have been changed', () => {
    const renamed = {
      'sensor.taskmate_ana_points': {
        attributes: { child_name: 'Ana', friendly_name: 'Ana stars' },
      },
      'todo.taskmate_ana': { attributes: { friendly_name: 'Chores for Ana' } },
    };
    expect(detectPeople({ states: renamed }, [])[0].todo).toBe('todo.taskmate_ana');
  });

  it('still proposes a person when no todo can be paired', () => {
    const orphan = {
      'sensor.taskmate_rowan_points': {
        attributes: { child_name: 'Rowan', friendly_name: 'TaskMate Rowan Points' },
      },
    };
    const found = detectPeople({ states: orphan }, []);
    expect(found).toHaveLength(1);
    expect(found[0].todo).toBeNull();
  });

  it('ignores TaskMate todo entities with no matching points sensor', () => {
    const found = detectPeople({ states }, []);
    expect(found.some((p) => p.todo === 'todo.taskmate_i641_repro')).toBe(false);
  });

  it('skips people already configured, by name', () => {
    const found = detectPeople({ states }, [{ name: 'Ana' }]);
    expect(found.map((p) => p.name)).toEqual(['Ben']);
  });

  it('is case-insensitive when skipping existing people', () => {
    expect(detectPeople({ states }, [{ name: 'ana' }, { name: 'BEN' }])).toEqual([]);
  });

  it('assigns palette colours after the people already present', () => {
    const found = detectPeople({ states }, [{ name: 'John' }]);
    expect(found[0].color).toBeTruthy();
    expect(found[0].color).not.toBe(found[1]?.color);
  });

  it('returns nothing on an instance with no TaskMate', () => {
    expect(detectPeople({ states: { 'todo.shopping_list': { attributes: {} } } }, [])).toEqual([]);
  });

  it('tolerates a missing hass', () => {
    expect(detectPeople(undefined, [])).toEqual([]);
  });
});
