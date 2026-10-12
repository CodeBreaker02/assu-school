"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { AnimatedNumber, ease } from "@/components/learn/motion";
import { useLessonProgress } from "@/components/learn/progress";
import { allLessons } from "@/lib/content";
import { useGame } from "@/components/learn/gamification";
import { badges, certificates, chapterStats, minutesLearned, nextLesson } from "./data";
import { displayName, useProfile } from "./store";
import { Card, PageHead, Ring } from "./ui";

const ink = (accent: string) => `color-mix(in oklab, ${accent} 65%, var(--cream))`;

function Stat({ label, value, suffix, delay, accent }: { label: string; value: number; suffix?: string; delay: number; accent?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease, delay }}
      className="rounded-3xl border border-line bg-ink-2 p-5"
    >
      <div className="text-sm text-cream/75">{label}</div>
      <div className="mt-2 font-display text-4xl leading-none" style={accent ? { color: accent } : undefined}>
        <AnimatedNumber value={value} />
        {suffix && <span className="ml-1 text-xl text-muted">{suffix}</span>}
      </div>
    </motion.div>
  );
}

export function Progression() {
  const done = useLessonProgress();
  const profile = useProfile();
  const completed = allLessons.filter((l) => done.has(l.slug)).length;
  const minutes = minutesLearned(done);
  const next = nextLesson(done);
  const stats = chapterStats(done);
  const earned = certificates(done).filter((c) => c.unlocked).length;
  const g = useGame();
  const heat = g.activity;
  const recent = allLessons.filter((l) => done.has(l.slug)).slice(-4).reverse();
  const goalPct = g.goalPct;

  return (
    <>
      <PageHead title={`Bonjour, ${displayName(profile)}.`} text="Votre progression dans l'école de l'argent, une leçon après l'autre." />

      {/* Hero: ring + resume */}
      <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-gold/15 blur-3xl" />
          <div className="relative flex flex-col items-center gap-8 sm:flex-row">
            <Ring value={completed / allLessons.length} size={180} stroke={14}>
              <div className="font-display text-5xl leading-none">
                <AnimatedNumber value={Math.round((completed / allLessons.length) * 100)} />
                <span className="text-2xl text-muted">%</span>
              </div>
              <div className="mt-1 text-sm text-cream/75">du parcours</div>
            </Ring>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="text-sm text-cream/75">
                {completed} leçon{completed > 1 ? "s" : ""} terminée{completed > 1 ? "s" : ""} sur {allLessons.length}
              </div>
              {next ? (
                <>
                  <div className="mt-3 text-xs tracking-[0.14em] text-muted uppercase">À suivre</div>
                  <div className="mt-1 font-display text-2xl leading-tight">{next.title}</div>
                  <div className="mt-1 text-[15px] text-cream/75">
                    Chapitre {next.chapter.number} · {next.minutes} min
                  </div>
                  <Link
                    href={`/cours/${next.slug}`}
                    className="group mt-5 inline-flex items-center gap-3 rounded-full bg-gold py-3 pr-3 pl-5 font-medium text-on-gold transition-transform active:scale-[0.98]"
                  >
                    {completed ? "Reprendre" : "Commencer"}
                    <span className="grid size-7 place-items-center rounded-full bg-ink text-gold transition-transform group-hover:translate-x-0.5">→</span>
                  </Link>
                </>
              ) : (
                <div className="mt-3 font-display text-2xl">Toutes les leçons disponibles sont terminées. Bravo.</div>
              )}
            </div>
          </div>
        </Card>

        <Card title="Objectif du jour" text={`${profile.goal} minutes par jour, rappel à ${profile.reminder}.`} delay={0.08} action={<Link href="/compte/parametres" className="text-sm text-gold hover:underline">Modifier</Link>}>
          <div className="flex items-center gap-6">
            <Ring value={goalPct} size={112} stroke={10} color="var(--mint)">
              <div className="font-display text-2xl leading-none">{goalPct ? "✓" : `0/${profile.goal}`}</div>
            </Ring>
            <p className="text-[15px] leading-relaxed text-cream/85">
              {goalPct
                ? "Une leçon terminée : votre objectif est atteint. Gardez le rythme."
                : "Une leçon courte suffit pour atteindre votre objectif aujourd'hui."}
            </p>
          </div>
        </Card>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Leçons terminées" value={completed} delay={0.1} />
        <Stat label="Temps d'apprentissage" value={minutes} suffix="min" delay={0.15} />
        <Stat label="Série en cours" value={g.streak} suffix={g.streak > 1 ? "jours" : "jour"} delay={0.2} accent="var(--ember)" />
        <Stat label="Certificats" value={earned} delay={0.25} accent="var(--gold)" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        {/* Chapters */}
        <Card title="Par chapitre" delay={0.1}>
          <ul className="space-y-4">
            {stats.map((s, i) => (
              <li key={s.chapter.number}>
                <div className="flex items-center gap-3">
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-xl font-mono text-[13px]"
                    style={{ background: `color-mix(in oklab, ${s.chapter.accent} 16%, transparent)`, color: ink(s.chapter.accent) }}
                  >
                    {s.chapter.number}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[15px] text-cream">{s.chapter.title}</span>
                  <span className="font-mono text-sm text-cream/80 tabular-nums">
                    {s.done}/{s.total}
                  </span>
                </div>
                <div className="mt-2 ml-12 h-2 overflow-hidden rounded-full bg-cream/10">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: s.chapter.accent }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.done / s.total) * 100}%` }}
                    transition={{ duration: 1, ease, delay: 0.2 + i * 0.06 }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Activity */}
        <Card title="Activité" text={`12 dernières semaines · ${g.totalXp} XP au total.`} delay={0.15}>
          <div className="grid grid-flow-col grid-rows-7 gap-1.5" aria-label="Carte d'activité">
            {heat.map((v, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.006 }}
                className="aspect-square rounded-[4px]"
                style={{ background: v ? `color-mix(in oklab, var(--gold) ${20 + v * 20}%, transparent)` : "var(--line)" }}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted">
            Moins
            {[0, 1, 2, 3, 4].map((v) => (
              <span key={v} className="size-3 rounded-[3px]" style={{ background: v ? `color-mix(in oklab, var(--gold) ${20 + v * 20}%, transparent)` : "var(--line)" }} />
            ))}
            Plus
          </div>
          {!completed && <p className="mt-4 text-[15px] text-cream/80">Terminez votre première leçon pour allumer la carte.</p>}
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card title="Badges" text={`${badges(done).filter((b) => b.earned).length} sur ${badges(done).length} obtenus.`} delay={0.1}>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {badges(done).map((b, i) => (
              <motion.li
                key={b.id}
                initial={{ opacity: 0, y: 14, rotate: -4 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.2 + i * 0.05 }}
                whileHover={b.earned ? { y: -4, rotate: -2 } : undefined}
                className={`rounded-2xl border p-4 text-center ${b.earned ? "border-line-strong bg-ink" : "border-dashed border-line-strong"}`}
              >
                <span
                  className="mx-auto grid size-12 place-items-center rounded-full"
                  style={{ background: b.earned ? `color-mix(in oklab, ${b.color} 25%, transparent)` : "var(--line)" }}
                >
                  <svg viewBox="0 0 24 24" className="size-6 fill-none stroke-[1.8]" style={{ stroke: b.earned ? b.color : "var(--muted)" }} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {b.earned ? <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4l-5.2 2.7 1-5.8L3.5 9.2l5.9-.9z" /> : <path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z" />}
                  </svg>
                </span>
                <div className={`mt-3 text-[15px] font-medium ${b.earned ? "text-cream" : "text-cream/70"}`}>{b.title}</div>
                <div className="mt-0.5 text-[13px] text-muted">{b.text}</div>
              </motion.li>
            ))}
          </ul>
        </Card>

        <Card title="Terminées récemment" delay={0.15}>
          {recent.length ? (
            <ul className="divide-y divide-line">
              {recent.map((l) => (
                <li key={l.slug}>
                  <Link href={`/cours/${l.slug}`} className="group flex items-center gap-3 py-3">
                    <span className="grid size-6 place-items-center rounded-full bg-mint text-[#0a0907]">
                      <svg viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M3 8.5 6.5 12 13 4.5" />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[15px] text-cream group-hover:text-gold">{l.title}</span>
                    <span className="text-sm text-muted">{l.minutes} min</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[15px] text-cream/80">Aucune leçon terminée pour l&apos;instant.</p>
          )}
        </Card>
      </div>
    </>
  );
}
