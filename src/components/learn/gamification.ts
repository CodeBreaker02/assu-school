"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * Learning loop state, persisted per browser: XP per day (→ streak, daily
 * goal), daily quest counters, and a Leitner spaced-repetition queue of quiz
 * questions. No backend: everything lives in localStorage.
 */

const KEY = "assu-school-game";
const PROFILE_KEY = "assu-school-profile";
const EVENT = "assu-school-game";

export type DayStats = { xp: number; lessons: number; correct: number; bestCombo: number; perfect: number; reviews: number };
export type SrsItem = { lesson: string; id: string; box: number; due: string };
export type GameState = { days: Record<string, DayStats>; srs: Record<string, SrsItem>; quizBest: Record<string, number> };

const empty: GameState = { days: {}, srs: {}, quizBest: {} };
const emptyDay: DayStats = { xp: 0, lessons: 0, correct: 0, bestCombo: 0, perfect: 0, reviews: 0 };

/** Days until the next review for each Leitner box. */
export const BOX_INTERVALS = [0, 1, 3, 7, 16, 35];

export const XP = { correct: 10, retry: 5, comboEvery: 5, combo: 10, perfect: 20, lesson: 20, review: 10 } as const;

export const dayKey = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const addDays = (key: string, n: number) => {
  const [y, m, d] = key.split("-").map(Number);
  return dayKey(new Date(y, m - 1, d + n));
};

function readRaw() {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}
function readProfileRaw() {
  try {
    return localStorage.getItem(PROFILE_KEY) ?? "";
  } catch {
    return "";
  }
}

function parse(raw: string): GameState {
  try {
    const v = JSON.parse(raw);
    return { days: v.days ?? {}, srs: v.srs ?? {}, quizBest: v.quizBest ?? {} };
  } catch {
    return empty;
  }
}

function save(s: GameState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* won't persist in private mode */
  }
  window.dispatchEvent(new Event(EVENT));
}

function update(fn: (s: GameState) => void) {
  const s = parse(readRaw());
  fn(s);
  save(s);
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  window.addEventListener("assu-school-account", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("assu-school-account", cb);
  };
}

/* ───────────── Writes ───────────── */

function bump(s: GameState, patch: Partial<DayStats>) {
  const k = dayKey();
  const d = { ...emptyDay, ...s.days[k] };
  for (const [key, v] of Object.entries(patch) as [keyof DayStats, number][]) {
    d[key] = key === "bestCombo" ? Math.max(d[key], v) : d[key] + v;
  }
  s.days[k] = d;
}

export const game = {
  addXp(xp: number, extra: Partial<DayStats> = {}) {
    update((s) => bump(s, { xp, ...extra }));
  },
  /** Records one answer for spaced repetition: wrong → box 0 (due today), right → next box. */
  review(lesson: string, id: string, correct: boolean) {
    update((s) => {
      const key = `${lesson}#${id}`;
      const prev = s.srs[key];
      const box = correct ? Math.min(BOX_INTERVALS.length - 1, (prev?.box ?? 0) + 1) : 0;
      s.srs[key] = { lesson, id, box, due: addDays(dayKey(), BOX_INTERVALS[box]) };
    });
  },
  finishQuiz(lesson: string, score: number, opts: { xp: number; bestCombo: number; perfect: boolean; isReview: boolean }) {
    update((s) => {
      s.quizBest[lesson] = Math.max(s.quizBest[lesson] ?? 0, score);
      bump(s, { xp: opts.xp, bestCombo: opts.bestCombo, perfect: opts.perfect ? 1 : 0, reviews: opts.isReview ? 1 : 0 });
    });
  },
  reset() {
    save(empty);
  },
};

/* ───────────── Reads ───────────── */

export function streakOf(days: Record<string, DayStats>, today: string) {
  let k = (days[today]?.xp ?? 0) > 0 ? today : addDays(today, -1);
  let n = 0;
  while ((days[k]?.xp ?? 0) > 0) {
    n++;
    k = addDays(k, -1);
  }
  return n;
}

const goalFromProfile = (raw: string) => {
  try {
    const g = JSON.parse(raw).goal;
    return g === 5 ? 20 : g === 20 ? 50 : 30;
  } catch {
    return 30;
  }
};
const soundFromProfile = (raw: string) => {
  try {
    return JSON.parse(raw).sound !== false;
  } catch {
    return true;
  }
};

export type Quest = { id: string; label: string; target: number; value: number };

const QUESTS: { id: string; label: (t: number) => string; target: number; stat: keyof DayStats | "goal" }[] = [
  { id: "xp", label: (t) => `Gagner ${t} XP`, target: 0, stat: "goal" },
  { id: "lesson", label: () => "Terminer une leçon", target: 1, stat: "lessons" },
  { id: "combo", label: (t) => `${t} bonnes réponses d'affilée`, target: 5, stat: "bestCombo" },
  { id: "correct", label: (t) => `${t} bonnes réponses`, target: 15, stat: "correct" },
  { id: "perfect", label: () => "Un quiz sans faute", target: 1, stat: "perfect" },
  { id: "review", label: () => "Faire une révision", target: 1, stat: "reviews" },
];

function questsFor(today: string, stats: DayStats, goal: number): Quest[] {
  // The XP quest is always there; two others rotate with the date.
  const seed = today.split("-").reduce((n, p) => n * 31 + Number(p), 7);
  const pool = QUESTS.slice(1);
  const a = seed % pool.length;
  const b = (a + 1 + ((seed >> 3) % (pool.length - 1))) % pool.length;
  return [QUESTS[0], pool[a], pool[b]].map((q) => {
    const target = q.stat === "goal" ? goal : q.target;
    const value = q.stat === "goal" ? stats.xp : stats[q.stat];
    return { id: q.id, label: q.label(target), target, value: Math.min(value, target) };
  });
}

// The date is read on the client only, so prerendering never bakes in "today".
const noop = () => () => {};

export function useGame() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "");
  const profileRaw = useSyncExternalStore(subscribe, readProfileRaw, () => "");
  const today = useSyncExternalStore(noop, () => dayKey(), () => "");
  return useMemo(() => {
    const s = parse(raw);
    const stats = { ...emptyDay, ...s.days[today] };
    const goal = goalFromProfile(profileRaw);
    const totalXp = Object.values(s.days).reduce((n, d) => n + d.xp, 0);
    const due = today ? Object.values(s.srs).filter((i) => i.due <= today) : [];
    return {
      state: s,
      today: stats,
      totalXp,
      goal,
      goalPct: Math.min(1, stats.xp / goal),
      streak: today ? streakOf(s.days, today) : 0,
      quests: questsFor(today, stats, goal),
      due,
      sound: soundFromProfile(profileRaw),
      activity: activityLevels(s.days, today),
    };
  }, [raw, profileRaw, today]);
}

/** XP per day for the last `weeks` weeks (oldest first), as 0–4 intensity levels. */
export function activityLevels(days: Record<string, DayStats>, today: string, weeks = 12) {
  if (!today) return Array.from({ length: weeks * 7 }, () => 0);
  return Array.from({ length: weeks * 7 }, (_, i) => {
    const xp = days[addDays(today, i - (weeks * 7 - 1))]?.xp ?? 0;
    return xp === 0 ? 0 : xp < 20 ? 1 : xp < 40 ? 2 : xp < 80 ? 3 : 4;
  });
}
