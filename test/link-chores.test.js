import { describe, it, expect } from 'vitest';
import { choreKey, linkChores } from '../src/data/link-chores.js';

const ev = (summary) => ({ summary });
const ch = (summary, id) => ({ summary, id });

describe('choreKey', () => {
  it('trims and lower-cases', () => {
    expect(choreKey('  Make Bed ')).toBe('make bed');
  });

  it('survives a missing summary', () => {
    expect(choreKey(undefined)).toBe('');
  });
});

describe('linkChores', () => {
  it('pairs an event with the chore of the same name', () => {
    const chore = ch('Make bed', '1');
    const { pairs, matched } = linkChores([ev('Make bed')], [chore]);
    expect(pairs).toHaveLength(1);
    expect(pairs[0].chore).toBe(chore);
    expect(matched.has(chore)).toBe(true);
  });

  it('matches through case and surrounding whitespace', () => {
    const chore = ch('make bed', '1');
    const { pairs } = linkChores([ev('  Make Bed  ')], [chore]);
    expect(pairs[0].chore).toBe(chore);
  });

  it('leaves an event with no matching chore unpaired', () => {
    const { pairs, matched } = linkChores([ev('Swimming lesson')], [ch('Make bed', '1')]);
    expect(pairs[0].chore).toBe(null);
    expect(matched.size).toBe(0);
  });

  it('gives a duplicate name to the earlier event only', () => {
    const chore = ch('Brush teeth', '1');
    const { pairs } = linkChores([ev('Brush teeth'), ev('Brush teeth')], [chore]);
    expect(pairs[0].chore).toBe(chore);
    expect(pairs[1].chore).toBe(null);
  });

  it('claims each chore at most once when names repeat', () => {
    const first = ch('Brush teeth', '1');
    const second = ch('Brush teeth', '2');
    const { pairs, matched } = linkChores([ev('Brush teeth'), ev('Brush teeth')], [first, second]);
    expect(pairs[0].chore).toBe(first);
    expect(pairs[1].chore).toBe(second);
    expect(matched.size).toBe(2);
  });

  it('leaves surplus chores unmatched', () => {
    const a = ch('Make bed', '1');
    const b = ch('Tidy bedroom', '2');
    const { matched } = linkChores([ev('Make bed')], [a, b]);
    expect(matched.has(a)).toBe(true);
    expect(matched.has(b)).toBe(false);
  });

  it('preserves chore priority order when names collide', () => {
    const outstanding = ch('Make bed', 'open');
    const completed = ch('Make bed', 'done');
    const { pairs } = linkChores([ev('Make bed')], [outstanding, completed]);
    expect(pairs[0].chore).toBe(outstanding);
  });

  it('handles a person with no events', () => {
    const { pairs, matched } = linkChores([], [ch('Make bed', '1')]);
    expect(pairs).toEqual([]);
    expect(matched.size).toBe(0);
  });

  it('handles a person with no chores', () => {
    const { pairs, matched } = linkChores([ev('Make bed')], []);
    expect(pairs[0].chore).toBe(null);
    expect(matched.size).toBe(0);
  });

  it('tolerates null arguments', () => {
    const { pairs, matched } = linkChores(null, null);
    expect(pairs).toEqual([]);
    expect(matched.size).toBe(0);
  });
});
