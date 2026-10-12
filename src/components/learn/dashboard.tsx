"use client";

import { MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { chapters, courseLessons, totalLessons, type Lesson } from "@/lib/content";
import { Donut } from "./charts";
import { LearnHeader } from "./learn-header";
import { AnimatedNumber, InView, ease, stagger } from "./motion";
import { useLessonProgress } from "./progress";
import { SavingsPyramid } from "./savings-pyramid";

function LessonRow({ lesson, done }: { lesson: Lesson; done: boolean }) {
  const content = (
    <>
      <span
        className={`grid size-6 shrink-0 place-items-center rounded-full text-xs ${
          done
            ? "bg-mint text-ink"
            : lesson.slug
              ? "border border-gold text-gold transition-colors group-hover:bg-gold group-hover:text-on-gold"
              : "border border-dashed border-line-strong text-muted"
        }`}
      >
        {done ? (
          <svg viewBox="0 0 16 16" className="size-3 fill-none stroke-current stroke-[2.5]" strokeLinecap="round" aria-hidden>
            <path d="M3 8.5 6.5 12 13 4.5" />
          </svg>
        ) : lesson.slug ? (
          "▶"
        ) : null}
      </span>
      <span className={`flex-1 text-sm leading-snug ${lesson.slug ? "text-cream" : "text-muted"}`}>{lesson.title}</span>
      {lesson.slug ? (
        <span className="font-mono text-xs text-muted tabular-nums">{lesson.minutes} min</span>
      ) : lesson.free ? (
        <span className="rounded-full border border-line px-2 py-0.5 font-mono text-xs tracking-wider text-muted uppercase">Bientôt</span>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 font-mono text-xs tracking-wider text-gold uppercase">
          <svg viewBox="0 0 16 16" className="size-2.5 fill-none stroke-current stroke-2" aria-hidden>
            <rect x="3" y="7" width="10" height="7" rx="1.5" />
            <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
          </svg>
          Premium
        </span>
      )}
    </>
  );
  return lesson.slug ? (
    <Link href={`/cours/${lesson.slug}`} prefetch className="group -mx-3 flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-cream/5">
      {content}
    </Link>
  ) : (
    <div className="-mx-3 flex items-center gap-3 px-3 py-2.5">{content}</div>
  );
}

export function Dashboard() {
  const done = useLessonProgress();
  const completed = courseLessons.filter((l) => done.has(l.slug)).length;
  const next = courseLessons.find((l) => !done.has(l.slug));
  const pct = (completed / courseLessons.length) * 100;

  return (
    <MotionConfig reducedMotion="user">
      <LearnHeader />
      <main className="mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="flex flex-col justify-between gap-10 rounded-3xl border border-line bg-ink-2 p-6 sm:p-8">
            <div>
              <div className="font-mono text-xs tracking-[0.2em] text-muted uppercase">Mon parcours</div>
              <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.02]">
                {completed === 0 ? "Bienvenue." : "Bon retour."}
                <br />
                <span className="text-muted">Une leçon à la fois.</span>
              </h1>
            </div>

            {next ? (
              <Link
                href={`/cours/${next.slug}`}
                prefetch
                className="group relative overflow-hidden rounded-2xl bg-gold p-5 text-on-gold transition-transform hover:-translate-y-0.5 sm:p-6"
              >
                <motion.div
                  className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-white/25 blur-2xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                <div className="relative flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-mono text-xs tracking-[0.2em] uppercase opacity-70">
                      {completed === 0 ? "Commencer" : "Reprendre"} · Chapitre {next.chapter.number}
                    </div>
                    <div className="mt-1 font-display text-xl leading-tight sm:text-2xl">{next.title}</div>
                    <div className="mt-1 font-mono text-xs opacity-70">{next.minutes} min · {next.kind}</div>
                  </div>
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#0a0907] text-[#f6d58e] transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ) : (
              <div className="rounded-2xl bg-mint/15 p-6 font-display text-xl text-mint">Toutes les leçons disponibles sont terminées. Bravo !</div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.1 }} className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-line bg-ink-2 p-6 sm:flex-row lg:flex-col">
            <Donut
              size={180}
              thickness={14}
              segments={[
                { label: "Terminées", value: completed, color: "var(--gold)" },
                { label: "Restantes", value: courseLessons.length - completed, color: "transparent" },
              ]}
            >
              <AnimatedNumber value={pct} format={(v) => `${Math.round(v)} %`} className="font-display text-4xl" />
              <div className="font-mono text-xs tracking-[0.18em] text-muted uppercase">complété</div>
            </Donut>
            <dl className="grid w-full max-w-xs grid-cols-3 gap-2 text-center">
              {[
                [completed, "terminées"],
                [courseLessons.length, "disponibles"],
                [totalLessons, "au total"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl border border-line p-2.5">
                  <dd className="font-display text-xl">
                    <AnimatedNumber value={Number(v)} />
                  </dd>
                  <dt className="font-mono text-xs tracking-wider text-muted uppercase">{l}</dt>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.5fr]">
          <InView>
            <SavingsPyramid />
          </InView>
          <InView delay={0.08} className="relative overflow-hidden rounded-3xl border border-line bg-ink-2 p-6 sm:p-8">
            <div className="font-mono text-xs tracking-[0.2em] text-gold uppercase">Par où commencer ?</div>
            <h2 className="mt-2 font-display text-2xl leading-tight sm:text-3xl">Le parcours conseillé</h2>
            <motion.ol {...stagger.parent} className="mt-6 space-y-2">
              {courseLessons.map((l, i) => (
                <motion.li key={l.slug} variants={stagger.child}>
                  <Link href={`/cours/${l.slug}`} prefetch className="group flex items-center gap-4 rounded-2xl border border-line p-4 transition-colors hover:border-gold/50 hover:bg-gold/5">
                    <span className="font-display text-2xl text-muted transition-colors group-hover:text-gold">{i + 1}</span>
                    <span className="flex-1">
                      <span className="block text-cream">{l.title}</span>
                      <span className="font-mono text-xs text-muted">
                        Chapitre {l.chapter.number} · {l.minutes} min · {l.kind}
                      </span>
                    </span>
                    {done.has(l.slug) ? (
                      <span className="rounded-full bg-mint/15 px-2 py-0.5 font-mono text-xs text-mint uppercase">Fait</span>
                    ) : (
                      <span className="text-muted transition-transform group-hover:translate-x-1">→</span>
                    )}
                  </Link>
                </motion.li>
              ))}
            </motion.ol>
          </InView>
        </div>

        <InView className="mt-20">
          <h2 className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-none">Tous les chapitres</h2>
          <p className="mt-3 text-muted">Les leçons gratuites s&apos;ouvrent au fil des semaines. Le Premium débloque tout.</p>
        </InView>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {chapters.map((c, ci) => {
            const doneHere = c.lessons.filter((l) => l.slug && done.has(l.slug)).length;
            return (
              <InView key={c.number} delay={(ci % 2) * 0.08} className="rounded-3xl border border-line bg-ink-2 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: c.accent }}>
                      Chapitre {c.number}
                    </div>
                    <h3 className="mt-1 font-display text-2xl leading-tight">{c.title}</h3>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-muted tabular-nums">
                    {doneHere}/{c.lessons.length}
                  </span>
                </div>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-cream/10">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: c.accent }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(doneHere / c.lessons.length) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease }}
                  />
                </div>
                <motion.div {...stagger.parent} className="mt-4">
                  {c.lessons.map((l) => (
                    <motion.div key={l.title} variants={stagger.child}>
                      <LessonRow lesson={l} done={!!l.slug && done.has(l.slug)} />
                    </motion.div>
                  ))}
                </motion.div>
              </InView>
            );
          })}
        </div>
      </main>
    </MotionConfig>
  );
}
