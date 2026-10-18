/**
 * TaskMate's timed chores, driven from the card.
 *
 * The timer lives on the server: `start_timed_task` opens or resumes a
 * session, `pause_timed_task` banks the running segment, `stop_timed_task`
 * closes it and creates the completion, paying whole rate blocks up to the
 * chore's daily cap. Live sessions are published on the chores sensor as
 * `active_timed_sessions`, so a timer started on the wall keeps running if
 * the tablet sleeps, and shows on a phone too.
 */

export function readSessions(hass, entityId) {
  const out = new Map();
  if (!entityId) return out;
  const list = hass?.states?.[entityId]?.attributes?.active_timed_sessions;
  if (!Array.isArray(list)) return out;
  for (const s of list) {
    if (!s?.chore_id || !s.child_id) continue;
    out.set(`${s.chore_id}|${s.child_id}`, {
      state: s.state,
      total: Number(s.total_seconds_today) || 0,
      segmentStart: s.current_segment_start || '',
    });
  }
  return out;
}

/** Seconds on the clock: what was banked, plus the running segment. */
export function elapsedSeconds(session, now = new Date()) {
  if (!session) return 0;
  let secs = session.total;
  if (session.state === 'running' && session.segmentStart) {
    const start = new Date(session.segmentStart).getTime();
    if (!Number.isNaN(start)) secs += Math.max(0, Math.floor((now.getTime() - start) / 1000));
  }
  return secs;
}

/** Points the stop would pay, the way TaskMate computes them. */
export function timedPoints(seconds, { rateMinutes, ratePoints, capMinutes = 0 }) {
  const rate = Number(rateMinutes) * 60;
  if (!rate) return 0;
  const capped = capMinutes ? Math.min(seconds, capMinutes * 60) : seconds;
  return Math.floor(capped / rate) * (Number(ratePoints) || 0);
}

const SERVICE = { start: 'start_timed_task', pause: 'pause_timed_task', finish: 'stop_timed_task' };

export async function timerAction(hass, action, choreId, childId) {
  await hass.callService('taskmate', SERVICE[action], { chore_id: choreId, child_id: childId });
}

export function formatClock(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}
