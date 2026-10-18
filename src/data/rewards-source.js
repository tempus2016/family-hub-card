/**
 * TaskMate's reward catalogue, read from its public rewards sensor. A claim
 * is a service call any signed-in user may make; TaskMate turns it into a
 * pending claim for a parent to approve, so a wrong tap costs nothing.
 */

export function readRewards(hass, entityId) {
  if (!entityId) return [];
  const list = hass?.states?.[entityId]?.attributes?.rewards;
  return Array.isArray(list) ? list : [];
}

function pendingClaims(hass, entityId) {
  const list = hass?.states?.[entityId]?.attributes?.pending_reward_claims;
  return Array.isArray(list) ? list : [];
}

/** Rewards this person can see, with their progress towards each. */
export function rewardsFor(hass, entityId, person) {
  const childId = person?.taskmateChildId;
  if (!childId) return [];
  const balance = Number(person.points?.balance) || 0;
  const pending = new Set(
    pendingClaims(hass, entityId).filter((c) => c.child_id === childId).map((c) => c.reward_id),
  );
  return readRewards(hass, entityId)
    .filter((r) => !Array.isArray(r.assigned_to) || r.assigned_to.length === 0 || r.assigned_to.includes(childId))
    .map((r) => {
      const cost = Number(r.calculated_costs?.[childId] ?? r.cost) || 0;
      return {
        id: r.id,
        name: r.name,
        icon: r.icon || 'mdi:gift',
        description: r.description || '',
        cost,
        balance,
        pct: cost ? Math.min(100, Math.round((balance / cost) * 100)) : 100,
        affordable: balance >= cost,
        available: r.is_available !== false && !r.is_sold_out && !r.is_expired,
        pending: pending.has(r.id),
      };
    });
}

export async function claimReward(hass, rewardId, childId) {
  await hass.callService('taskmate', 'claim_reward', { reward_id: rewardId, child_id: childId });
}
