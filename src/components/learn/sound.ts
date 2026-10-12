"use client";

/**
 * Tiny synthesized feedback sounds (no audio files): a bright two-note chime
 * for a right answer, a soft low buzz for a wrong one, an arpeggio to finish.
 */

let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, at: number, dur: number, type: OscillatorType = "sine", gain = 0.12) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + at;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sfx = {
  correct() {
    tone(784, 0, 0.16, "triangle");
    tone(1175, 0.09, 0.28, "triangle");
  },
  wrong() {
    tone(196, 0, 0.18, "square", 0.05);
    tone(165, 0.12, 0.26, "square", 0.05);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(80);
  },
  combo() {
    [880, 1109, 1319].forEach((f, i) => tone(f, i * 0.06, 0.2, "triangle", 0.09));
  },
  complete() {
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.09, 0.35, "triangle", 0.1));
  },
};
