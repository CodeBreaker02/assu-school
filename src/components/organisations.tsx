"use client";

import { AnimatePresence, motion, useMotionValueEvent, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Eyebrow, Reveal } from "./reveal";

type Audience = {
  key: string;
  label: string;
  who: string;
  pitch: string;
  points: string[];
  /** Illustrative dashboard figures — clearly labelled as an example in the UI. */
  demo: {
    org: string;
    enrolled: number;
    completion: number;
    uplift: number;
    chapters: { name: string; value: number }[];
  };
};

const audiences: Audience[] = [
  {
    key: "clients",
    label: "Vos clients",
    who: "Banques, IMF, assureurs, fintechs, opérateurs mobiles",
    pitch: "Des clients qui comprennent l'argent épargnent plus, remboursent mieux et restent plus longtemps.",
    points: [
      "Parcours d'éducation avant un premier crédit",
      "Onboarding financier des nouveaux clients",
      "Modules sur vos produits, dans votre ton",
    ],
    demo: {
      org: "Microfinance partenaire",
      enrolled: 12480,
      completion: 64,
      uplift: 38,
      chapters: [
        { name: "Budget", value: 92 },
        { name: "Précaution", value: 81 },
        { name: "Microcrédit", value: 74 },
        { name: "Mobile Money", value: 66 },
        { name: "BRVM", value: 35 },
      ],
    },
  },
  {
    key: "membres",
    label: "Vos membres",
    who: "Mutuelles, coopératives, associations, syndicats",
    pitch: "Des membres mieux formés gèrent mieux les cotisations, les tontines et les projets collectifs.",
    points: [
      "Tontines et épargne collective bien organisées",
      "Formation des trésoriers et des bureaux",
      "Sessions de groupe animées avec nos supports",
    ],
    demo: {
      org: "Coopérative partenaire",
      enrolled: 3260,
      completion: 71,
      uplift: 44,
      chapters: [
        { name: "Tontine", value: 95 },
        { name: "Budget", value: 83 },
        { name: "Famille", value: 77 },
        { name: "Objectif", value: 61 },
        { name: "Retraite", value: 42 },
      ],
    },
  },
  {
    key: "employes",
    label: "Vos employés",
    who: "Entreprises, administrations, ONG",
    pitch: "Moins de stress financier, moins d'avances sur salaire, des équipes plus sereines et plus présentes.",
    points: [
      "Programme bien-être financier clé en main",
      "Ateliers retraite pour les seniors",
      "Suivi anonymisé : aucune donnée individuelle partagée",
    ],
    demo: {
      org: "Entreprise partenaire",
      enrolled: 418,
      completion: 78,
      uplift: 41,
      chapters: [
        { name: "Budget", value: 90 },
        { name: "Famille", value: 86 },
        { name: "Précaution", value: 79 },
        { name: "Retraite", value: 68 },
        { name: "Terrain", value: 57 },
      ],
    },
  },
];

const features = [
  { title: "Marque blanche ou co-brandée", body: "Votre logo, vos couleurs, votre nom de programme." },
  { title: "Parcours sur mesure", body: "On adapte les leçons à vos produits et à votre public." },
  { title: "Tableau de bord d'impact", body: "Progression, compréhension et engagement, anonymisés." },
  { title: "Déploiement simple", body: "Lien d'invitation, SMS ou QR code en agence." },
];

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const spring = useSpring(value, { stiffness: 80, damping: 20 });
  useEffect(() => spring.set(value), [spring, value]);
  useMotionValueEvent(spring, "change", (v) => {
    if (ref.current) ref.current.textContent = Math.round(v).toLocaleString("fr-FR") + suffix;
  });
  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString("fr-FR") + suffix}
    </span>
  );
}

