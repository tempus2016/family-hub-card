/**
 * Failure logging for a display that runs for weeks.
 *
 * A card polling every few minutes would emit thousands of identical console
 * lines while an entity is missing, which buries anything useful. So each
 * distinct failure logs once when it starts and once when it recovers — the two
 * moments that carry information — and says nothing in between.
 */

const failing = new Map();

/** Log a failure once per streak. Repeat calls for the same key stay silent. */
export function logFailure(key, message, error) {
  const previous = failing.get(key);
  const detail = error?.message || String(error || '');
  if (previous === detail) return false;

  failing.set(key, detail);
  console.warn(`family-hub-card: ${message}${detail ? ` — ${detail}` : ''}`);
  return true;
}

/** Note that a previously failing key is working again. */
export function logRecovery(key, message) {
  if (!failing.has(key)) return false;
  failing.delete(key);
  console.info(`family-hub-card: ${message}`);
  return true;
}

/** Test seam — the module-level streak state is shared across a page. */
export function resetLogState() {
  failing.clear();
}
