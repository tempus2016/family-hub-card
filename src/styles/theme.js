import { css } from 'lit';
import { FONT_FACES } from './fonts.js';

/**
 * The Skylight-style look: a serif for names, dates and section titles, a
 * rounded sans for everything else, and pastel tints derived from one fixed
 * accent colour per person so people keep their identity in both schemes.
 *
 * Tints are blended here in JS rather than with CSS color-mix, so the result
 * is the same on every browser the tablet might run and is unit-testable.
 */

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function rgb(hex) {
  let h = hex.slice(1);
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/** `pct` percent of `colour` over `base`; non-hex colours pass through. */
export function tint(colour, pct, base) {
  if (!HEX.test(colour || '') || !HEX.test(base || '')) return colour;
  const a = rgb(colour);
  const b = rgb(base);
  const p = pct / 100;
  const out = a.map((v, i) => Math.round(v * p + b[i] * (1 - p)));
  return `#${out.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

const LIGHT = {
  page: '#ffffff', rail: '#e9eef3', railOn: '#ffffff', surface: '#f6f8fa', line: '#e6e9ee',
  text: '#1f2428', text2: '#5f6775', text3: '#9aa3b0', pill: '#ffffff',
  shadow: '0 1px 2px rgba(20,30,40,.08), 0 4px 14px rgba(20,30,40,.08)',
  fab: '#2d6cdf', today: '#e5533d', star: '#f3b53d', now: '#e5533d',
  mix: 26, mixStrong: 48, mixSoft: 11,
};
const DARK = {
  page: '#14171c', rail: '#1b2027', railOn: '#272d36', surface: '#1b1f26', line: '#262c35',
  text: '#eceef3', text2: '#a6adbb', text3: '#6f7886', pill: '#232933',
  shadow: '0 1px 2px rgba(0,0,0,.4), 0 4px 14px rgba(0,0,0,.35)',
  fab: '#4a8bff', today: '#ff6b55', star: '#f3b53d', now: '#ff6b55',
  mix: 30, mixStrong: 55, mixSoft: 11,
};

export function palette(scheme) {
  return scheme === 'dark' ? DARK : LIGHT;
}

/** The inline style that gives one element a person's colour and tints. */
export function personStyle(colour, scheme) {
  const p = palette(scheme);
  return [
    `--pc:${colour}`,
    `--tint:${tint(colour, p.mix, p.page)}`,
    `--tint-strong:${tint(colour, p.mixStrong, p.page)}`,
    `--tint-soft:${tint(colour, p.mixSoft, p.page)}`,
  ].join(';');
}

/**
 * Fonts must be declared on the document, not inside a shadow root, or the
 * browser never loads them. Injected once per page however many cards exist.
 */
export function ensureFonts() {
  if (typeof document === 'undefined') return;
  if (document.head.querySelector('style[data-family-hub-fonts]')) return;
  const style = document.createElement('style');
  style.setAttribute('data-family-hub-fonts', '');
  style.textContent = FONT_FACES;
  document.head.appendChild(style);
}

/** Scheme tokens on the card host; children inherit them through the shadow boundary. */
export const tokens = css`
  :host {
    --fh-serif: 'Lora', Georgia, 'Times New Roman', serif;
    --fh-sans: 'Outfit', 'Segoe UI', system-ui, -apple-system, sans-serif;
    --fh-page: #ffffff; --fh-rail: #e9eef3; --fh-rail-on: #ffffff; --fh-surface: #f6f8fa; --fh-line: #e6e9ee;
    --fh-text: #1f2428; --fh-text-2: #5f6775; --fh-text-3: #9aa3b0; --fh-pill: #ffffff;
    --fh-shadow: 0 1px 2px rgba(20,30,40,.08), 0 4px 14px rgba(20,30,40,.08);
    --fh-fab: #2d6cdf; --fh-today: #e5533d; --fh-star: #f3b53d; --fh-now: #e5533d;
    --fh-radius: 18px; --fh-radius-s: 12px; --fh-touch: 44px;
  }
  :host([data-scheme='dark']) {
    --fh-page: #14171c; --fh-rail: #1b2027; --fh-rail-on: #272d36; --fh-surface: #1b1f26; --fh-line: #262c35;
    --fh-text: #eceef3; --fh-text-2: #a6adbb; --fh-text-3: #6f7886; --fh-pill: #232933;
    --fh-shadow: 0 1px 2px rgba(0,0,0,.4), 0 4px 14px rgba(0,0,0,.35);
    --fh-fab: #4a8bff; --fh-today: #ff6b55; --fh-now: #ff6b55;
  }
`;

/** Pieces every screen uses: pills, avatars, ticks, section titles. */
export const shared = css`
  :host { display: block; font-family: var(--fh-sans); color: var(--fh-text); font-size: 15px; line-height: 1.3; }
  * { box-sizing: border-box; }
  button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; padding: 0; }
  button:focus-visible { outline: 2px solid var(--fh-text); outline-offset: 2px; border-radius: 10px; }
  .serif { font-family: var(--fh-serif); }
  .pill { background: var(--fh-pill); box-shadow: var(--fh-shadow); border-radius: 999px; min-height: 40px; padding: 0 16px; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; white-space: nowrap; }
  .pill.icon { width: 40px; padding: 0; justify-content: center; font-size: 18px; }
  .av { width: 38px; height: 38px; border-radius: 50%; background: var(--pc); color: #fff; display: grid; place-items: center; font-weight: 600; font-size: 15px; flex-shrink: 0; overflow: hidden; }
  .av img { width: 100%; height: 100%; object-fit: cover; }
  .av ha-icon { --mdc-icon-size: 22px; }
  .av.sm { width: 24px; height: 24px; font-size: 11px; }
  .av.sm ha-icon { --mdc-icon-size: 15px; }
  .av.lg { width: 48px; height: 48px; font-size: 19px; }
  .av.lg ha-icon { --mdc-icon-size: 28px; }
  .av.off { opacity: .35; }
  .tick { width: 26px; height: 26px; border-radius: 50%; border: 2px solid var(--tint-strong); background: var(--fh-page); display: inline-grid; place-items: center; flex-shrink: 0; }
  .tick.on { background: var(--pc); border-color: var(--pc); }
  .tick svg { width: 14px; height: 14px; stroke: #fff; fill: none; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; opacity: 0; }
  .tick.on svg { opacity: 1; }
  .tick.ring { animation: fh-ring var(--fh-window, 3s) linear forwards; }
  @keyframes fh-ring { from { opacity: 1; } to { opacity: .45; } }
  .tap { min-width: var(--fh-touch); min-height: var(--fh-touch); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .sec { font-family: var(--fh-serif); font-size: 19px; margin: 12px 0 8px; }
  .muted { color: var(--fh-text-2); }
  .faint { color: var(--fh-text-3); }
  .notice { font-size: 13px; color: var(--error-color, #d64545); padding: 6px 0 2px; }
  .badge { font-size: 10.5px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; flex-shrink: 0; }
  .badge.waiting { color: var(--fh-star); }
  .badge.overdue { color: var(--error-color, #d64545); }
  .badge.needs { color: var(--pc, var(--fh-text-2)); }
  .empty { padding: 40px 12px; text-align: center; color: var(--fh-text-2); }
  .empty h2 { font-family: var(--fh-serif); font-weight: 500; margin: 8px 0 6px; color: var(--fh-text); }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
`;
