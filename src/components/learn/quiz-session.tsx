"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { CourseLesson } from "@/lib/content";
import type { Question } from "@/lib/quiz";
import { CoinBurst } from "./charts";
import { XP, game, useGame } from "./gamification";
import { Kori, type Mood } from "./mascot";
import { AnimatedNumber, ease } from "./motion";
import { markLessonComplete, useLessonProgress } from "./progress";
import { AnswerInput, type AnswerValue, correctAnswerLabel, initialValue, isAnswered, isCorrect, promptOf, typeLabel } from "./quiz-answers";
import { sfx } from "./sound";

export type QuizItem = { lesson: string; q: Question };
const noop = () => () => {};
type Slot = { item: QuizItem; retry: boolean };

const praise = ["Excellent !", "Bien joué !", "Exactement !", "Parfait !", "Bravo !", "Vous avez l'œil !"];
const comfort = ["Pas tout à fait.", "Presque !", "On y revient."];
const pick = (arr: string[], seed: number) => arr[seed % arr.length];

export function Flame({ lit = true, className = "size-5" }: { lit?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 2c1 3.5 5 5.5 5 10.5A5 5 0 0 1 7 12.5c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-6 1-9Z"
        fill={lit ? "#e2603b" : "currentColor"}
        opacity={lit ? 1 : 0.35}
      />
      {lit && <path d="M12 21a3 3 0 0 1-3-3c0-1.6 1.2-2.6 2-3.5.2 1 .8 1.6 1.5 1.6 0-1 .2-2 .8-2.6.9 1.2 1.7 2.4 1.7 4.5a3 3 0 0 1-3 3Z" fill="#f6d58e" />}
    </svg>
  );
}

function Stat({ label, children, tone = "text-cream" }: { label: string; children: React.ReactNode; tone?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-ink-2 p-4 text-center">
      <div className="text-xs tracking-[0.12em] text-muted uppercase">{label}</div>
      <div className={`mt-1 font-display text-3xl ${tone}`}>{children}</div>
    </div>
  );
}

/**
 * A focused, full-screen practice session in the spirit of Duolingo:
 * one question at a time, instant feedback, mistakes come back at the end,
 * XP with combo bonuses, and a celebration that feeds the daily streak.
 */
export function QuizSession({
  open,
  onClose,
  items,
  title,
  mode,
  lessonSlug,
  next,
}: {
  open: boolean;
  onClose: () => void;
  items: QuizItem[];
  title: string;
  mode: "lesson" | "review";
  lessonSlug?: string;
  next?: CourseLesson | null;
}) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  if (!mounted) return null;
  // Portalled to <body>: an animated (transformed) ancestor would otherwise trap `position: fixed`.
  return createPortal(
    <AnimatePresence>{open && <Session key={items.map((i) => i.q.id).join()} {...{ onClose, items, title, mode, lessonSlug, next }} />}</AnimatePresence>,
    document.body,
  );
}

