import { describe, it, expect } from 'vitest';
import { readRewards, rewardsFor } from '../src/data/rewards-source.js';

const hass = { states: { 'sensor.taskmate_rewards': { state: '3', attributes: {
  rewards: [
    { id: 'r1', name: 'Ice cream', cost: 150, icon: 'mdi:ice-cream', assigned_to: [], is_available: true, is_sold_out: false, is_expired: false },
    { id: 'r2', name: 'Switch time', cost: 100, icon: 'mdi:gamepad-variant', assigned_to: ['k1'], is_available: true },
    { id: 'r3', name: 'Gone', cost: 10, icon: 'mdi:gift', assigned_to: [], is_available: false, is_sold_out: true },
    { id: 'r4', name: 'Build-a-Bear', cost: 1500, icon: 'mdi:teddy-bear', assigned_to: [], is_available: true },
  ],
  pending_reward_claims: [{ id: 'cl1', reward_id: 'r2', child_id: 'k1' }],
} } } };

describe('readRewards', () => {
  it('returns an empty list without a sensor', () => {
    expect(readRewards(hass, null)).toEqual([]);
    expect(readRewards({ states: {} }, 'sensor.taskmate_rewards')).toEqual([]);
  });
});

describe('rewardsFor', () => {
  const person = { taskmateChildId: 'k1', points: { balance: 742 } };

  it('lists rewards assigned to everyone or to this child, in catalogue order', () => {
    const r = rewardsFor(hass, 'sensor.taskmate_rewards', person);
    expect(r.map((x) => x.id)).toEqual(['r1', 'r2', 'r3', 'r4']);
  });

  it('leaves out a reward assigned only to someone else', () => {
    const other = { taskmateChildId: 'k2', points: { balance: 5 } };
    expect(rewardsFor(hass, 'sensor.taskmate_rewards', other).map((x) => x.id)).toEqual(['r1', 'r3', 'r4']);
  });

  it('computes affordability, progress and pending state', () => {
    const by = Object.fromEntries(rewardsFor(hass, 'sensor.taskmate_rewards', person).map((x) => [x.id, x]));
    expect(by.r1).toMatchObject({ affordable: true, pct: 100, pending: false, available: true });
    expect(by.r2).toMatchObject({ affordable: true, pending: true });
    expect(by.r3).toMatchObject({ available: false });
    expect(by.r4).toMatchObject({ affordable: false, pct: 49 });
  });

  it('returns nothing for a person with no TaskMate child id', () => {
    expect(rewardsFor(hass, 'sensor.taskmate_rewards', { points: null })).toEqual([]);
  });
});
