// Sound effects, synthesized with the Web Audio API: no files to download or
// license, and nothing plays unless the visitor has turned sound on.

import { usePreferences } from '@/preferences/store';

export type Cue = 'theme' | 'open' | 'close' | 'success';

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
};

let context: AudioContext | null = null;

export function playCue(cue: Cue): void {
  if (!usePreferences.getState().sound) return;
  try {
    context ??= new AudioContext();
    const now = context.currentTime;
    const master = context.createGain();
    master.gain.value = 0.06;
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