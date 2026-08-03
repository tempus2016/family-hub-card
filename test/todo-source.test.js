import { describe, it, expect } from 'vitest';
import { filterChores, fetchChores, completeChore } from '../src/data/todo-source.js';

const TZ = 'Europe/London';
const now = new Date('2026-08-03T10:00:00Z');

const items = [
  { uid: '1', summary: 'Overdue', status: 'needs_action', due: '2026-08-01' },
  { uid: '2', summary: 'Today', status: 'needs_action', due: '2026-08-03' },
  { uid: '3', summary: 'Undated', status: 'needs_action' },
  { uid: '4', summary: 'Future', status: 'needs_action', due: '2026-08-20' },
  { uid: '5', summary: 'Done', status: 'completed', due: '2026-08-03' },
];

describe('filterChores', () => {
  it('keeps overdue, due-today and undated under the today filter', () => {
    const out = filterChores(items, 'today', now, TZ).map((c) => c.summary);
    expect(out).toEqual(['Overdue', 'Today', 'Undated', 'Done']);
  });

  it('keeps everything under the all filter', () => {
    expect(filterChores(items, 'all', now, TZ)).toHaveLength(5);
  });

  it('retains completed items so they can render struck-through', () => {
    const done = filterChores(items, 'today', now, TZ).find((c) => c.summary === 'Done');
    expect(done.status).toBe('completed');
  });

  it('treats a due datetime later today as due today', () => {
    const out = filterChores(
      [{ uid: 'x', summary: 'Tonight', status: 'needs_action', due: '2026-08-03T21:00:00+01:00' }],
      'today',
      now,
      TZ,
    );
    expect(out).toHaveLength(1);
  });
});

describe('fetchChores', () => {
  const people = [
    { id: 'ana', todo: 'todo.ana' },
    { id: 'ben', todo: null },
  ];

  it('lists items per person and skips people without a todo entity', async () => {
    const hass = {
      callWS: async ({ type, entity_id }) => {
        expect(type).toBe('todo/item/list');
        expect(entity_id).toBe('todo.ana');
        return { items };
      },
    };
    const { choresByPerson, failures } = await fetchChores(hass, people, 'today', now, TZ);
    expect(Object.keys(choresByPerson)).toEqual(['ana']);
    expect(choresByPerson.ana).toHaveLength(4);
    expect(choresByPerson.ana[0].personId).toBe('ana');
    expect(failures).toEqual([]);
  });

  it('reports a failing list without throwing', async () => {
    const hass = { callWS: async () => { throw new Error('nope'); } };
    const { choresByPerson, failures } = await fetchChores(hass, people, 'today', now, TZ);
    expect(failures).toEqual(['todo.ana']);
    expect(choresByPerson.ana).toEqual([]);
  });
});

describe('completeChore', () => {
  it('calls todo.update_item with the completed status', async () => {
    const calls = [];
    const hass = { callService: async (d, s, data) => calls.push([d, s, data]) };
    await completeChore(hass, 'todo.ana', 'abc');
    expect(calls).toEqual([
      ['todo', 'update_item', { entity_id: 'todo.ana', item: 'abc', status: 'completed' }],
    ]);
  });
});
