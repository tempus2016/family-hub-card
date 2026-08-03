import { describe, it, expect } from 'vitest';
import config from '../rollup.config.js';

/**
 * dist/family-hub-card.js is the file HACS installs, and CI proves it matches
 * src/ by rebuilding and checking dist/ is clean afterwards. That proof only
 * holds while the build actually writes to the tracked bundle: redirect the
 * output anywhere else under dist/ and .gitignore hides it, leaving a
 * hand-authored bundle to ship unchallenged. Pin the path here so moving it is
 * a failing test rather than a silent one-line diff.
 */
describe('rollup config', () => {
  it('builds src/family-hub-card.js into the tracked bundle', () => {
    expect(config.input).toBe('src/family-hub-card.js');
    expect(config.output.file).toBe('dist/family-hub-card.js');
  });

  it('emits no extra files alongside the bundle', () => {
    expect(config.output.sourcemap).toBe(false);
    expect(config.output.dir).toBeUndefined();
  });
});
