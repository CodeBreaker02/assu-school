"use client";

import { motion } from "motion/react";

export type Mood = "idle" | "happy" | "sad" | "think" | "party";

const mouths: Record<Mood, string> = {
  idle: "M27 47 Q32 50 37 47",
  happy: "M25 45 Q32 54 39 45",
  sad: "M26 50 Q32 45 38 50",
  think: "M28 48 L36 47",
  party: "M24 44 Q32 58 40 44 Z",
};

/**
 * Kori, the cowrie: Assu School's companion. Reacts to answers the way a
 * friendly tutor would — never mocking, always encouraging.
 */
export function Kori({ mood = "idle", size = 64, className = "" }: { mood?: Mood; size?: number; className?: string }) {
  const bounce =
    mood === "party"
      ? { y: [0, -10, 0], rotate: [0, -6, 6, 0] }
      : mood === "happy"
        ? { y: [0, -6, 0] }
        : mood === "sad"
          ? { rotate: [0, -4, 0] }
          : { y: [0, -2, 0] };

  return (
    <motion.svg
      viewBox="0 0 64 72"
      width={size}
      height={size * 1.125}
      className={className}
      animate={bounce}
      transition={{ duration: mood === "idle" || mood === "think" ? 2.4 : 0.6, repeat: mood === "idle" || mood === "think" || mood === "party" ? Infinity : 0, ease: "easeInOut" }}
      aria-hidden
    >
      <defs>
        <radialGradient id="kori-shell" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="55%" stopColor="#f6d58e" />
          <stop offset="100%" stopColor="#d99a2b" />
        </radialGradient>
      </defs>
      <ellipse cx="32" cy="68" rx="16" ry="3" fill="rgb(0 0 0 / 0.18)" />
      <ellipse cx="32" cy="36" rx="26" ry="31" fill="url(#kori-shell)" />
      {/* the shell's toothed aperture, used as a little belly */}
      <path d="M32 52 C 29 56, 29 62, 32 65 C 35 62, 35 56, 32 52 Z" fill="#7a5a1e" opacity="0.55" />
      {/* cheeks */}
      <circle cx="18" cy="43" r="4" fill="#e2603b" opacity={mood === "sad" ? 0.15 : 0.35} />
      <circle cx="46" cy="43" r="4" fill="#e2603b" opacity={mood === "sad" ? 0.15 : 0.35} />
      {/* eyes, with a blink */}
      {[23, 41].map((x) => (
        <motion.g key={x} animate={{ scaleY: [1, 1, 0.1, 1] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.92, 0.95, 1] }} style={{ transformOrigin: `${x}px 34px` }}>
          {mood === "party" || mood === "happy" ? (
            <path d={`M${x - 4} 35 Q${x} 29 ${x + 4} 35`} fill="none" stroke="#2a2216" strokeWidth="2.6" strokeLinecap="round" />
          ) : (
            <>
              <circle cx={x} cy="34" r="4.2" fill="#2a2216" />
              <circle cx={x + 1.4} cy="32.6" r="1.4" fill="#fff" />
            </>
          )}
        </motion.g>
      ))}
      {mood === "think" && <path d="M44 22 q4 -4 8 0" fill="none" stroke="#2a2216" strokeWidth="2" strokeLinecap="round" />}
      <path d={mouths[mood]} fill={mood === "party" ? "#2a2216" : "none"} stroke="#2a2216" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}
