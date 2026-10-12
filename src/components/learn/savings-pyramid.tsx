"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ease } from "./motion";
import { useLessonProgress } from "./progress";

const floors = [
  { slug: "epargne-d-investissement", label: "Investissement", hint: "5 ans et plus", color: "var(--ember)", width: 62 },
  { slug: "epargne-d-objectif", label: "Objectif", hint: "Projets datés", color: "var(--gold)", width: 81 },
  { slug: "epargne-de-precaution", label: "Précaution", hint: "3 à 6 mois de dépenses", color: "var(--mint)", width: 100 },
];

/** The three kinds of savings, built bottom-up: each floor links to its lesson. */
export function SavingsPyramid() {
  const done = useLessonProgress();
  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-ink-2 p-6 sm:p-8">
      <div className="font-mono text-xs tracking-[0.2em] text-gold uppercase">La méthode</div>
      <h2 className="mt-2 font-display text-2xl leading-tight sm:text-3xl">Les 3 épargnes</h2>
      <p className="mt-2 max-w-sm text-sm text-muted">On construit de bas en haut. Jamais l&apos;étage du dessus avant celui du dessous.</p>

      <motion.ol
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18, staggerDirection: -1 } } }}
        className="mt-8 flex flex-col items-center gap-2"
      >
        {floors.map((f, i) => {
          const isDone = done.has(f.slug);
          return (
            <motion.li
              key={f.slug}
              variants={{ hidden: { opacity: 0, y: 30, scaleX: 0.6 }, show: { opacity: 1, y: 0, scaleX: 1, transition: { duration: 0.7, ease } } }}
              style={{ width: `${f.width}%` }}
            >
              <Link
                href={`/cours/${f.slug}`}
                prefetch
                className="group relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl px-4 py-3.5 transition-transform duration-300 hover:-translate-y-0.5"
                style={{
                  background: `color-mix(in oklab, ${f.color} ${isDone ? 30 : 14}%, transparent)`,
                  boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${f.color} 40%, transparent)`,
                }}
              >
                <span className="min-w-0">
                  <span className="block font-mono text-xs tracking-[0.18em] uppercase" style={{ color: f.color }}>
                    Étage {3 - i}
                  </span>
                  <span className="block truncate font-display text-base sm:text-lg">{f.label}</span>
                </span>
                {i > 0 && <span className="hidden shrink-0 text-right font-mono text-xs text-muted sm:block">{f.hint}</span>}
                {isDone && (
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-mint text-ink">
                    <svg viewBox="0 0 16 16" className="size-3 fill-none stroke-current stroke-[2.5]" strokeLinecap="round" aria-hidden>
                      <path d="M3 8.5 6.5 12 13 4.5" />
                    </svg>
                  </span>
                )}
              </Link>
            </motion.li>
          );
        })}
      </motion.ol>
    </div>
  );
}