function Dashboard({ a }: { a: Audience }) {
  const d = a.demo;
  return (
    <div className="overflow-hidden rounded-[22px] border border-line-strong bg-ink-2 shadow-[0_40px_100px_-30px_rgb(0_0_0/0.55)]">
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-lg bg-gold font-mono text-[11px] text-on-gold">
            {d.org[0]}
          </span>
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={d.org}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-sm"
              >
                {d.org}
              </motion.div>
            </AnimatePresence>
            <div className="font-mono text-[10px] text-faint">propulsé par Assu School</div>
          </div>
        </div>
        <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] tracking-wider text-muted uppercase">
          Exemple
        </span>
      </div>

      <div className="grid grid-cols-3 border-b border-line">
        {[
          { label: "Inscrits", node: <Counter value={d.enrolled} /> },
          { label: "Complétion", node: <Counter value={d.completion} suffix=" %" /> },
          { label: "Compréhension", node: <Counter value={d.uplift} suffix=" %" />, plus: true },
        ].map((k) => (
          <div key={k.label} className="border-r border-line p-4 last:border-r-0 sm:p-5">
            <div className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{k.label}</div>
            <div className={`mt-2 font-display text-2xl sm:text-3xl ${k.plus ? "text-mint" : ""}`}>
              {k.plus && "+"}
              {k.node}
            </div>
          </div>
        ))}
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
          <span>Chapitres les plus suivis</span>
          <span>% des inscrits</span>
        </div>
        <ul className="space-y-3">
          {d.chapters.map((c, i) => (
            <li key={`${a.key}-${c.name}`} className="grid grid-cols-[88px_1fr_36px] items-center gap-3 text-sm">
              <span className="truncate text-cream/85">{c.name}</span>
              <span className="h-2 overflow-hidden rounded-full bg-cream/[0.06]">
                <motion.span
                  className="block h-full rounded-full bg-gradient-to-r from-gold/70 to-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${c.value}%` }}
                  transition={{ type: "spring", stiffness: 70, damping: 18, delay: i * 0.06 }}
                />
              </span>
              <span className="text-right font-mono text-[11px] text-muted tabular-nums">{c.value}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center gap-3 rounded-xl border border-line bg-ink-3/50 p-3 text-xs text-muted">
          <svg viewBox="0 0 16 16" className="size-4 shrink-0 fill-none stroke-mint stroke-[1.6]" aria-hidden>
            <path d="M8 1.5 2.5 4v4c0 3.2 2.3 5.7 5.5 6.5 3.2-.8 5.5-3.3 5.5-6.5V4L8 1.5Z" />
          </svg>
          Données agrégées et anonymisées. Aucune information individuelle n&apos;est partagée.
        </div>
      </div>
    </div>
  );
}

export function Organisations() {
  const [active, setActive] = useState(0);
  const a = audiences[active];

  return (
    <section id="organisations" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_80%_40%,rgb(111_211_154/0.08),transparent)]" />
      <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-14">
        <div className="grid items-end gap-10 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>Pour les organisations</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.5rem,5.8vw,6.6rem)] leading-[1] tracking-[-0.015em]">
              Éduquez ceux qui <em className="text-gold">comptent sur vous.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-lg text-muted lg:ml-auto">
              Offrez l&apos;éducation financière à vos clients, membres ou employés. On s&apos;occupe
              du reste.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-12">
          <div className="flex w-full gap-1 overflow-x-auto rounded-full border border-line bg-ink-2 p-1 sm:w-fit" role="tablist" aria-label="Public">
            {audiences.map((x, i) => (
              <button
                key={x.key}
                type="button"
                role="tab"
                aria-selected={active === i}
                onClick={() => setActive(i)}
                className={`relative z-10 flex-1 rounded-full px-4 py-2.5 text-sm whitespace-nowrap transition-colors sm:flex-none sm:px-6 ${
                  active === i ? "text-ink" : "text-muted hover:text-cream"
                }`}
              >
                {active === i && (
                  <motion.span layoutId="aud-pill" className="absolute inset-0 -z-10 rounded-full bg-cream" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                {x.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
          <AnimatePresence mode="wait">
            <motion.div
              key={a.key}
              initial={{ opacity: 0, x: -16, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 16, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="font-mono text-[11px] tracking-[0.18em] text-gold uppercase">{a.who}</div>
              <p className="mt-4 font-display text-[clamp(1.6rem,2.8vw,2.3rem)] leading-[1.15]">{a.pitch}</p>
              <ul className="mt-8 space-y-3">
                {a.points.map((pt, i) => (
                  <motion.li
                    key={pt}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.07 }}
                    className="flex items-start gap-3 text-[15px] text-cream/90"
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                    {pt}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a
                  href="mailto:partenariats@assu.app?subject=D%C3%A9mo%20Assu%20School"
                  className="group inline-flex items-center gap-3 rounded-full bg-cream py-3.5 pr-3.5 pl-6 font-medium text-ink transition-all hover:bg-gold hover:text-on-gold active:scale-[0.98]"
                >
                  Demander une démo
                  <span className="grid size-8 place-items-center rounded-full bg-ink text-cream transition-transform group-hover:translate-x-0.5">→</span>
                </a>
                <span className="text-sm text-muted">Tarif par membre actif, dégressif.</span>
              </div>
            </motion.div>
          </AnimatePresence>

          <Reveal delay={0.15} y={40}>
            <Dashboard a={a} />
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06} y={16} className="bg-ink p-6">
              <span className="block size-1.5 rounded-full bg-gold" />
              <h3 className="mt-4 font-display text-xl leading-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
