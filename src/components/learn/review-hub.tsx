"use client";

import { MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { allLessons } from "@/lib/content";
import { findQuestion, getQuestions } from "@/lib/questions";
import { BOX_INTERVALS, useGame } from "./gamification";
import { LearnHeader } from "./learn-header";
import { Kori } from "./mascot";
import { AnimatedNumber, InView, ease } from "./motion";
import { useLessonProgress } from "./progress";
import { QuizSession, type QuizItem } from "./quiz-session";

const boxLabel = (b: number) => (b === 0 ? "À revoir" : b === BOX_INTERVALS.length - 1 ? "Maîtrisé" : `J+${BOX_INTERVALS[b]}`);
const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

export function ReviewHub() {
  const g = useGame();
  const done = useLessonProgress();
  const [session, setSession] = useState<QuizItem[] | null>(null);
  const items = Object.values(g.state.srs);

  const boxes = BOX_INTERVALS.map((_, b) => items.filter((i) => i.box === b).length);
  const max = Math.max(1, ...boxes);
  const mastered = items.filter((i) => i.box >= 4).length;

  const weak = useMemo(() => {
    const byLesson = new Map<string, number>();
    for (const i of items) if (i.box <= 1) byLesson.set(i.lesson, (byLesson.get(i.lesson) ?? 0) + 1);
    return [...byLesson.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .flatMap(([slug, n]) => {
        const l = allLessons.find((x) => x.slug === slug);
        return l ? [{ l, n }] : [];
      });
  }, [items]);

  const startDue = () => {
    const due: QuizItem[] = shuffle(g.due).flatMap((i) => {
      const q = findQuestion(i.lesson, i.id);
      return q ? [{ lesson: i.lesson, q }] : [];
    });
    setSession(due.slice(0, 12));
  };

  const startFree = () => {
    const pool = allLessons.filter((l) => l.ready && (done.has(l.slug) || done.size === 0));
    const qs: QuizItem[] = shuffle(pool.flatMap((l) => getQuestions(l.slug).map((q) => ({ lesson: l.slug, q }))));
    setSession(qs.slice(0, 8));
  };

  return (
    <MotionConfig reducedMotion="user">
      <LearnHeader />
      <main className="mx-auto max-w-[1240px] px-5 pt-24 pb-24 sm:px-8 lg:px-12">
        <InView className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-5">
            <Kori mood={g.due.length ? "think" : "happy"} size={84} />
            <div>
              <div className="text-sm font-medium text-gold">Répétition espacée</div>
              <h1 className="font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-none">Révisions</h1>
              <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-cream/85">
                Chaque question revient juste avant que vous l&apos;oubliiez : le lendemain, puis à 3, 7, 16 et 35 jours. Une erreur la renvoie au début.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button
              type="button"
              onClick={startDue}
              disabled={g.due.length === 0}
              whileTap={{ scale: 0.96 }}
              className="rounded-2xl bg-gold px-7 py-4 font-semibold text-on-gold shadow-[0_4px_0_rgb(0_0_0/0.25)] disabled:opacity-40 disabled:shadow-none"
            >
              Réviser {g.due.length > 0 ? `${Math.min(12, g.due.length)} question${g.due.length > 1 ? "s" : ""}` : ""}
            </motion.button>
            <button type="button" onClick={startFree} className="rounded-2xl border-2 border-line-strong px-6 py-4 font-semibold hover:bg-cream/5">
              Pratique libre
            </button>
          </div>
        </InView>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { label: "À revoir aujourd'hui", v: g.due.length, tone: g.due.length ? "text-ember" : "text-mint" },
            { label: "Questions en mémoire", v: items.length, tone: "text-cream" },
            { label: "Maîtrisées", v: mastered, tone: "text-mint" },
          ].map((s, i) => (
            <InView key={s.label} delay={i * 0.06} className="rounded-3xl border border-line bg-ink-2 p-6">
              <div className="text-sm text-cream/75">{s.label}</div>
              <AnimatedNumber value={s.v} className={`mt-1 block font-display text-5xl ${s.tone}`} />
            </InView>
          ))}
        </div>

        <InView className="mt-6 rounded-3xl border border-line bg-ink-2 p-6 sm:p-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl">Vos boîtes de mémoire</h2>
            <span className="text-sm text-muted">Une bonne réponse fait avancer la question d&apos;une boîte</span>
          </div>
          <div className="mt-8 grid h-56 grid-cols-6 items-end gap-3 sm:gap-5">
            {boxes.map((n, b) => (
              <div key={b} className="flex h-full flex-col items-center justify-end gap-2">
                <span className="font-mono text-sm tabular-nums">{n}</span>
                <motion.div
                  className="w-full rounded-t-2xl"
                  style={{ background: b === 0 ? "var(--ember)" : b >= 4 ? "var(--mint)" : "var(--gold)", opacity: 0.35 + (b / 5) * 0.65 }}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${Math.max(4, (n / max) * 100)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease, delay: b * 0.07 }}
                />
                <span className="text-center text-[13px] text-cream/80">{boxLabel(b)}</span>
              </div>
            ))}
          </div>
          {items.length === 0 && (
            <p className="mt-6 text-center text-[16px] text-cream/80">
              Vos boîtes sont vides : faites le quiz d&apos;une leçon, chaque réponse y entre.{" "}
              <Link href="/cours" className="text-gold underline underline-offset-4">
                Commencer une leçon
              </Link>
            </p>
          )}
        </InView>

        {weak.length > 0 && (
          <InView className="mt-6">
            <h2 className="font-display text-2xl">Leçons à consolider</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {weak.map(({ l, n }) => (
                <Link key={l.slug} href={`/cours/${l.slug}`} className="group flex items-center gap-4 rounded-2xl border border-line bg-ink-2 p-4 hover:border-line-strong">
                  <span className="grid size-10 place-items-center rounded-xl bg-ember/15 font-mono text-sm text-ember">{n}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-medium">{l.title}</span>
                    <span className="text-sm text-muted">
                      Chapitre {l.chapter.number} · {n} question{n > 1 ? "s" : ""} fragile{n > 1 ? "s" : ""}
                    </span>
                  </span>
                  <span className="text-muted transition-transform group-hover:translate-x-1">→</span>
                </Link>
              ))}
            </div>
          </InView>
        )}
      </main>

      <QuizSession open={!!session && session.length > 0} onClose={() => setSession(null)} items={session ?? []} title="Révision" mode="review" />
    </MotionConfig>
  );
}
