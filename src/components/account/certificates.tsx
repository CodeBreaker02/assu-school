"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";
import { useLessonProgress } from "@/components/learn/progress";
import { CauriMark } from "@/components/logo";
import { certificates, formatDate } from "./data";
import { recordCertificates, useCertificateDates } from "./store";
import { PageHead } from "./ui";

const ink = (accent: string) => `color-mix(in oklab, ${accent} 65%, var(--cream))`;

export function Certificates() {
  const done = useLessonProgress();
  const dates = useCertificateDates();
  const list = certificates(done);
  const earnedIds = list.filter((c) => c.unlocked).map((c) => c.id).join(",");

  // Remember when each certificate was first earned.
  useEffect(() => {
    if (earnedIds) recordCertificates(earnedIds.split(","));
  }, [earnedIds]);

  const earned = list.filter((c) => c.unlocked).length;

  return (
    <>
      <PageHead
        title="Certificats"
        text="Un certificat par chapitre terminé, et un certificat final pour tout le parcours. Chacun porte un code de vérification."
      >
        <span className="rounded-full border border-line-strong px-4 py-2 text-sm text-cream/85">
          {earned} sur {list.length} obtenus
        </span>
      </PageHead>

      <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {list.map((c, i) => {
          const accent = c.chapter?.accent ?? "#e9b44c";
          const isFinal = c.id === "final";
          const body = (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
              whileHover={c.unlocked ? { y: -6 } : undefined}
              className={`group relative h-full overflow-hidden rounded-3xl border p-6 ${
                c.unlocked ? "border-gold/40 bg-ink-2" : "border-line bg-ink-2/60"
              } ${isFinal ? "md:col-span-2 2xl:col-span-1" : ""}`}
            >
              {c.unlocked && (
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgb(246_213_142/0.18)_50%,transparent_70%)]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                />
              )}
              <div className="relative flex items-start justify-between gap-4">
                <span
                  className="grid size-12 place-items-center rounded-2xl font-mono text-sm"
                  style={{ background: `color-mix(in oklab, ${accent} 18%, transparent)`, color: ink(accent) }}
                >
                  {isFinal ? <CauriMark className="h-6 w-5" /> : c.id}
                </span>
                {c.unlocked ? (
                  <span className="rounded-full bg-mint/15 px-3 py-1 text-xs text-mint">Obtenu</span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cream/10 px-3 py-1 text-xs text-cream/80">
                    <svg viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current stroke-[1.6]" aria-hidden>
                      <rect x="3" y="7" width="10" height="7" rx="1.5" />
                      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
                    </svg>
                    Verrouillé
                  </span>
                )}
              </div>
              <div className="relative mt-5 text-sm text-cream/75">{c.subtitle}</div>
              <div className="relative mt-1 font-display text-2xl leading-tight">{c.title}</div>
              {c.unlocked ? (
                <div className="relative mt-5 flex items-center justify-between text-[15px]">
                  <span className="text-cream/80">{dates[c.id] ? `Obtenu le ${formatDate(dates[c.id])}` : "Obtenu"}</span>
                  <span className="text-gold transition-transform group-hover:translate-x-1">Voir →</span>
                </div>
              ) : (
                <div className="relative mt-5">
                  <div className="h-1.5 overflow-hidden rounded-full bg-cream/10">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: accent }}
                      initial={{ width: 0 }}
                      animate={{ width: `${c.progress * 100}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.05 }}
                    />
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed text-cream/75">{c.requirement}</p>
                </div>
              )}
            </motion.div>
          );
          return (
            <li key={c.id} className={isFinal ? "md:col-span-2 2xl:col-span-1" : ""}>
              {c.unlocked ? (
                <Link href={`/compte/certificats/${c.id}`} className="block h-full">
                  {body}
                </Link>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
