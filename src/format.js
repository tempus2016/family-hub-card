/**
 * Date and time formatting that follows the Home Assistant profile.
 *
 * `hass.locale.time_format` is `12`, `24`, `language` or `system`. Pinning
 * `hour12: false` as the card used to ignores all four and hands every
 * American a 24-hour clock on their kitchen wall.
 */
function hour12For(locale) {
  switch (locale?.time_format) {
    case '12': return true;
    case '24': return false;
    case 'language': return undefined;
    case 'system': return undefined;
    default: return false;
  }
}

function tagFor(locale) {
  if (!locale) return undefined;
  if (locale.time_format === 'system') return undefined;
  return locale.language || undefined;
}

export function formatTime(date, locale, tz) {
  const h12 = hour12For(locale);
  // "2:30 PM" on a wall clock, never "02:30 PM"; 24-hour keeps its two digits.
  const opts = { hour: h12 === false ? '2-digit' : 'numeric', minute: '2-digit', timeZone: tz };
  if (h12 !== undefined) opts.hour12 = h12;
  // `hourCycle: h23` is what stops a 24-hour locale printing midnight as 24:00.
  if (h12 === false) opts.hourCycle = 'h23';
  return new Intl.DateTimeFormat(tagFor(locale), opts).format(date);
}

export function formatDate(date, locale, tz, parts) {
  return new Intl.DateTimeFormat(tagFor(locale), { ...parts, timeZone: tz }).format(date);
}
