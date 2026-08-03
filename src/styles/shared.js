import { css } from 'lit';

/**
 * The card ships its own visual language rather than inheriting Home
 * Assistant's theme wholesale. Values are ported from mockups/c.html, which is
 * the approved visual spec.
 *
 * Every token is a `--fh-*` custom property, so a theme or a card-mod user can
 * override any of it. Overriding is opt-in; the default is the designed look.
 *
 * Fonts follow the mockup's stack: IBM Plex if the user has it, system fonts
 * otherwise. No webfont is bundled or fetched.
 */
export const sharedStyles = css`
  :host {
    /* Surfaces */
    --fh-bg: var(--fh-card-bg, #12151c);
    --fh-surface: var(--fh-surface-bg, #181c26);
    --fh-chip: var(--fh-chip-bg, #232838);
    --fh-rule: var(--fh-rule-color, #232838);
    --fh-rule-soft: var(--fh-rule-soft-color, #1f2431);

    /* Text */
    --fh-text: var(--fh-text-color, #e8eaf0);
    --fh-text-strong: var(--fh-text-strong-color, #ffffff);
    --fh-text-mute: var(--fh-text-mute-color, #9aa3b8);
    --fh-text-soft: var(--fh-text-soft-color, #8b94ab);
    --fh-text-dim: var(--fh-text-dim-color, #5d6579);
    --fh-text-faint: var(--fh-text-faint-color, #6d768c);
    --fh-chore-text: var(--fh-chore-text-color, #c3c9d8);

    /* Type */
    --fh-font: var(--fh-font-family, 'IBM Plex Sans', 'Segoe UI', system-ui, -apple-system, sans-serif);
    --fh-mono: var(--fh-font-mono, 'IBM Plex Mono', 'SF Mono', ui-monospace, monospace);

    /* Shape */
    --fh-radius: 16px;
    --fh-radius-inner: 12px;
    --fh-touch: 44px;

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
    color: var(--error-color, #ff6b6b);
    padding: 6px 0 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
`;
