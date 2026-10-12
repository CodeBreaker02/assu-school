"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { chapters } from "@/lib/content";
import { CauriMark } from "./logo";
import { Eyebrow, Reveal } from "./reveal";

const CHAPTER = 4;
const chapter = chapters[CHAPTER];
const ACTIVE = chapter.lessons.findIndex((l) => l.slug === "epargne-d-investissement");
const lessonNumber =
  chapters.slice(0, CHAPTER).reduce((n, c) => n + c.lessons.length, 0) + ACTIVE + 1;

const captions = [
  "Imaginez que vous placiez 100 000 FCFA aujourd'hui…",
  "La première année, ils rapportent 7 000 FCFA. Rien d'extraordinaire.",
  "Mais l'année suivante, ce sont 107 000 FCFA qui travaillent.",
  "Les intérêts produisent à leur tour des intérêts.",
  "Au bout de trente ans, la courbe ne monte plus. Elle décolle.",
];

const options = [
  { label: "170 000 F", correct: false },
  { label: "196 715 F", correct: true },
  { label: "200 000 F", correct: false },
  { label: "107 000 F", correct: false },
];

/** Apple-style entrance: the app window tilts up and grows to full size as it scrolls in. */
function ScrollTilt({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 15%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0.2, 1]);
  return (
    <div ref={ref} className={`[perspective:1600px] ${className ?? ""}`}>
      <motion.div style={{ scale, rotateX, y, opacity, transformOrigin: "50% 100%" }}>{children}</motion.div>
    </div>
  );
}

