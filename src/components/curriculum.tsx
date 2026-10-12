"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { chapters, totalLessons, totalMinutes, type LessonKind } from "@/lib/content";
import { Eyebrow, Reveal } from "./reveal";

const offsets = chapters.map((_, i) =>
  chapters.slice(0, i).reduce((n, c) => n + c.lessons.length, 0),
);

const fmt = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h} h ${String(m).padStart(2, "0")}` : `${m} min`;
};

function KindIcon({ kind }: { kind: LessonKind }) {
  const common = "size-3.5 fill-none stroke-current stroke-[1.6]";
  if (kind === "vidéo")
    return (
      <svg viewBox="0 0 16 16" className={common} aria-hidden>
        <rect x="1.5" y="3" width="13" height="10" rx="2.5" />
        <path d="M6.5 6v4l3.5-2z" className="fill-current stroke-none" />
      </svg>
    );
  if (kind === "simulateur")
    return (
      <svg viewBox="0 0 16 16" className={common} aria-hidden>
        <path d="M1.5 13.5 6 8l3 3 5.5-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg viewBox="0 0 16 16" className={common} aria-hidden>
      <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Curriculum() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="programme" className="relative mx-auto max-w-[1560px] px-5 py-24 sm:px-6 md:py-32">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>Le programme</Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(2.5rem,5.4vw,6rem)] leading-[1] tracking-[-0.015em]">
            {["Zéro", "Un", "Deux", "Trois", "Quatre", "Cinq", "Six", "Sept", "Huit", "Neuf"][chapters.length]} chapitres. <br />
            <em className="text-muted">De zéro à libre.</em>
          </h2>
          <p className="mt-6 max-w-sm text-lg text-muted">
            Une leçon courte par jour. Chaque chapitre finit par un plan d&apos;action.
          </p>

          <dl className="mt-10 grid max-w-sm grid-cols-3 overflow-hidden rounded-2xl border border-line">
            {[
              [String(totalLessons), "leçons"],
              [`${Math.round(totalMinutes / 60)} h`, "de contenu"],
              ["∞", "accès"],
            ].map(([v, l]) => (
              <div key={l} className="border-r border-line p-4 last:border-r-0">
                <dd className="font-display text-3xl">{v}</dd>
                <dt className="mt-1 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">{l}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap gap-4 font-mono text-[11px] text-muted">
            {(["vidéo", "simulateur", "exercice"] as const).map((k) => (
              <span key={k} className="inline-flex items-center gap-1.5 capitalize">
                <KindIcon kind={k} /> {k}
              </span>
            ))}
          </div>
        </Reveal>

        <ol className="border-t border-line">
          {chapters.map((c, ci) => {
            const isOpen = open === ci;
            const minutes = c.lessons.reduce((n, l) => n + l.minutes, 0);
            const start = offsets[ci];
            return (
              <motion.li
                key={c.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: ci * 0.04 }}
                className="border-b border-line transition-[background] duration-700"
                style={{
                  background: isOpen
                    ? `linear-gradient(135deg, color-mix(in oklab, ${c.accent} 9%, transparent), transparent 60%)`
                    : undefined,
                }}
              >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : ci)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-start gap-5 px-2 py-7 text-left sm:gap-8 sm:px-4"
                  >
                    <span
                      className="mt-1 font-mono text-sm transition-colors"
                      style={{ color: isOpen ? c.accent : "var(--faint)" }}
                    >
                      {c.number}
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-3xl leading-tight transition-transform duration-500 group-hover:translate-x-1 sm:text-4xl">
                        {c.title}
                      </span>
                      <span className="mt-2 block max-w-md text-sm text-muted">{c.tagline}</span>
                    </span>
                    <span className="hidden shrink-0 pt-2 text-right font-mono text-[11px] text-muted sm:block">
                      {c.lessons.length} leçons
                      <br />
                      {fmt(minutes)}
                    </span>
                    <span
                      className={`mt-1.5 grid size-8 shrink-0 place-items-center rounded-full border border-line-strong transition-all duration-500 ${
                        isOpen ? "rotate-45 border-transparent bg-cream text-ink" : "text-cream"
                      }`}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <ul className="pb-8 sm:pl-14">
                          {c.lessons.map((l, li) => (
                            <motion.li
                              key={l.title}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.08 + li * 0.035 }}
                              className="group/l flex items-center gap-4 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.035]"
                            >
                              <span className="w-6 font-mono text-[11px] text-faint tabular-nums">
                                {String(start + li + 1).padStart(2, "0")}
                              </span>
                              <span className="text-muted" style={{ color: l.free ? c.accent : undefined }}>
                                <KindIcon kind={l.kind} />
                              </span>
                              {l.slug ? (
                                <Link
                                  href={`/cours/${l.slug}`}
                                  className="flex-1 text-[15px] text-cream underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold hover:decoration-gold"
                                >
                                  {l.title}
                                </Link>
                              ) : (
                                <span className="flex-1 text-[15px] text-cream/90">{l.title}</span>
                              )}
                              {l.free && (
                                <span className="rounded-full bg-gold/15 px-2 py-0.5 font-mono text-[10px] tracking-wider text-gold uppercase">
                                  Gratuit
                                </span>
                              )}
                              <span className="font-mono text-[11px] text-faint tabular-nums">{l.minutes} min</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
