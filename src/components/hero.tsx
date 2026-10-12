"use client";

import Link from "next/link";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { totalLessons, totalMinutes } from "@/lib/content";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    // Extra room above/below (cancelled by negative margins) so tall glyphs
    // like the "f" and the dot of the "i" aren't clipped by the reveal mask.
    <span className="-my-[0.14em] block overflow-hidden pt-[0.14em] pb-[0.14em]">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease, delay },
});

export function Hero() {
  const hours = Math.round(totalMinutes / 60);

  return (
    <section id="top" className="relative isolate flex h-[100svh] min-h-[600px] flex-col overflow-hidden">
      {/* warm radial glow behind the spiral */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_60%_at_70%_45%,rgb(233_180_76/0.16),transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[40svh] md:inset-0 md:h-auto">
        <HeroScene />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="mx-auto flex w-full max-w-[1560px] flex-1 flex-col px-5 pt-[36svh] pb-6 sm:px-8 md:pt-28 md:pb-10 lg:px-14">
        <motion.a
          href="#organisations"
          {...fade(0.1)}
          className="mb-6 hidden w-fit items-center gap-2 rounded-full border border-line-strong bg-ink/40 py-1 pr-3 pl-1 text-xs text-muted backdrop-blur-md transition-colors hover:text-cream md:inline-flex"
        >
          <span className="rounded-full bg-gold px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider text-on-gold uppercase">
            Nouveau
          </span>
          Assu School pour les organisations
          <span aria-hidden>→</span>
        </motion.a>

        {/* Sized on both axes so the whole hero always fits the viewport. */}
        <h1 className="font-display text-[clamp(2.8rem,min(13vw,7.2svh),12rem)] leading-[0.92] tracking-[-0.02em] md:text-[clamp(3.4rem,min(10.5vw,14.5svh),13rem)]">
          <Line delay={0.2}>L&apos;argent</Line>
          <Line delay={0.32}>
            s&apos;apprend<span className="text-gold">.</span>
          </Line>
          <Line delay={0.44}>
            <em className="text-gradient-gold py-[0.14em] pr-2">Enfin.</em>
          </Line>
        </h1>

        <div className="mt-auto grid items-end gap-8 pt-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div>
            <motion.p
              {...fade(0.7)}
              className="max-w-xl text-[15px] leading-relaxed text-muted text-balance sm:text-lg lg:text-xl"
            >
              Tontine, Mobile Money, famille, BRVM : l&apos;école de l&apos;argent pensée pour
              l&apos;Afrique de l&apos;Ouest. Gratuite pour commencer.
            </motion.p>

            <motion.div {...fade(0.85)} className="mt-6 flex flex-wrap items-center gap-3 lg:mt-8">
              <Link
                href="/cours"
                className="group inline-flex items-center gap-3 rounded-full bg-gold py-3 pr-3 pl-5 font-medium text-on-gold shadow-[0_10px_40px_-8px_rgb(233_180_76/0.55)] transition-all hover:bg-gold-soft active:scale-[0.98] sm:py-3.5 sm:pr-3.5 sm:pl-6"
              >
                Commencer gratuitement
                <span className="grid size-8 place-items-center rounded-full bg-ink text-gold transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
              <Link
                href="/cours/budget-50-30-20"
                aria-label="Voir une leçon gratuite"
                className="inline-flex items-center gap-3 rounded-full border border-line-strong p-3 text-cream backdrop-blur-sm transition-colors hover:bg-cream/5 sm:py-3.5 sm:pr-6 sm:pl-3.5"
              >
                <span className="grid size-8 place-items-center rounded-full bg-cream/10">
                  <svg viewBox="0 0 10 12" className="ml-0.5 size-3 fill-cream" aria-hidden>
                    <path d="M0 0l10 6-10 6z" />
                  </svg>
                </span>
                <span className="hidden sm:inline">Voir une leçon gratuite</span>
              </Link>
            </motion.div>
          </div>

          <motion.div {...fade(1)} className="hidden rounded-3xl border border-line bg-ink/55 p-6 backdrop-blur-xl lg:block">
            <dl className="flex gap-12 font-mono text-xs text-muted">
              {[
                [String(totalLessons), "leçons"],
                [`${hours} h`, "de vidéo"],
                ["Gratuit", "pour commencer"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-3xl text-cream tabular-nums">{v}</dd>
                  <dd className="mt-1.5 uppercase tracking-[0.18em]">{l}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex items-center gap-3 text-sm text-muted">
              <span className="flex text-gold" aria-hidden>
                {"★★★★★"}
              </span>
              <span>
                <span className="text-cream">4,9/5</span> · Premium via Mobile Money
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