function Player() {
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(0); // 0..1 progress through the "video"

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((v) => (v + 0.004) % 1), 50);
    return () => clearInterval(id);
  }, [playing]);

  const years = 30;
  const shown = Math.max(1, Math.round(t * years));
  const caption = captions[Math.min(captions.length - 1, Math.floor(t * captions.length))];
  const bars = Array.from({ length: years }, (_, i) => 100000 * Math.pow(1.07, i + 1));
  const max = bars[years - 1];

  return (
    <div data-theme="dark" className="relative aspect-video overflow-hidden rounded-xl text-cream bg-[radial-gradient(80%_80%_at_50%_100%,#2a1f0e,#0d0b08)]">
      <div className="hairline-grid absolute inset-0 opacity-40" />

      <div className="absolute top-4 left-5 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
        Leçon {lessonNumber} — {chapter.lessons[ACTIVE].title}
      </div>
      <div className="absolute top-3 right-5 text-right">
        <div className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">Année {shown}</div>
        <div className="font-display text-2xl text-gold tabular-nums sm:text-3xl">
          {Math.round(bars[shown - 1]).toLocaleString("fr-FR")} F
        </div>
      </div>

      <div className="absolute inset-x-5 bottom-16 flex h-[52%] items-end gap-[3px] sm:gap-1">
        {bars.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-[3px] transition-all duration-300"
            style={{
              height: i < shown ? `${(v / max) * 100}%` : "0%",
              background:
                i === shown - 1
                  ? "var(--gold-soft)"
                  : `linear-gradient(to top, rgb(233 180 76 / 0.25), rgb(233 180 76 / ${0.35 + (i / years) * 0.6}))`,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={caption}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="absolute inset-x-0 bottom-9 px-6 text-center text-xs text-cream sm:text-sm"
        >
          <span className="rounded bg-black/60 px-2 py-1">{caption}</span>
        </motion.p>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 pt-6 pb-3">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="grid size-7 place-items-center rounded-full bg-cream text-ink"
          aria-label={playing ? "Pause" : "Lecture"}
        >
          {playing ? (
            <svg viewBox="0 0 10 10" className="size-2.5 fill-current" aria-hidden>
              <rect x="1" y="0" width="3" height="10" />
              <rect x="6" y="0" width="3" height="10" />
            </svg>
          ) : (
            <svg viewBox="0 0 10 12" className="ml-0.5 size-2.5 fill-current" aria-hidden>
              <path d="M0 0l10 6-10 6z" />
            </svg>
          )}
        </button>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
          <div className="h-full bg-gold" style={{ width: `${t * 100}%` }} />
        </div>
        <span className="font-mono text-[10px] text-cream/70 tabular-nums">
          {String(Math.floor(t * 26)).padStart(2, "0")}:{String(Math.floor((t * 26 * 60) % 60)).padStart(2, "0")} / 26:00
        </span>
      </div>
    </div>
  );
}

function Quiz() {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  return (
    <div className="rounded-xl border border-line bg-ink-3/50 p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.2em] text-gold uppercase">Question éclair</span>
        {answered && (
          <button type="button" onClick={() => setPicked(null)} className="font-mono text-[10px] text-muted hover:text-cream">
            Réessayer ↺
          </button>
        )}
      </div>
      <p className="mt-3 text-[15px] text-cream">
        Vous placez 100 000 FCFA à 7 % par an, sans rien ajouter. Combien aurez-vous dans 10 ans ?
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {options.map((o, i) => {
          const state = !answered ? "idle" : o.correct ? "right" : picked === i ? "wrong" : "dim";
          return (
            <motion.button
              key={o.label}
              type="button"
              disabled={answered}
              onClick={() => setPicked(i)}
              animate={state === "wrong" ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`rounded-lg border px-3 py-2.5 text-left font-mono text-sm transition-colors ${
                state === "right"
                  ? "border-mint/60 bg-mint/10 text-mint"
                  : state === "wrong"
                    ? "border-ember/60 bg-ember/10 text-ember"
                    : state === "dim"
                      ? "border-line text-faint"
                      : "border-line-strong text-cream hover:border-gold hover:bg-gold/5"
              }`}
            >
              {o.label}
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence>
        {answered && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden text-sm text-muted"
          >
            <span className="block pt-4">
              {options[picked].correct ? "Exactement. " : "Presque ! "}
              100 000 × 1,07<sup>10</sup> ≈ <span className="text-gold">196 715 FCFA</span>. Les 26 715 FCFA de plus
              qu&apos;un calcul « simple » ? Ce sont les intérêts de vos intérêts.
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LessonPreview() {
  return (
    <section id="apercu" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 h-[60%] bg-[radial-gradient(50%_50%_at_50%_50%,rgb(233_180_76/0.09),transparent)]" />
      <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-14">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <Eyebrow>À l&apos;intérieur</Eyebrow>
          </div>
          <h2 className="mt-6 font-display text-[clamp(2.5rem,5.8vw,6.6rem)] leading-[1] tracking-[-0.015em]">
            Regarder. Manipuler. <em className="text-gold">Retenir.</em>
          </h2>
          <p className="mt-6 text-lg text-muted">
            Vidéo animée, outil interactif, question éclair. Essayez : c&apos;est une vraie leçon.
          </p>
        </Reveal>

        <ScrollTilt className="mt-16">
          <div className="overflow-hidden rounded-[22px] border border-line-strong bg-ink-2 shadow-[0_60px_120px_-30px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.02)_inset]">
            {/* window chrome */}
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <div className="flex gap-1.5">
                <span className="size-3 rounded-full bg-[#ff5f57]" />
                <span className="size-3 rounded-full bg-[#febc2e]" />
                <span className="size-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="mx-auto flex items-center gap-2 rounded-md bg-ink-3 px-3 py-1 font-mono text-[11px] text-muted">
                <svg viewBox="0 0 12 12" className="size-2.5 fill-none stroke-current" aria-hidden>
                  <rect x="2" y="5" width="8" height="6" rx="1" />
                  <path d="M4 5V3.5a2 2 0 0 1 4 0V5" />
                </svg>
                school.assu.app/cours/epargne-d-investissement
              </div>
              <div className="w-12" />
            </div>

            <div className="grid md:grid-cols-[260px_1fr]">
              <aside className="hidden border-r border-line p-4 md:block">
                <div className="flex items-center gap-2 px-2 pb-4">
                  <CauriMark className="h-5 w-4" />
                  <span className="text-sm text-muted">Chapitre {chapter.number}</span>
                </div>
                <div className="mb-4 px-2">
                  <div className="flex justify-between font-mono text-[10px] text-muted">
                    <span>PROGRESSION</span>
                    <span className="text-gold">34 %</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[34%] rounded-full bg-gold" />
                  </div>
                </div>
                <ul className="space-y-0.5">
                  {chapter.lessons.map((l, i) => (
                    <li
                      key={l.title}
                      className={`flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] ${
                        i === ACTIVE ? "bg-gold/10 text-cream" : "text-muted"
                      }`}
                    >
                      <span
                        className={`grid size-4 shrink-0 place-items-center rounded-full border text-[8px] ${
                          i === ACTIVE ? "border-gold bg-gold text-on-gold" : "border-line-strong"
                        }`}
                      >
                        {i === ACTIVE ? "▶" : ""}
                      </span>
                      <span className="truncate">{l.title}</span>
                    </li>
                  ))}
                </ul>
              </aside>

              <div className="space-y-4 p-4 sm:p-6">
                <Player />
                <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
                  <div className="rounded-xl border border-line p-5">
                    <div className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">À retenir</div>
                    <ul className="mt-3 space-y-2.5 text-sm text-cream/85">
                      {[
                        "Le temps compte plus que le montant.",
                        "La régularité bat le timing.",
                        "Les frais composent aussi, contre vous.",
                      ].map((s) => (
                        <li key={s} className="flex gap-2.5">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Quiz />
                </div>
              </div>
            </div>
          </div>
        </ScrollTilt>

        <Reveal delay={0.1} className="mt-10 flex justify-center">
          <Link
            href="/cours/epargne-d-investissement"
            className="group inline-flex items-center gap-3 rounded-full border border-line-strong py-3 pr-3 pl-6 text-sm transition-colors hover:bg-cream/5"
          >
            Ouvrir la leçon complète, gratuitement
            <span className="grid size-7 place-items-center rounded-full bg-gold text-on-gold transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