function Session({
  onClose,
  items,
  title,
  mode,
  lessonSlug,
  next,
}: {
  onClose: () => void;
  items: QuizItem[];
  title: string;
  mode: "lesson" | "review";
  lessonSlug?: string;
  next?: CourseLesson | null;
}) {
  const g = useGame();
  const done = useLessonProgress();
  const [queue, setQueue] = useState<Slot[]>(() => items.map((item) => ({ item, retry: false })));
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState<AnswerValue>(() => initialValue(items[0].q));
  const [phase, setPhase] = useState<"answer" | "feedback" | "done">("answer");
  const [result, setResult] = useState<boolean | null>(null);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [xp, setXp] = useState(0);
  const [firstTryRight, setFirstTryRight] = useState(0);
  const [mistakes, setMistakes] = useState<QuizItem[]>([]);
  const [floating, setFloating] = useState<{ id: number; text: string } | null>(null);
  const [milestone, setMilestone] = useState<number | null>(null);
  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [burst, setBurst] = useState(0);
  // Snapshots taken when the session opens, to animate "before → after".
  const [streakBefore] = useState(g.streak);
  const [xpTodayBefore] = useState(g.today.xp);
  const sound = g.sound;

  const slot = queue[index];
  const q = slot?.item.q;
  const answered = q ? isAnswered(q, value) : false;
  const progress = phase === "done" ? 1 : (index + (phase === "feedback" ? 1 : 0)) / queue.length;

  const check = useCallback(() => {
    if (!q || phase !== "answer" || !isAnswered(q, value)) return;
    const ok = isCorrect(q, value);
    setResult(ok);
    setPhase("feedback");
    if (!slot.retry) game.review(slot.item.lesson, q.id, ok);
    if (ok) {
      const c = combo + 1;
      let gain = slot.retry ? XP.retry : XP.correct;
      if (c % XP.comboEvery === 0) {
        gain += XP.combo;
        setMilestone(c);
        if (sound) setTimeout(sfx.combo, 250);
      }
      setCombo(c);
      setBestCombo((b) => Math.max(b, c));
      setXp((x) => x + gain);
      if (!slot.retry) setFirstTryRight((n) => n + 1);
      setFloating({ id: Date.now(), text: `+${gain} XP` });
      game.addXp(0, { correct: 1, bestCombo: c });
      if (sound) sfx.correct();
    } else {
      setCombo(0);
      setFloating(null);
      if (!slot.retry) setMistakes((m) => [...m, slot.item]);
      setQueue((qu) => [...qu, { item: slot.item, retry: true }]);
      if (sound) sfx.wrong();
    }
  }, [q, phase, value, slot, combo, sound]);

  const finish = useCallback(() => {
    const total = items.length;
    const perfect = firstTryRight === total;
    const bonus = (perfect ? XP.perfect : 0) + (mode === "review" ? XP.review : 0);
    const finalXp = xp + bonus;
    setXp(finalXp);
    setElapsed(Math.round((Date.now() - startedAt) / 1000));
    game.finishQuiz(lessonSlug ?? "revision", firstTryRight / total, { xp: finalXp, bestCombo, perfect, isReview: mode === "review" });
    if (mode === "lesson" && lessonSlug && firstTryRight / total >= 0.6 && !done.has(lessonSlug)) {
      markLessonComplete(lessonSlug);
      game.addXp(XP.lesson, { lessons: 1 });
      setXp((x) => x + XP.lesson);
    }
    setPhase("done");
    setBurst((b) => b + 1);
    if (sound) sfx.complete();
  }, [items.length, firstTryRight, mode, xp, startedAt, lessonSlug, bestCombo, done, sound]);

  const advance = useCallback(() => {
    if (phase !== "feedback") return;
    setMilestone(null);
    if (index + 1 >= queue.length) return finish();
    const nextQ = queue[index + 1].item.q;
    setIndex(index + 1);
    setValue(initialValue(nextQ));
    setResult(null);
    setPhase("answer");
  }, [phase, index, queue, finish]);

  // Match questions grade themselves once every pair is found.
  useEffect(() => {
    if (q?.type === "match" && phase === "answer" && isAnswered(q, value)) {
      const t = setTimeout(check, 350);
      return () => clearTimeout(t);
    }
  }, [q, value, phase, check]);

  // Keyboard: digits pick an option, Enter checks / continues, Escape closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key === "Enter") {
        e.preventDefault();
        if (phase === "answer") check();
        else if (phase === "feedback") advance();
        return;
      }
      if (phase !== "answer" || !q || !/^[1-9]$/.test(e.key)) return;
      const n = Number(e.key) - 1;
      if ((q.type === "choice" || q.type === "fill") && n < q.options.length) setValue(n);
      if (q.type === "truefalse" && n < 2) setValue(n === 0);
    };
    window.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
    };
  }, [phase, q, check, advance, onClose]);

  const retryMistakes = () => {
    setQueue(mistakes.map((item) => ({ item, retry: true })));
    setIndex(0);
    setValue(initialValue(mistakes[0].q));
    setResult(null);
    setPhase("answer");
    setMistakes([]);
  };

  const mood: Mood = phase === "done" ? "party" : phase === "feedback" ? (result ? "happy" : "sad") : answered ? "think" : "idle";
  const accuracy = Math.round((firstTryRight / items.length) * 100);
  const passed = mode === "lesson" && firstTryRight / items.length >= 0.6;
  const streakNow = g.streak;
  const streakGrew = streakNow > streakBefore;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[90] flex flex-col bg-ink text-cream"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.45, ease }}
      data-lenis-prevent
    >
      {/* top bar */}
      <div className="mx-auto flex w-full max-w-3xl items-center gap-4 px-4 pt-5 sm:px-6">
        <button type="button" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full text-muted hover:bg-cream/10 hover:text-cream" aria-label="Quitter le quiz">
          <svg viewBox="0 0 20 20" className="size-5 fill-none stroke-current stroke-2" strokeLinecap="round" aria-hidden>
            <path d="M5 5l10 10M15 5 5 15" />
          </svg>
        </button>
        <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-cream/10">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,var(--gold),var(--gold-soft))]"
            animate={{ width: `${Math.max(4, progress * 100)}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
          <motion.div
            className="absolute top-1 left-2 h-1 rounded-full bg-white/40"
            animate={{ width: `${Math.max(0, progress * 100 - 4)}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
        <motion.div
          className="flex min-w-14 items-center justify-end gap-1 font-mono text-sm"
          animate={combo >= 2 ? { scale: [1, 1.15, 1] } : {}}
          key={combo}
          aria-label={`Combo ${combo}`}
        >
          <Flame lit={combo >= 2} />
          <span className={combo >= 2 ? "text-ember" : "text-muted"}>{combo}</span>
        </motion.div>
      </div>

      <div className="relative flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 pt-8 pb-48 sm:px-6 sm:pt-12">
          <AnimatePresence mode="wait">
            {phase !== "done" && q ? (
              <motion.div
                key={`${index}-${q.id}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease }}
              >
                {slot.retry && (
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-ember/12 px-3 py-1 text-sm text-ember">↺ On y revient</div>
                )}
                <div className="text-sm font-medium tracking-wide text-gold">{typeLabel[q.type]}</div>
                <div className="mt-4 flex items-start gap-4">
                  <Kori mood={mood} size={56} className="hidden shrink-0 sm:block" />
                  <div className="min-w-0 flex-1">
                    {q.type === "choice" && q.context && (
                      <div className="mb-3 rounded-2xl border border-line bg-ink-2 px-4 py-3 text-[16px] leading-relaxed text-cream/85">{q.context}</div>
                    )}
                    {q.type !== "fill" && <h2 className="font-display text-[clamp(1.5rem,3.4vw,2.1rem)] leading-tight">{promptOf(q)}</h2>}
                  </div>
                </div>
                <div className="mt-8">
                  <AnswerInput q={q} value={value} onChange={setValue} locked={phase === "feedback"} result={result} />
                </div>
              </motion.div>
            ) : (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 180, damping: 18 }} className="relative text-center">
                <CoinBurst trigger={burst} count={30} />
                <Kori mood="party" size={110} className="mx-auto" />
                <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-tight">
                  {mode === "review" ? "Révision terminée !" : passed ? "Leçon validée !" : "Quiz terminé !"}
                </h2>
                <p className="mt-2 text-lg text-cream/80">
                  {accuracy === 100 ? "Sans faute. Impressionnant." : accuracy >= 60 ? "Beau travail. Les erreurs reviendront en révision." : "Relisez la leçon, puis réessayez : ça va rentrer."}
                </p>

                <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-3">
                  <Stat label="XP gagnés" tone="text-gold">
                    +<AnimatedNumber value={xp} />
                  </Stat>
                  <Stat label="Précision" tone={accuracy >= 80 ? "text-mint" : accuracy >= 60 ? "text-cream" : "text-ember"}>
                    <AnimatedNumber value={accuracy} format={(v) => `${Math.round(v)} %`} />
                  </Stat>
                  <Stat label="Temps">
                    {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}
                  </Stat>
                </div>

                <div className="mx-auto mt-4 grid max-w-xl gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-4 rounded-2xl border border-ember/30 bg-ember/[0.07] p-4 text-left">
                    <motion.div animate={streakGrew ? { scale: [0.6, 1.3, 1], rotate: [0, -10, 0] } : {}} transition={{ duration: 0.8, delay: 0.5 }}>
                      <Flame className="size-10" />
                    </motion.div>
                    <div>
                      <div className="font-display text-2xl">
                        {streakNow} jour{streakNow > 1 ? "s" : ""}
                      </div>
                      <div className="text-sm text-cream/75">{streakGrew ? "Série prolongée !" : "Série du jour assurée"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-2xl border border-line bg-ink-2 p-4 text-left">
                    <svg viewBox="0 0 40 40" className="size-10 -rotate-90" aria-hidden>
                      <circle cx="20" cy="20" r="16" fill="none" stroke="var(--line-strong)" strokeWidth="5" />
                      <motion.circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke="var(--gold)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        initial={{ pathLength: Math.min(1, xpTodayBefore / g.goal) }}
                        animate={{ pathLength: g.goalPct }}
                        transition={{ duration: 1.2, delay: 0.6, ease }}
                      />
                    </svg>
                    <div>
                      <div className="font-display text-2xl">
                        {Math.min(g.today.xp, g.goal)}/{g.goal} XP
                      </div>
                      <div className="text-sm text-cream/75">{g.goalPct >= 1 ? "Objectif du jour atteint !" : "Objectif du jour"}</div>
                    </div>
                  </div>
                </div>

                <ul className="mx-auto mt-4 max-w-xl space-y-2 text-left">
                  {g.quests.map((qu) => (
                    <li key={qu.id} className="flex items-center gap-3 rounded-xl border border-line bg-ink-2 px-4 py-3">
                      <span className={`grid size-6 place-items-center rounded-full text-xs ${qu.value >= qu.target ? "bg-mint text-[#0a0907]" : "border border-line-strong text-muted"}`}>
                        {qu.value >= qu.target ? "✓" : ""}
                      </span>
                      <span className="flex-1 text-[15px]">{qu.label}</span>
                      <span className="font-mono text-sm text-muted tabular-nums">
                        {qu.value}/{qu.target}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* +XP float */}
        <AnimatePresence>
          {floating && phase === "feedback" && (
            <motion.div
              key={floating.id}
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 1, 0], y: -60, scale: 1.1 }}
              transition={{ duration: 1.1 }}
              className="pointer-events-none absolute right-6 bottom-40 font-display text-2xl text-gold"
            >
              {floating.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* bottom: check button / feedback sheet / end actions */}
      <div className="absolute inset-x-0 bottom-0">
        <AnimatePresence mode="wait">
          {phase === "feedback" && q ? (
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className={`border-t-2 ${result ? "border-mint/40 bg-[color-mix(in_oklab,var(--mint)_14%,var(--ink))]" : "border-ember/40 bg-[color-mix(in_oklab,var(--ember)_14%,var(--ink))]"}`}
            >
              <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:px-6 sm:py-6">
                <Kori mood={result ? "happy" : "sad"} size={48} className="hidden shrink-0 sm:block" />
                <div className="min-w-0 flex-1">
                  <div className={`font-display text-2xl ${result ? "text-mint" : "text-ember"}`}>
                    {result ? pick(praise, index + combo) : pick(comfort, index)}
                    {milestone && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-3 inline-flex rounded-full bg-ember px-2.5 py-0.5 align-middle text-sm text-[#0a0907]">
                        Combo ×{milestone} · +{XP.combo} XP
                      </motion.span>
                    )}
                  </div>
                  {!result && (
                    <div className="mt-1 text-[16px]">
                      <span className="text-cream/70">Bonne réponse : </span>
                      <span className="font-medium">{correctAnswerLabel(q)}</span>
                    </div>
                  )}
                  <p className="mt-1.5 text-[16px] leading-relaxed text-cream/85">{q.explanation}</p>
                </div>
                <motion.button
                  type="button"
                  autoFocus
                  onClick={advance}
                  whileTap={{ scale: 0.96 }}
                  className={`shrink-0 rounded-2xl px-8 py-4 text-base font-semibold text-[#0a0907] shadow-[0_4px_0_rgb(0_0_0/0.25)] ${result ? "bg-mint" : "bg-ember"}`}
                >
                  Continuer
                </motion.button>
              </div>
            </motion.div>
          ) : phase === "answer" ? (
            <motion.div key="check" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-t border-line bg-ink/95 backdrop-blur-xl">
              <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-5 sm:px-6 sm:py-6">
                <span className="hidden text-sm text-muted sm:block">
                  Question {Math.min(index + 1, queue.length)} sur {queue.length} · Entrée pour valider
                </span>
                <motion.button
                  type="button"
                  disabled={!answered || q?.type === "match"}
                  onClick={check}
                  whileTap={{ scale: 0.96 }}
                  className="w-full rounded-2xl bg-gold px-10 py-4 text-base font-semibold text-on-gold shadow-[0_4px_0_rgb(0_0_0/0.25)] transition-opacity disabled:opacity-35 disabled:shadow-none sm:w-auto"
                >
                  {q?.type === "match" ? "Trouvez toutes les paires" : "Vérifier"}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="end" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="border-t border-line bg-ink/95 backdrop-blur-xl">
              <div className="mx-auto flex max-w-3xl flex-col-reverse gap-3 px-4 py-5 sm:flex-row sm:justify-end sm:px-6 sm:py-6">
                {mistakes.length > 0 && (
                  <button type="button" onClick={retryMistakes} className="rounded-2xl border-2 border-line-strong px-6 py-4 font-semibold hover:bg-cream/5">
                    Revoir mes {mistakes.length} erreur{mistakes.length > 1 ? "s" : ""}
                  </button>
                )}
                {mode === "lesson" && passed && next ? (
                  <Link href={`/cours/${next.slug}`} onClick={onClose} className="rounded-2xl bg-gold px-8 py-4 text-center font-semibold text-on-gold shadow-[0_4px_0_rgb(0_0_0/0.25)]">
                    Leçon suivante →
                  </Link>
                ) : (
                  <button type="button" onClick={onClose} className="rounded-2xl bg-gold px-8 py-4 font-semibold text-on-gold shadow-[0_4px_0_rgb(0_0_0/0.25)]">
                    Continuer
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
