"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { RichText } from "./blocks";
import { CoinBurst } from "./charts";
import { InView } from "./motion";

/* ───────────────────────── Timeline ───────────────────────── */

/** Vertical timeline whose spine draws itself as the reader scrolls through it. */
export function Timeline({ items }: { items: { when: string; title: string; text: string }[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative my-10 ml-2 pl-10">
      <span className="absolute top-2 bottom-2 left-[7px] w-px bg-line-strong" aria-hidden />
      <motion.span
        className="absolute top-2 bottom-2 left-[7px] w-[2px] origin-top rounded-full bg-gold"
        style={{ scaleY }}
        aria-hidden
      />
      {items.map((it, i) => (
        <li key={it.title} className="relative pb-10 last:pb-0">
          <motion.span
            className="absolute top-1.5 -left-10 grid size-4 place-items-center rounded-full border-2 border-gold bg-ink"
            initial={{ scale: 0.4, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-35% 0px" }}
            transition={{ type: "spring", stiffness: 300, damping: 16 }}
            aria-hidden
          >
            <motion.span
              className="size-1.5 rounded-full bg-gold"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-35% 0px" }}
              transition={{ delay: 0.15 }}
            />
          </motion.span>
          <InView delay={i * 0.02} y={18}>
            <div className="font-mono text-xs tracking-[0.14em] text-gold uppercase">{it.when}</div>
            <h3 className="mt-1.5 font-display text-2xl leading-tight">{it.title}</h3>
            <p className="mt-2 max-w-xl text-[17px] leading-relaxed text-cream/85">
              <RichText text={it.text} />
            </p>
          </InView>
        </li>
      ))}
    </ol>
  );
}

/* ───────────────────────── Myths ───────────────────────── */

function MythCard({ myth, truth, index }: { myth: string; truth: string; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const face = "[grid-area:1/1] flex flex-col rounded-3xl border p-6 backface-hidden";

  return (
    <InView delay={index * 0.07} className="[perspective:1200px]">
      <motion.button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={flipped ? `Réalité : ${truth}` : `Idée reçue : ${myth}. Retourner la carte`}
        className="grid w-full text-left transform-3d"
        animate={{ rotateY: flipped ? 180 : 0 }}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
      >
        <span className={`${face} border-line-strong bg-ink-2`}>
          <span className="font-mono text-xs tracking-[0.16em] text-ember uppercase">Idée reçue</span>
          <span className="mt-3 font-display text-[1.45rem] leading-snug">« {myth} »</span>
          <span className="mt-auto flex items-center gap-2 pt-6 text-sm text-muted">
            <motion.span
              animate={{ rotate: [0, 180, 180, 360] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
              aria-hidden
            >
              ↻
            </motion.span>
            Touchez pour voir la réalité
          </span>
        </span>
        <span
          className={`${face} border-mint/40 bg-[linear-gradient(140deg,color-mix(in_oklab,var(--mint)_14%,var(--ink-2)),var(--ink-2))] [transform:rotateY(180deg)]`}
        >
          <span className="font-mono text-xs tracking-[0.16em] text-mint uppercase">Réalité</span>
          <span className="mt-3 text-[17px] leading-relaxed text-cream">{truth}</span>
        </span>
      </motion.button>
    </InView>
  );
}

export function Myths({ items }: { items: { myth: string; truth: string }[] }) {
  return (
    <div className="my-8 grid gap-4 sm:grid-cols-2">
      {items.map((m, i) => (
        <MythCard key={m.myth} {...m} index={i} />
      ))}
    </div>
  );
}

/* ───────────────────────── Sort exercise ───────────────────────── */

type SortItem = { label: string; bin: 0 | 1; why: string };

/** One card at a time: pick a side, get instant feedback, finish with a score. */
export function SortExercise({
  prompt,
  bins,
  items,
}: {
  prompt: string;
  bins: [string, string];
  items: SortItem[];
}) {
  const [answers, setAnswers] = useState<(0 | 1)[]>([]);
  const [feedback, setFeedback] = useState<{ ok: boolean; why: string } | null>(null);
  const [burst, setBurst] = useState(0);
  const i = answers.length;
  const done = i >= items.length;
  const current = items[i];
  const score = answers.filter((a, k) => a === items[k].bin).length;
  const colors = ["var(--mint)", "var(--ember)"] as const;

  const pick = (bin: 0 | 1) => {
    if (feedback || done) return;
    const ok = bin === current.bin;
    setFeedback({ ok, why: current.why });
    setTimeout(
      () => {
        // `feedback` blocks further picks, so `answers` can't change before this fires.
        const next = [...answers, bin];
        setFeedback(null);
        setAnswers(next);
        if (next.length === items.length && next.filter((x, k) => x === items[k].bin).length >= items.length - 2) {
          setBurst((b) => b + 1);
        }
      },
      ok ? 1100 : 2200,
    );
  };

  const reset = () => {
    setAnswers([]);
    setFeedback(null);
  };

  return (
    <InView className="my-10">
      <div className="overflow-hidden rounded-3xl border border-line bg-ink-2">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <span className="text-[15px] text-cream/90">{prompt}</span>
          <span className="shrink-0 font-mono text-sm text-muted tabular-nums">
            {Math.min(i + 1, items.length)}/{items.length}
          </span>
        </div>

        {/* progress */}
        <div className="flex gap-1 px-5 pt-4 sm:px-6">
          {items.map((it, k) => (
            <span
              key={it.label}
              className="h-1.5 flex-1 rounded-full transition-colors duration-500"
              style={{
                background:
                  k < answers.length
                    ? answers[k] === it.bin
                      ? "var(--mint)"
                      : "var(--ember)"
                    : k === i
                      ? "var(--gold)"
                      : "var(--line-strong)",
              }}
            />
          ))}
        </div>

        <div className="relative grid min-h-[17rem] place-items-center px-5 py-8 sm:px-6">
          <AnimatePresence mode="wait" custom={answers[answers.length - 1]}>
            {!done ? (
              <motion.div
                key={current.label}
                custom={answers[answers.length - 1]}
                initial={{ opacity: 0, y: 30, scale: 0.92, rotate: -2 }}
                animate={
                  feedback && !feedback.ok
                    ? { opacity: 1, y: 0, scale: 1, rotate: 0, x: [0, -10, 10, -6, 6, 0] }
                    : { opacity: 1, y: 0, scale: 1, rotate: 0, x: 0 }
                }
                exit={{ opacity: 0, x: answers[answers.length - 1] === 0 ? -160 : 160, rotate: answers[answers.length - 1] === 0 ? -8 : 8, transition: { duration: 0.35 } }}
                transition={{ type: "spring", stiffness: 220, damping: 20, x: { type: "tween", duration: 0.45 } }}
                className="w-full max-w-md text-center"
              >
                <div
                  className="rounded-2xl border px-6 py-7 transition-colors duration-300"
                  style={{
                    borderColor: feedback ? (feedback.ok ? "var(--mint)" : "var(--ember)") : "var(--line-strong)",
                    background: feedback
                      ? `color-mix(in oklab, ${feedback.ok ? "var(--mint)" : "var(--ember)"} 10%, var(--ink))`
                      : "var(--ink)",
                  }}
                >
                  <div className="font-display text-2xl leading-snug">{current.label}</div>
                  <AnimatePresence>
                    {feedback && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="overflow-hidden text-[15px] leading-relaxed text-cream/85"
                      >
                        <span className="block pt-3">
                          <span className="font-semibold" style={{ color: feedback.ok ? "var(--mint)" : "var(--ember)" }}>
                            {feedback.ok ? "Exact. " : `Non : c'est un ${bins[current.bin].toLowerCase()}. `}
                          </span>
                          {feedback.why}
                        </span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {bins.map((b, k) => (
                    <motion.button
                      key={b}
                      type="button"
                      disabled={!!feedback}
                      onClick={() => pick(k as 0 | 1)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 rounded-full border border-line-strong py-3.5 text-base font-medium transition-colors hover:bg-cream/5 disabled:opacity-50"
                    >
                      <span className="size-2.5 rounded-full" style={{ background: colors[k] }} />
                      {b}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="score"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="relative text-center"
              >
                <CoinBurst trigger={burst} count={24} />
                <div className="font-mono text-xs tracking-[0.16em] text-muted uppercase">Votre score</div>
                <div className="mt-2 font-display text-6xl">
                  {score}
                  <span className="text-muted">/{items.length}</span>
                </div>
                <p className="mt-3 text-[16px] text-cream/85">
                  {score === items.length
                    ? "Parfait. Vous avez l'œil."
                    : score >= items.length - 2
                      ? "Très bien. Relisez les explications des erreurs."
                      : "Relisez la définition, puis réessayez."}
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-5 rounded-full border border-line-strong px-5 py-2.5 text-sm hover:bg-cream/5"
                >
                  Recommencer ↺
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* bins collecting the answered cards */}
        <div className="grid grid-cols-2 border-t border-line">
          {bins.map((b, k) => (
            <div key={b} className="border-r border-line p-4 last:border-r-0 sm:p-5">
              <div className="flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-muted uppercase">
                <span className="size-2 rounded-full" style={{ background: colors[k] }} />
                {b}
              </div>
              <motion.ul layout className="mt-3 flex flex-wrap gap-1.5">
                <AnimatePresence>
                  {answers.flatMap((a, n) =>
                    a === k
                      ? [
                          <motion.li
                            key={items[n].label}
                            layout
                            initial={{ opacity: 0, scale: 0.6, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="rounded-full border px-2.5 py-1 text-[13px]"
                            style={{
                              borderColor: a === items[n].bin ? "color-mix(in oklab, var(--mint) 50%, transparent)" : "color-mix(in oklab, var(--ember) 60%, transparent)",
                              color: a === items[n].bin ? "var(--cream)" : "var(--ember)",
                            }}
                          >
                            {items[n].label}
                          </motion.li>,
                        ]
                      : [],
                  )}
                </AnimatePresence>
              </motion.ul>
            </div>
          ))}
        </div>
      </div>
    </InView>
  );
}

