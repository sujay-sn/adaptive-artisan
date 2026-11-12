import { afterEach, describe, expect, it, vi } from 'vitest';
import { playCue } from './cues';
import { listenForSectionJumps } from './navigation';

vi.mock('./cues', () => ({ playCue: vi.fn() }));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.mocked(playCue).mockClear();
});

describe('section-jump cue', () => {
  it('plays when the hash moves to a section, and not for anything else', () => {
    // Tests run in Node, so stand in a window: an event target with a location.
    const location = { hash: '' };
    const fakeWindow = Object.assign(new EventTarget(), { location });
    vi.stubGlobal('window', fakeWindow);
    listenForSectionJumps();

    const jump = (hash: string) => {
      location.hash = hash;
      fakeWindow.dispatchEvent(new Event('hashchange'));
    };
    jump('#projects');
    jump('#not-a-section');
    jump('');

    expect(playCue).toHaveBeenCalledTimes(1);
    expect(playCue).toHaveBeenCalledWith('navigate');
  });
});
