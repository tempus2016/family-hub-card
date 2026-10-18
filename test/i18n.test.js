import { describe, it, expect } from 'vitest';
import { t, pickLanguage } from '../src/i18n.js';

describe('t', () => {
  it('returns English by default', () => {
    expect(t('en', 'all_done')).toBe('All done');
  });

  it('returns the Portuguese string when the language is pt', () => {
    expect(t('pt', 'all_done')).toBe('Tudo feito');
  });

  it('falls back to English for a language it has no strings for', () => {
    expect(t('de', 'all_done')).toBe('All done');
  });

  it('falls back to English for a key a language is missing', () => {
    expect(t('pt', '__only_in_en__')).toBe(t('en', '__only_in_en__'));
  });

  it('returns the key itself when nobody has it, so a gap is visible', () => {
    expect(t('en', 'no_such_key')).toBe('no_such_key');
  });

  it('substitutes placeholders', () => {
    expect(t('en', 'next', { chore: 'Make bed' })).toBe('Next: Make bed');
  });
});

describe('pickLanguage', () => {
  it('reads the language off hass, dropping any region', () => {
    expect(pickLanguage({ language: 'pt-BR' })).toBe('pt');
    expect(pickLanguage({ locale: { language: 'en-GB' } })).toBe('en');
  });

  it('defaults to English without hass', () => {
    expect(pickLanguage(undefined)).toBe('en');
  });
});
