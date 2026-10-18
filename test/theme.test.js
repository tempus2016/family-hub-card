// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { tint, palette, personStyle, ensureFonts } from '../src/styles/theme.js';

describe('tint', () => {
  it('blends a hex colour towards a base by a percentage', () => {
    expect(tint('#000000', 50, '#ffffff')).toBe('#808080');
    expect(tint('#ff0000', 26, '#ffffff')).toBe('#ffbdbd');
  });

  it('accepts three-digit hex', () => {
    expect(tint('#f00', 100, '#ffffff')).toBe('#ff0000');
  });

  it('passes a non-hex colour through unchanged rather than guessing', () => {
    expect(tint('var(--x)', 26, '#ffffff')).toBe('var(--x)');
  });
});

describe('palette', () => {
  it('is white-paged in light and near-black in dark', () => {
    expect(palette('light').page).toBe('#ffffff');
    expect(palette('dark').page).not.toBe('#ffffff');
  });
});

describe('personStyle', () => {
  it('derives the three tints for a person in the given scheme', () => {
    const s = personStyle('#b36ad6', 'light');
    expect(s).toMatch(/--pc:#b36ad6/);
    expect(s).toMatch(/--tint:#/);
    expect(s).toMatch(/--tint-strong:#/);
    expect(s).toMatch(/--tint-soft:#/);
    expect(personStyle('#b36ad6', 'dark')).not.toBe(s);
  });
});

describe('ensureFonts', () => {
  it('injects the font faces into the document once', () => {
    ensureFonts();
    ensureFonts();
    const tags = document.head.querySelectorAll('style[data-family-hub-fonts]');
    expect(tags).toHaveLength(1);
    expect(tags[0].textContent).toContain("font-family:'Lora'");
    expect(tags[0].textContent).toContain("font-family:'Outfit'");
  });
});
