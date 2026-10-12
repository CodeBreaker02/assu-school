"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGame } from "./gamification";
import { Kori } from "./mascot";
import { ease } from "./motion";
import { Flame } from "./quiz-session";

function Ring({ pct, size = 22 }: { pct: number; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="-rotate-90" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="var(--line-strong)" strokeWidth="3.5" />
      <motion.circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke={pct >= 1 ? "var(--mint)" : "var(--gold)"}
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: Math.max(0.001, pct) }}
        transition={{ duration: 0.8, ease }}
      />
    </svg>
  );
}

/** Streak, XP and daily goal at a glance; opens today's quests. */
export function GameBar() {
  const g = useGame();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Série ${g.streak} jours, ${g.totalXp} XP, objectif du jour ${Math.round(g.goalPct * 100)} %`}
        className="flex items-center gap-3 rounded-full border border-line-strong px-3 py-1.5 text-sm transition-colors hover:bg-cream/5"
      >
        <span className="flex items-center gap-1">
          <Flame lit={g.streak > 0} className="size-[18px]" />
          <span className={`font-mono tabular-nums ${g.streak > 0 ? "text-ember" : "text-muted"}`}>{g.streak}</span>
        </span>
        <span className="hidden items-center gap-1 sm:flex">
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
            <path d="M8 1 14 5v6l-6 4-6-4V5l6-4Z" fill="var(--gold)" />
            <path d="M8 1v14M2 5l12 6M14 5 2 11" stroke="rgb(0 0 0 / 0.15)" />
          </svg>
          <span className="font-mono text-cream tabular-nums">{g.totalXp}</span>
        </span>
        <Ring pct={g.goalPct} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22, ease }}
            className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-1.5rem))] origin-top-right rounded-2xl border border-line-strong bg-ink-2/95 p-4 shadow-[0_24px_70px_-20px_rgb(0_0_0/0.6)] backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <Kori mood={g.goalPct >= 1 ? "party" : g.streak > 0 ? "happy" : "idle"} size={44} />
              <div>
                <div className="font-display text-xl leading-tight">
                  {g.streak > 0 ? `${g.streak} jour${g.streak > 1 ? "s" : ""} de série` : "Lancez votre série"}
                </div>
                <div className="text-sm text-cream/75">{g.today.xp > 0 ? "Revenez demain pour la prolonger." : "Une leçon ou un quiz aujourd'hui suffit."}</div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-line p-3">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-cream/85">Objectif du jour</span>
                <span className="font-mono tabular-nums">
                  {Math.min(g.today.xp, g.goal)}/{g.goal} XP
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-cream/10">
                <motion.div className={`h-full rounded-full ${g.goalPct >= 1 ? "bg-mint" : "bg-gold"}`} initial={{ width: 0 }} animate={{ width: `${g.goalPct * 100}%` }} transition={{ duration: 0.8, ease }} />
              </div>
            </div>

            <div className="mt-4 text-xs font-medium tracking-[0.12em] text-muted uppercase">Quêtes du jour</div>
            <ul className="mt-2 space-y-2">
              {g.quests.map((q) => {
                const ok = q.value >= q.target;
                return (
                  <li key={q.id} className="rounded-xl border border-line px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3 text-[15px]">
                      <span className={ok ? "text-mint" : "text-cream/90"}>
                        {ok && "✓ "}
                        {q.label}
                      </span>
                      <span className="font-mono text-xs text-muted tabular-nums">
                        {q.value}/{q.target}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream/10">
                      <motion.div className={`h-full rounded-full ${ok ? "bg-mint" : "bg-gold"}`} initial={{ width: 0 }} animate={{ width: `${(q.value / q.target) * 100}%` }} transition={{ duration: 0.7, ease }} />
                    </div>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/cours/revisions"
              onClick={() => setOpen(false)}
              className="mt-4 flex items-center justify-between rounded-xl bg-gold px-4 py-3 font-semibold text-on-gold"
            >
              Réviser maintenant
              <span className="rounded-full bg-black/15 px-2 py-0.5 font-mono text-xs">{g.due.length} à revoir</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
