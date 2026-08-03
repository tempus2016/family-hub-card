import { css } from 'lit';

/**
 * Design tokens. Defined once, on the card host only — custom properties
 * inherit through shadow roots, so redefining them on a child component's
 * :host would shadow the inherited value and break theme switching.
 *
 * Dark values are ported from mockups/c.html, which is the visual spec. Light
 * values are the same design retuned, not Home Assistant's raw theme variables:
 * inheriting those wholesale is what made the card look generic in the first
 * place.
 *
 * Every token can still be overridden by a theme or card-mod, because each one
 * reads an optional `--fh-*-color` first.
 */
export const tokens = css`
  :host {
    --fh-bg: var(--fh-card-bg, #12151c);
    --fh-surface: var(--fh-surface-bg, #181c26);
    --fh-chip: var(--fh-chip-bg, #232838);
    --fh-rule: var(--fh-rule-color, #232838);
    --fh-rule-soft: var(--fh-rule-soft-color, #1f2431);

    --fh-text: var(--fh-text-color, #e8eaf0);
    --fh-text-strong: var(--fh-text-strong-color, #ffffff);
    --fh-text-mute: var(--fh-text-mute-color, #9aa3b8);
    --fh-text-soft: var(--fh-text-soft-color, #8b94ab);
    --fh-text-dim: var(--fh-text-dim-color, #5d6579);
    --fh-text-faint: var(--fh-text-faint-color, #6d768c);
    --fh-chore-text: var(--fh-chore-text-color, #c3c9d8);
    --fh-now: var(--fh-now-color, #4A9EFF);

    --fh-font: var(--fh-font-family, 'IBM Plex Sans', 'Segoe UI', system-ui, -apple-system, sans-serif);
    --fh-mono: var(--fh-font-mono, 'IBM Plex Mono', 'SF Mono', ui-monospace, monospace);

    --fh-radius: 16px;
    --fh-radius-inner: 12px;
    --fh-touch: 44px;
  }

  :host([data-scheme='light']) {
    --fh-bg: var(--fh-card-bg, #ffffff);
    --fh-surface: var(--fh-surface-bg, #f4f6f9);
    --fh-chip: var(--fh-chip-bg, #e3e7ee);
    --fh-rule: var(--fh-rule-color, #e3e7ee);
    --fh-rule-soft: var(--fh-rule-soft-color, #edf0f5);

    --fh-text: var(--fh-text-color, #1b1f28);
    --fh-text-strong: var(--fh-text-strong-color, #000000);
    --fh-text-mute: var(--fh-text-mute-color, #5b6478);
    --fh-text-soft: var(--fh-text-soft-color, #6b7488);
    --fh-text-dim: var(--fh-text-dim-color, #8a92a4);
    --fh-text-faint: var(--fh-text-faint-color, #949cad);
    --fh-chore-text: var(--fh-chore-text-color, #2b3140);
  }
`;

/**
 * Utility classes shared by the card shell and the views. These only consume
 * tokens — they never define them.
 */
export const sharedStyles = css`
  :host {
    display: block;
    font-family: var(--fh-font);
    color: var(--fh-text);
  }

  .sec-l {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.4px;
    color: var(--fh-text-dim);
    margin: 0 0 10px 2px;
    font-weight: 600;
  }

  /* A 44px hit area wrapped around a small visual mark: the mockup's density
     without sub-thumb tap targets on a wall tablet. */
  .tap {
    min-width: var(--fh-touch);
    min-height: var(--fh-touch);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    color: inherit;
    flex-shrink: 0;
  }

  .tap:focus-visible {
    outline: 2px solid var(--fh-text-strong);
    outline-offset: -6px;
    border-radius: 10px;
  }

  .stale {
    font-size: 12px;
    color: var(--warning-color, #FFB84A);
    margin-top: 4px;
  }

  .notice {
    font-size: 13px;
    color: var(--error-color, #d64545);
    padding: 6px 0 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
`;
