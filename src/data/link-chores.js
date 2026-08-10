/**
 * Pairs a person's calendar events with their chores.
 *
 * TaskMate publishes every chore twice — once as a calendar event, once as a
 * to-do item — with byte-identical summaries. There is no shared id between the
 * two, so the summary is the only join key available. Matching is deliberately
 * exact (after trimming and lower-casing) rather than fuzzy: a false pair would
 * hide a real chore behind an unrelated event.
 */

export function choreKey(summary) {
  return String(summary ?? '').trim().toLowerCase();
}

/**
 * `chores` must arrive in priority order — the caller decides which chore wins
 * when two share a name. Each chore is claimed at most once, and events are
 * walked in display order, so two "Brush teeth" events and one chore give the
 * box to the earlier event.
 *
 * `matched` holds chore objects by identity, so a caller can filter the very
 * arrays it passed in without needing ids to be unique or even present.
 */
export function linkChores(events, chores) {
  const pool = new Map();
  for (const chore of chores || []) {
    const key = choreKey(chore.summary);
    if (!pool.has(key)) pool.set(key, []);
    pool.get(key).push(chore);
  }

  const matched = new Set();
  const pairs = (events || []).map((event) => {
    const queue = pool.get(choreKey(event.summary));
    const chore = queue && queue.length ? queue.shift() : null;
    if (chore) matched.add(chore);
    return { event, chore };
  });

  return { pairs, matched };
}
