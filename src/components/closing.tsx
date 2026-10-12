"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { faqs, freeLessons, testimonials, totalLessons } from "@/lib/content";
import { CauriMark, Wordmark } from "./logo";
import { Eyebrow, Reveal } from "./reveal";

/* ───────────────────────── Testimonials ───────────────────────── */

export function Testimonials() {
  const [featured, ...rest] = testimonials;
  return (
    <section className="mx-auto max-w-[1560px] px-5 py-24 sm:px-6 md:py-32">
      <Reveal>
        <Eyebrow>Ils ont commencé</Eyebrow>
      </Reveal>

      <Reveal delay={0.05} className="mt-10">
        <blockquote className="max-w-4xl font-display text-[clamp(1.8rem,3.8vw,3.2rem)] leading-[1.12] tracking-[-0.01em]">
          <span className="text-gold">“</span>
          {featured.quote}
          <span className="text-gold">”</span>
        </blockquote>
        <div className="mt-6 flex items-center gap-3 text-sm">
          <span className="grid size-10 place-items-center rounded-full bg-gold font-mono text-xs text-on-gold">
            {featured.name.split(" ").map((p) => p[0]).join("")}
          </span>
          <span>
            <span className="block text-cream">{featured.name}</span>
            <span className="text-muted">{featured.role}</span>
          </span>
        </div>
      </Reveal>

      <div className="mt-16 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {rest.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.05} className="mb-4 break-inside-avoid">
            <figure className="rounded-3xl border border-line bg-ink-2 p-6 transition-colors hover:border-line-strong">
              <div className="mb-4 flex gap-0.5 text-gold" aria-label="5 étoiles sur 5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg key={s} viewBox="0 0 20 20" className="size-3.5 fill-current" aria-hidden>
                    <path d="m10 1.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-[15px] leading-relaxed text-cream/85">{t.quote}</blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="text-cream">{t.name}</span>
                <span className="text-muted"> · {t.role}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Pricing ───────────────────────── */

const billing = {
  mois: { amount: "2 000", per: "FCFA / mois", note: "Sans engagement, arrêtez quand vous voulez." },
  an: { amount: "15 000", per: "FCFA / an", note: "Soit 1 250 FCFA par mois : 3 mois offerts." },
} as const;

const freeFeatures = [
  `${freeLessons} leçons gratuites, dont tout le chapitre 01`,
  "Les simulateurs de base",
  "La communauté Assu School",
  "Inscription avec un simple numéro",
];

const premiumFeatures = [
  `Les ${totalLessons} leçons, tous chapitres`,
  "Tous les simulateurs : tontine, BRVM, retraite…",
  "Exercices sur vos propres chiffres",
  "Leçons téléchargeables hors connexion",
  "Certificat de fin de parcours",
  "Toutes les nouvelles leçons, incluses",
];

function Check({ className = "stroke-gold" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`mt-1 size-4 shrink-0 fill-none stroke-2 ${className}`} aria-hidden>
      <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Pricing() {
  const [period, setPeriod] = useState<keyof typeof billing>("an");
  const p = billing[period];

  return (
    <section id="tarif" className="relative mx-auto max-w-[1560px] px-5 py-24 sm:px-6 md:py-32">
      <Reveal className="text-center">
        <div className="flex justify-center">
          <Eyebrow>Tarifs</Eyebrow>
        </div>
        <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.5rem,5.8vw,6.6rem)] leading-[1] tracking-[-0.015em]">
          Gratuit pour commencer. <em className="text-gold">Premium pour aller loin.</em>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-lg text-muted">
          Commencez sans payer. Passez Premium avec votre Mobile Money, quand vous voulez.
        </p>

        <div className="mt-10 inline-flex rounded-full border border-line bg-ink-2 p-1 text-sm" role="tablist" aria-label="Période de facturation">
          {(Object.keys(billing) as (keyof typeof billing)[]).map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={period === k}
              onClick={() => setPeriod(k)}
              className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-2 transition-colors ${period === k ? "text-ink" : "text-muted hover:text-cream"}`}
            >
              {period === k && (
                <motion.span layoutId="period-pill" className="absolute inset-0 -z-10 rounded-full bg-cream" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              {k === "mois" ? "Mensuel" : "Annuel"}
              {k === "an" && (
                <span className="rounded-full bg-gold px-1.5 py-0.5 font-mono text-[10px] text-on-gold">−37 %</span>
              )}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-[1fr_1.15fr]">
        <Reveal delay={0.05}>
          <div className="flex h-full flex-col rounded-[30px] border border-line bg-ink-2 p-8 sm:p-10">
            <span className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">Gratuit</span>
            <div className="mt-8 flex items-baseline gap-2">
              <span className="font-display text-7xl leading-none">0</span>
              <span className="font-display text-2xl text-muted">FCFA</span>
            </div>
            <p className="mt-2 text-sm text-muted">Pour toujours. Sans carte, sans piège.</p>
            <ul className="mt-8 space-y-3 border-t border-line pt-8 text-[15px]">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="stroke-muted" />
                  <span className="text-cream/90">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-10">
              <Link
                href="/cours"
                className="flex items-center justify-center gap-3 rounded-full border border-line-strong py-4 font-medium transition-colors hover:bg-cream/5"
              >
                Créer mon compte gratuit
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="relative h-full rounded-[30px] p-px">
            <div className="absolute inset-0 overflow-hidden rounded-[30px]">
              <motion.div
                className="absolute top-1/2 left-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0%,var(--gold)_10%,transparent_22%,transparent_50%,var(--ember)_60%,transparent_72%)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <div className="relative flex h-full flex-col rounded-[29px] bg-ink-2 p-8 sm:p-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-gold uppercase">
                  <CauriMark className="h-4 w-3.5" /> Premium
                </span>
                <span className="rounded-full bg-gold/15 px-2.5 py-1 font-mono text-[10px] tracking-wider text-gold uppercase">Le plus choisi</span>
              </div>

              <div className="mt-8 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={p.amount}
                    initial={{ y: 30, opacity: 0, filter: "blur(6px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -30, opacity: 0, filter: "blur(6px)" }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-6xl leading-none whitespace-nowrap tabular-nums sm:text-7xl"
                  >
                    {p.amount}
                  </motion.span>
                </AnimatePresence>
                <span className="font-display text-xl whitespace-nowrap text-muted sm:text-2xl">{p.per}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{p.note}</p>

              <ul className="mt-8 space-y-3 border-t border-line pt-8 text-[15px]">
                {premiumFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check />
                    <span className="text-cream/90">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/cours"
                className="group mt-10 flex items-center justify-center gap-3 rounded-full bg-gold py-4 font-medium text-on-gold shadow-[0_10px_50px_-10px_rgb(233_180_76/0.7)] transition-all hover:bg-gold-soft active:scale-[0.98]"
              >
                Passer Premium
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <div className="mt-4 text-center font-mono text-[11px] text-muted">
                Orange Money · Wave · MTN MoMo · Moov Money · Carte
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="mx-auto mt-10 max-w-xl text-center text-sm text-muted">
        Vous représentez une banque, une IMF, une mutuelle ou une entreprise ?{" "}
        <a href="#organisations" className="text-cream underline decoration-gold underline-offset-4">
          Découvrez l&apos;offre Organisations
        </a>
        .
      </Reveal>
    </section>
  );
}

/* ───────────────────────── FAQ ───────────────────────── */

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="mx-auto max-w-[1560px] px-5 py-24 sm:px-6 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
        <Reveal>
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(2.5rem,5.4vw,6rem)] leading-[1] tracking-[-0.015em]">
            Vous vous demandez <em className="text-muted">sûrement…</em>
          </h2>
        </Reveal>
        <div className="border-t border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.04} y={14} className="border-b border-line">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg transition-colors hover:text-gold"
                >
                  {f.q}
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="shrink-0 text-2xl font-light text-muted" aria-hidden>
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-6 leading-relaxed text-muted">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Final CTA + Footer ───────────────────────── */

export function FinalCta() {
  return (
    <section className="relative overflow-hidden px-5 py-32 text-center sm:px-6 md:py-48">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(45%_55%_at_50%_100%,rgb(233_180_76/0.22),transparent)]" />
      <Reveal>
        <CauriMark className="mx-auto h-14 w-11" />
        <h2 className="mx-auto mt-10 max-w-4xl font-display text-[clamp(2.8rem,8vw,7rem)] leading-[0.95] tracking-[-0.02em]">
          Le meilleur moment, c&apos;était il y a dix ans.
        </h2>
        <p className="mt-6 font-display text-[clamp(1.6rem,3.5vw,2.8rem)] text-gold">Le deuxième, c&apos;est maintenant.</p>
        <Link
          href="/cours"
          className="group mt-12 inline-flex items-center gap-3 rounded-full bg-cream py-4 pr-4 pl-7 font-medium text-ink transition-all hover:bg-gold hover:text-on-gold active:scale-[0.98]"
        >
          Commencer gratuitement
          <span className="grid size-8 place-items-center rounded-full bg-ink text-cream transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
        <p className="mt-5 font-mono text-[11px] text-muted">{freeLessons} leçons gratuites. Un numéro de téléphone suffit.</p>
      </Reveal>
    </section>
  );
}

export function Footer() {
  const cols = [
    { title: "Cours", links: ["Programme", "Leçons gratuites", "Simulateurs", "Certificat"] },
    { title: "Assu School", links: ["Manifeste", "Organisations", "Notre indépendance", "Contact"] },
    { title: "Légal", links: ["Mentions légales", "CGV", "Confidentialité", "Cookies"] },
  ];
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1560px] gap-12 px-5 py-16 sm:px-6 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-sm text-muted">
            L&apos;école de l&apos;argent pensée pour la vie ouest-africaine. Indépendante, sans
            produit financier à vendre.
          </p>
          <form className="mt-6 flex max-w-sm rounded-full border border-line-strong p-1" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="nl" className="sr-only">E-mail</label>
            <input id="nl" type="email" placeholder="Une leçon gratuite par semaine" className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-faint" />
            <button type="submit" className="rounded-full bg-cream px-4 py-2 text-sm text-ink">OK</button>
          </form>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="font-mono text-[11px] tracking-[0.2em] text-faint uppercase">{c.title}</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-muted transition-colors hover:text-cream">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none mx-auto max-w-[1560px] translate-y-[22%] px-5 text-center font-display text-[clamp(8rem,32vw,26rem)] leading-[0.8] tracking-[-0.04em] select-none sm:px-6"
          style={{ background: "linear-gradient(180deg, color-mix(in oklab, var(--cream) 14%, transparent), transparent 75%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
        >
          assu
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1560px] flex-wrap justify-between gap-4 px-5 py-6 font-mono text-[11px] text-faint sm:px-6">
          <span>© 2026 Assu School. Ce cours est éducatif et ne constitue pas un conseil en investissement.</span>
          <span>Fait avec soin, en Afrique de l&apos;Ouest.</span>
        </div>
      </div>
    </footer>
  );
}
