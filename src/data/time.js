/**
 * Local-timezone date helpers.
 *
 * Everything here works via Intl rather than the host timezone, because HA's
 * configured timezone can differ from the browser's — a tablet on UTC showing
 * a Europe/London household must still roll over at local midnight.
 */

function tzOffsetMs(date, tz) {
  // Format the instant as if in `tz`, reinterpret as UTC, and difference the
  // two to recover the offset at that instant (DST-correct).
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(date).filter((p) => p.type !== 'literal').map((p) => [p.type, p.value]),
  );
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );
  // `asUTC` is second-precision (formatToParts has no ms field), so compare it
  // against a ms-truncated timestamp. Subtracting the raw getTime() folds the
  // sub-second remainder into the offset, which pushes every derived midnight
  // late by that many ms — enough for the first instant of the next day to fall
  // inside today's window.
  return asUTC - (date.getTime() - date.getMilliseconds());
}

export function localParts(date, tz) {
  const offset = tzOffsetMs(date, tz);
  const shifted = new Date(date.getTime() + offset);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
  };
}

function localMidnight(date, tz) {
  const { year, month, day } = localParts(date, tz);
  // Guess using the offset at `date`, then correct once. A single correction
  // suffices because DST shifts are smaller than the distance to midnight.
  const guess = new Date(Date.UTC(year, month, day) - tzOffsetMs(date, tz));
  const corrected = new Date(Date.UTC(year, month, day) - tzOffsetMs(guess, tz));
  return corrected;
}

/**
 * Local midnight to local midnight, `days` later. Stepping a day at a time and
 * re-deriving midnight each time keeps the window exact across a DST change —
 * adding `days * 24h` would drift by an hour through a transition.
 */
export function localDayWindow(now, tz, days = 1) {
  const start = localMidnight(now, tz);
  let end = start;
  for (let i = 0; i < days; i += 1) {
    end = localMidnight(new Date(end.getTime() + 36 * 3600 * 1000), tz);
  }
  return { start, end };
}

export function isSameLocalDay(a, b, tz) {
  const pa = localParts(a, tz);
  const pb = localParts(b, tz);
  return pa.year === pb.year && pa.month === pb.month && pa.day === pb.day;
}

export function msUntilNextMinute(now) {
  const rem = now.getTime() % 60000;
  return rem === 0 ? 60000 : 60000 - rem;
}

export function msUntilNextLocalMidnight(now, tz) {
  return localDayWindow(now, tz).end.getTime() - now.getTime();
}
