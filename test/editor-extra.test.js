import { describe, it, expect } from 'vitest';
import { FamilyHubCardEditor } from '../src/editor/family-hub-card-editor.js';
import { normaliseConfig } from '../src/data/config.js';

function makeEditor(config) {
  const ed = new FamilyHubCardEditor();
  ed.hass = { states: {} };
  ed.setConfig(config);
  const emitted = [];
  ed.dispatchEvent = (e) => { emitted.push(e.detail.config); return true; };
  return { ed, emitted };
}

describe('editor validation', () => {
  it('flags a person with no name', () => {
    const { ed } = makeEditor({ people: [{ todo: 'todo.a' }] });
    expect(ed._errors(ed._config)[0]).toMatch(/name/i);
  });

  it('flags a person with neither calendars nor todo', () => {
    const { ed } = makeEditor({ people: [{ name: 'Ana' }] });
    expect(ed._errors(ed._config)[0]).toMatch(/calendar|to-do/i);
  });

  it('flags a duplicate name on the second occurrence', () => {
    const { ed } = makeEditor({
      people: [{ name: 'Ana', todo: 'todo.a' }, { name: 'ana', todo: 'todo.b' }],
    });
    const errs = ed._errors(ed._config);
    expect(errs[0]).toBeUndefined();
    expect(errs[1]).toMatch(/duplicate/i);
  });

  it('still emits while a row is incomplete, so keystrokes are not lost', () => {
    const { ed, emitted } = makeEditor({ people: [{ name: 'Ana' }] });
    ed._setPerson(0, 'name', 'An');
    expect(emitted).toHaveLength(1);
  });

  it('emits a config that normaliseConfig accepts unchanged', () => {
    const { ed, emitted } = makeEditor({ people: [{ name: 'Ana', todo: 'todo.a' }] });
    ed._setCard('view', 'week');
    expect(emitted).toHaveLength(1);
    expect(() => normaliseConfig(emitted[0])).not.toThrow();
    expect(normaliseConfig(emitted[0]).view).toBe('week');
  });

  it('reports an empty people list', () => {
    const { ed } = makeEditor({ people: [] });
    expect(ed._errors(ed._config).card).toBeTruthy();
  });

  it('does not write keys the user never set', () => {
    const { ed, emitted } = makeEditor({ type: 'custom:family-hub-card', people: [{ name: 'Ana', todo: 'todo.a' }] });
    ed._setCard('view', 'week');
    expect(Object.keys(emitted[0]).sort()).toEqual(['people', 'type', 'view']);
  });
});

describe('editor people list', () => {
  const base = { people: [{ name: 'Ana', todo: 'todo.a' }, { name: 'Ben', todo: 'todo.b' }] };

  it('reorders people', () => {
    const { ed, emitted } = makeEditor(base);
    ed._movePerson(1, -1);
    expect(emitted[0].people.map((p) => p.name)).toEqual(['Ben', 'Ana']);
  });

  it('will not move the first person up', () => {
    const { ed, emitted } = makeEditor(base);
    ed._movePerson(0, -1);
    expect(emitted).toEqual([]);
  });

  it('removes a person', () => {
    const { ed, emitted } = makeEditor(base);
    ed._removePerson(0);
    expect(emitted[0].people.map((p) => p.name)).toEqual(['Ben']);
  });

  it('clears a key rather than storing an empty string', () => {
    const { ed, emitted } = makeEditor(base);
    ed._setPerson(0, 'points', '');
    expect('points' in emitted[0].people[0]).toBe(false);
  });
});

describe('calendar toggling', () => {
  const base = { people: [{ name: 'Ana', calendars: ['calendar.a', 'calendar.b'], todo: 'todo.a' }] };

  it('adds a calendar without dropping the others', () => {
    const { ed, emitted } = makeEditor(base);
    ed._toggleCalendar(0, 'calendar.c', true);
    expect(emitted[0].people[0].calendars).toEqual(['calendar.a', 'calendar.b', 'calendar.c']);
  });

  it('removes one calendar and keeps the rest', () => {
    const { ed, emitted } = makeEditor(base);
    ed._toggleCalendar(0, 'calendar.a', false);
    expect(emitted[0].people[0].calendars).toEqual(['calendar.b']);
  });

  it('drops the key entirely when the last calendar is unchecked', () => {
    const { ed, emitted } = makeEditor({ people: [{ name: 'Ana', calendars: ['calendar.a'], todo: 'todo.a' }] });
    ed._toggleCalendar(0, 'calendar.a', false);
    expect('calendars' in emitted[0].people[0]).toBe(false);
  });

  it('starts a calendar list on a person who had none', () => {
    const { ed, emitted } = makeEditor({ people: [{ name: 'Ana', todo: 'todo.a' }] });
    ed._toggleCalendar(0, 'calendar.a', true);
    expect(emitted[0].people[0].calendars).toEqual(['calendar.a']);
  });
});
