// Sound effects, synthesized with the Web Audio API: no files to download or
// license, and nothing plays unless the visitor has turned sound on.

import { usePreferences } from '@/preferences/store';

export type Cue = 'theme' | 'open' | 'close' | 'success' | 'navigate';

interface Note {
  frequency: number;
  /** Seconds after the cue starts. */
  start: number;
  duration: number;
}

const CUES: Record<Cue, Note[]> = {
  theme: [
    { frequency: 659.25, start: 0, duration: 0.09 },
    { frequency: 987.77, start: 0.06, duration: 0.14 },
  ],
  open: [{ frequency: 523.25, start: 0, duration: 0.12 }],
  close: [{ frequency: 392, start: 0, duration: 0.12 }],
  success: [
    { frequency: 523.25, start: 0, duration: 0.1 },
    { frequency: 659.25, start: 0.08, duration: 0.1 },
    { frequency: 783.99, start: 0.16, duration: 0.18 },
  ],
  // Jumping to a section: a quick step up, quieter than the rest (see LEVEL)
  // because it plays the most often.
  navigate: [
    { frequency: 783.99, start: 0, duration: 0.06 },
    { frequency: 1046.5, start: 0.045, duration: 0.09 },
  ],
};

/** Per-cue volume against the shared master level. */
const LEVEL: Partial<Record<Cue, number>> = { navigate: 0.6 };

let context: AudioContext | null = null;

/**
 * Safari keeps a new AudioContext suspended unless it is resumed inside a user
 * gesture, and cues such as the section jump fire just after one. So on the
 * first tap or key press with sound on, create and resume the context there;
 * every later cue then plays.
 */
export function unlockAudioOnFirstGesture(): void {
  const unlock = () => {
    if (!usePreferences.getState().sound) return;
    try {
      context ??= new AudioContext();
      if (context.state === 'suspended') void context.resume();
    } catch {
      // Sound is decoration; see playCue.
    }
    window.removeEventListener('pointerdown', unlock, true);
    window.removeEventListener('keydown', unlock, true);
  };
  window.addEventListener('pointerdown', unlock, true);
  window.addEventListener('keydown', unlock, true);
}

export function playCue(cue: Cue): void {
  if (!usePreferences.getState().sound) return;
  try {
    context ??= new AudioContext();
    if (context.state === 'suspended') void context.resume();
    const now = context.currentTime;
    const master = context.createGain();
    master.gain.value = 0.06 * (LEVEL[cue] ?? 1);
    master.connect(context.destination);
    for (const note of CUES[cue]) {
      const oscillator = context.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = note.frequency;
      const envelope = context.createGain();
      const start = now + note.start;
      envelope.gain.setValueAtTime(0, start);
      envelope.gain.linearRampToValueAtTime(1, start + 0.01);
      envelope.gain.exponentialRampToValueAtTime(0.001, start + note.duration);
      oscillator.connect(envelope).connect(master);
      oscillator.start(start);
      oscillator.stop(start + note.duration + 0.02);
    }
  } catch {
    // Audio can be unavailable or blocked. Sound is decoration, so fail quietly.
  }
}