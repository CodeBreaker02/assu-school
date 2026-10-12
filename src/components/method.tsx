"use client";

import { motion } from "motion/react";
import { countries } from "@/lib/content";
import { CauriMark } from "./logo";
import { Eyebrow, Reveal } from "./reveal";

function Card({
  className = "",
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <Reveal delay={delay} className={className}>
      <div
        onPointerMove={onMove}
        className="group relative h-full overflow-hidden rounded-3xl border border-line bg-ink-2 p-7 transition-colors duration-500 hover:border-line-strong"
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(400px_circle_at_var(--mx)_var(--my),rgb(233_180_76/0.09),transparent_60%)]" />
        <div className="relative flex h-full flex-col">{children}</div>
      </div>
    </Reveal>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-[1.9rem] leading-tight">{children}</h3>;
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">{children}</p>;
}

export function Method() {
  return (
    <section id="methode" className="mx-auto max-w-[1560px] px-5 py-24 sm:px-6 md:py-32">
      <Reveal>
        <Eyebrow>La méthode</Eyebrow>
        <h2 className="mt-6 max-w-3xl font-display text-[clamp(2.5rem,5.8vw,6.6rem)] leading-[1] tracking-[-0.015em]">
          Pas un énième cours. <em className="text-muted">Une autre façon d&apos;apprendre.</em>
        </h2>
      </Reveal>

      <div className="mt-14 grid auto-rows-[minmax(280px,auto)] gap-4 md:grid-cols-6">
        <Card className="md:col-span-4">
          <div className="flex flex-1 flex-col justify-between gap-10 md:flex-row md:items-center">
            <div>
              <span className="font-mono text-[11px] tracking-[0.2em] text-gold uppercase">Notre engagement</span>
              <div className="mt-4">
                <Title>Zéro conflit d&apos;intérêts.</Title>
              </div>
              <Body>
                Aucune commission, aucun partenariat bancaire. Notre seul client, c&apos;est vous.
              </Body>
            </div>
            <ul className="space-y-2 font-mono text-sm">
              {["Commissions cachées", "Liens affiliés", "Placements « miracles »", "Pyramides déguisées", "Formations à 500 000 FCFA"].map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12 }}
                  className="relative w-fit text-faint"
                >
                  {s}
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.12, duration: 0.4 }}
                    className="absolute top-1/2 left-0 h-px w-full origin-left bg-ember"
                  />
                </motion.li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="md:col-span-2" delay={0.05}>
          <Title>Des simulateurs, pas des slides.</Title>
          <Body>Chaque concept se manipule. On comprend avec les mains.</Body>
          <svg viewBox="0 0 200 70" className="mt-auto w-full pt-6" aria-hidden>
            <motion.path
              d="M0 65 C 40 62, 70 58, 100 48 S 160 20, 200 4"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
            <path d="M0 65 L200 45" stroke="var(--line-strong)" strokeDasharray="3 5" fill="none" />
          </svg>
        </Card>

        <Card className="md:col-span-2" delay={0.05}>
          <Title>Vos chiffres, pas des exemples.</Title>
          <Body>Les exercices partent de votre situation réelle. Vous finissez chaque chapitre avec un plan, pas des notes.</Body>
          <div className="mt-auto flex items-center gap-3 pt-6 font-mono text-xs">
            <span className="rounded-lg border border-line px-3 py-2 text-muted">Salaire net</span>
            <span className="text-faint">→</span>
            <span className="rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-gold">Plan d&apos;action</span>
          </div>
        </Card>

        <Card className="md:col-span-2" delay={0.1}>
          <Title>Une communauté bienveillante.</Title>
          <Body>Posez toutes les questions que vous n&apos;osez pas poser à votre banquier.</Body>
          <div className="mt-auto flex items-center pt-6">
            {["AD", "TR", "MK", "LM", "FS"].map((n, i) => (
              <span
                key={n}
                className="-ml-2 grid size-10 place-items-center rounded-full border-2 border-ink-2 font-mono text-[11px] text-on-gold first:ml-0"
                style={{ background: ["#f6d58e", "#e9b44c", "#e2603b", "#6fd39a", "#9fb6ff"][i] }}
              >
                {n}
              </span>
            ))}
            <span className="ml-3 flex items-center gap-2 text-xs text-muted">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-mint" />
              </span>
              318 en ligne
            </span>
          </div>
        </Card>

        <Card className="md:col-span-2" delay={0.15}>
          <Title>Mis à jour, pour toujours.</Title>
          <Body>Nouvelles lois, nouveaux produits, nouvelles crises : le cours évolue, votre accès aussi.</Body>
          <ul className="mt-auto space-y-1.5 pt-6 font-mono text-[11px]">
            {[
              ["oct.", "Chapitre 07 — Retraite & protection"],
              ["sept.", "Simulateur tontine v2"],
              ["juil.", "Leçon : le budget solidarité"],
            ].map(([d, s]) => (
              <li key={s} className="flex gap-3">
                <span className="w-9 text-gold">{d}</span>
                <span className="truncate text-muted">{s}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="md:col-span-3" delay={0.05}>
          <div className="flex h-full flex-col gap-8 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Title>Un certificat qui a du sens.</Title>
              <Body>Validé par un examen final, pas par un clic. À afficher fièrement sur LinkedIn.</Body>
            </div>
            <motion.div
              data-theme="dark"
              whileHover={{ rotate: -2, scale: 1.03 }}
              className="relative w-full max-w-[220px] rotate-3 rounded-xl text-cream border border-gold/30 bg-gradient-to-br from-[#1e1912] to-[#0f0d0a] p-4 shadow-2xl"
            >
              <CauriMark className="h-6 w-5" />
              <div className="mt-6 font-mono text-[9px] tracking-[0.2em] text-muted uppercase">Certificat</div>
              <div className="font-display text-xl leading-tight">Éducation financière</div>
              <div className="mt-4 flex items-end justify-between">
                <span className="font-display text-sm text-muted">Votre nom</span>
                <span className="grid size-8 place-items-center rounded-full border border-gold/50 font-mono text-[8px] text-gold">2026</span>
              </div>
            </motion.div>
          </div>
        </Card>

        <Card className="md:col-span-3" delay={0.1}>
          <div className="flex h-full flex-col justify-between gap-6">
            <div>
              <Title>Pensé pour la vie d&apos;ici.</Title>
              <Body>
                FCFA, BRVM, tontines, Mobile Money. Pas un manuel européen traduit.
              </Body>
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-[11px]">
              {countries.map((c) => (
                <span key={c} className="rounded-md border border-line px-2.5 py-1 text-muted transition-colors hover:border-gold hover:text-gold">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
