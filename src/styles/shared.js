import { css } from 'lit';

/**
 * Two type tiers, deliberately. Tier 1 is legible at 2-3m across a room;
 * tier 2 is arm's-length detail. A third tier makes the layout mush.
 */
export const sharedStyles = css`
  :host {
    --fh-t1-size: 1.75rem;
    --fh-t1-weight: 600;
    --fh-t2-size: 0.9375rem;
    --fh-t2-weight: 400;
    --fh-mono: 'IBM Plex Mono', ui-monospace, monospace;
    --fh-gap: 12px;
    --fh-radius: 14px;
    --fh-touch: 48px;
    --fh-surface: var(--card-background-color, #1c1c1e);
    --fh-surface-2: var(--secondary-background-color, #2c2c2e);
    --fh-text: var(--primary-text-color, #fff);
    --fh-text-dim: var(--secondary-text-color, #8e8e93);
    display: block;
  }

  .t1 {
    font-size: var(--fh-t1-size);
    font-weight: var(--fh-t1-weight);
    line-height: 1.2;
    color: var(--fh-text);
  }

  .t2 {
    font-size: var(--fh-t2-size);
    font-weight: var(--fh-t2-weight);
    line-height: 1.4;
    color: var(--fh-text-dim);
  }

  .time {
    font-family: var(--fh-mono);
    font-size: var(--fh-t2-size);
    color: var(--fh-text-dim);
    letter-spacing: 0.02em;
  }

  .tap {
    min-width: var(--fh-touch);
    min-height: var(--fh-touch);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: inherit;
  }

  .tap:focus-visible {
    outline: 2px solid var(--fh-text);
    outline-offset: 2px;
  }

  .stale {
    font-size: 0.75rem;
    color: var(--warning-color, #ffb84a);
  }

  .notice {
    font-size: 0.8125rem;
    color: var(--error-color, #ff4a4a);
    padding: 4px 0;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
`;
