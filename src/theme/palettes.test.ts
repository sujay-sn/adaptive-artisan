import { describe, expect, it } from 'vitest';
import { DEFAULT_THEME, normalizeHex, PALETTE_NAMES, PALETTE_TONES, tonalPalettes } from './engine';

describe('tonal palettes', () => {
  it('returns every palette at every standard tone, from black to white', () => {
    const palettes = tonalPalettes(DEFAULT_THEME);
    for (const name of PALETTE_NAMES) {
      expect(palettes[name]).toHaveLength(PALETTE_TONES.length);
      expect(palettes[name][0]?.toLowerCase()).toBe('#000000');
      expect(palettes[name].at(-1)?.toLowerCase()).toBe('#ffffff');
    }
  });
});

describe('hex input', () => {
  it('normalizes short and long forms, with or without #', () => {
    expect(normalizeHex('#0b7a75')).toBe('#0B7A75');
    expect(normalizeHex('0b7a75')).toBe('#0B7A75');
    expect(normalizeHex('#abc')).toBe('#AABBCC');
    expect(normalizeHex('  fff ')).toBe('#FFFFFF');
  });

  it('rejects anything that is not a hex color', () => {
    for (const bad of ['', '#', '#ab', '#abcd', 'teal', '#gggggg', '#0b7a751']) expect(normalizeHex(bad)).toBeNull();
  });
});