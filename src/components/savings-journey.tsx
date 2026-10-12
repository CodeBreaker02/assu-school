"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";

const steps = [
  {
    key: "budget",
    word: "Budget",
    kicker: "D'abord, répartir",
    title: "Chaque franc a un rôle.",
    body: "50 % besoins, 30 % envies et famille, 20 % épargne. Même quand le revenu varie.",
    href: "/cours/budget-50-30-20",
    accent: "#e9b44c",
  },
  {
    key: "precaution",
    word: "Précaution",
    kicker: "Ensuite, se protéger",
    title: "Une réserve pour les coups durs.",
    body: "3 à 6 mois de dépenses, mis à part. Pour qu'un coup dur ne devienne pas une dette.",
    href: "/cours/epargne-de-precaution",
    accent: "#6fd39a",
  },
  {
    key: "objectif",
    word: "Objectif",
    kicker: "Puis, viser",
    title: "Des projets avec une date.",
    body: "Rentrée, Tabaski, terrain : un montant, une date, un versement par mois.",
    href: "/cours/epargne-d-objectif",
    accent: "#9fb6ff",
  },
  {
    key: "investissement",
    word: "Investir",
    kicker: "Enfin, faire grandir",
    title: "Le temps travaille pour vous.",
    body: "Ce dont vous n'aurez pas besoin avant 5 ans travaille pour vous à la BRVM.",
    href: "/cours/epargne-d-investissement",
    accent: "#e2603b",
  },
] as const;

const N = steps.length;
/** Map a local [a, b] window inside step `i` (0..1 each) to global progress. */
const at = (i: number, t: number) => (i + t) / N;

/* ─────────── Stage pieces ─────────── */

const JAR_W = 120;
const JAR_H = 210;
const JAR_Y = 300;

function JarCoin({ cx, top, offset }: { cx: number; top: MotionValue<number>; offset: number }) {
  const cy = useTransform(top, (v) => v + offset);
  return <motion.ellipse cx={cx} rx={22} ry={7} fill="rgb(255 255 255 / 0.18)" style={{ cy }} />;
}

function Jar({
  x,
  level,
  label,
  share,
  color,
  opacity,
  tx,
  scale,
}: {
  x: number;
  level: MotionValue<number>;
  label: string;
  share: string;
  color: string;
  opacity: MotionValue<number>;
  tx?: MotionValue<number>;
  scale?: MotionValue<number>;
}) {
  const h = useTransform(level, (v) => v * (JAR_H - 16));
  const y = useTransform(level, (v) => JAR_Y + JAR_H - 8 - v * (JAR_H - 16));
  return (
    <motion.g style={{ opacity, x: tx, scale, transformOrigin: `${x + JAR_W / 2}px ${JAR_Y + JAR_H / 2}px` }}>
      {/* lid */}
      <rect x={x + 18} y={JAR_Y - 18} width={JAR_W - 36} height={14} rx={5} fill="var(--line-strong)" />
      {/* glass */}
      <rect x={x} y={JAR_Y} width={JAR_W} height={JAR_H} rx={26} fill="var(--ink-2)" stroke="var(--line-strong)" strokeWidth={2} />
      <clipPath id={`jar-${x}`}>
        <rect x={x + 8} y={JAR_Y + 8} width={JAR_W - 16} height={JAR_H - 16} rx={20} />
      </clipPath>
      <g clipPath={`url(#jar-${x})`}>
        <motion.rect x={x + 8} width={JAR_W - 16} style={{ y, height: h }} fill={color} opacity={0.9} />
        {/* coins stacked inside, visible through the fill */}
        {[0, 1, 2, 3, 4].map((k) => (
          <JarCoin key={k} cx={x + JAR_W / 2 + (k % 2 ? 14 : -12)} top={y} offset={18 + k * 30} />
        ))}
      </g>
      {/* glass highlight */}
      <rect x={x + 14} y={JAR_Y + 22} width={8} height={JAR_H - 70} rx={4} fill="rgb(255 255 255 / 0.12)" />
      <text x={x + JAR_W / 2} y={JAR_Y + JAR_H + 34} textAnchor="middle" fill="var(--cream)" fontSize="26" fontFamily="var(--font-avant-garde)">
        {share}
      </text>
      <text x={x + JAR_W / 2} y={JAR_Y + JAR_H + 58} textAnchor="middle" fill="var(--muted)" fontSize="13" fontFamily="var(--font-geist-mono)" letterSpacing="1.5">
        {label.toUpperCase()}
      </text>
    </motion.g>
  );
}

function FallingCoins({ opacity }: { opacity: MotionValue<number> }) {
  const lanes = [
    { x: 150, delay: 0 },
    { x: 400, delay: 0.5 },
    { x: 650, delay: 1 },
  ];
  return (
    <motion.g style={{ opacity }}>
      {lanes.map((l, i) =>
        [0, 1].map((k) => (
          <motion.ellipse
            key={`${i}-${k}`}
            cx={l.x}
            rx={13}
            ry={5}
            fill="#f6d58e"
            stroke="#c08419"
            strokeWidth={1.5}
            initial={{ cy: 150, opacity: 0 }}
            animate={{ cy: [150, 300], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.4, delay: l.delay + k * 0.7, repeat: Infinity, ease: "easeIn" }}
          />
        )),
      )}
    </motion.g>
  );
}

function Counter({ value, format }: { value: MotionValue<number>; format: (v: number) => string }) {
  const ref = useRef<SVGTSpanElement>(null);
  useMotionValueEvent(value, "change", (v) => {
    if (ref.current) ref.current.textContent = format(v);
  });
  return <tspan ref={ref}>{format(value.get())}</tspan>;
}

const fmtF = (v: number) => `${Math.round(v).toLocaleString("fr-FR")} F`;

function Stage({ p }: { p: MotionValue<number> }) {
  /* Step 0 — income splits into 3 jars */
  const incomeOpacity = useTransform(p, [0, at(0, 0.12), at(0, 0.9), at(1, 0.1)], [0, 1, 1, 0]);
  const incomeW = useTransform(p, [at(0, 0.05), at(0, 0.35)], [0, 600]);
  const coinsOpacity = useTransform(p, [at(0, 0.2), at(0, 0.35), at(0, 0.85), at(1, 0.05)], [0, 1, 1, 0]);
  const sideJars = useTransform(p, [at(0, 0.05), at(0, 0.2), at(1, 0.05), at(1, 0.2)], [0, 1, 1, 0]);
  const needs = useTransform(p, [at(0, 0.25), at(0, 0.7)], [0, 0.5]);
  const wants = useTransform(p, [at(0, 0.3), at(0, 0.75)], [0, 0.3]);

  /* Savings jar travels through steps 0 → 2 */
  const saveLevel = useTransform(p, [at(0, 0.35), at(0, 0.8), at(1, 0.25), at(1, 0.8)], [0, 0.2, 0.2, 1]);
  const saveX = useTransform(p, [at(1, 0), at(1, 0.25)], [0, -250]);
  const saveScale = useTransform(p, [at(1, 0), at(1, 0.25), at(1, 0.9), at(2, 0.2)], [1, 1.3, 1.3, 0.8]);
  const saveOpacity = useTransform(p, [at(0, 0.05), at(0, 0.2), at(1, 0.9), at(2, 0.12)], [0, 1, 1, 0]);

  /* Step 1 — protection ring + months counter */
  const ringOpacity = useTransform(p, [at(1, 0.15), at(1, 0.3), at(1, 0.85), at(2, 0.05)], [0, 1, 1, 0]);
  const ring = useTransform(p, [at(1, 0.25), at(1, 0.8)], [0, 1]);
  const months = useTransform(p, [at(1, 0.25), at(1, 0.8)], [0, 6]);

  /* Step 2 — goal road */
  const roadOpacity = useTransform(p, [at(2, 0), at(2, 0.15), at(2, 0.85), at(3, 0.05)], [0, 1, 1, 0]);
  const road = useTransform(p, [at(2, 0.1), at(2, 0.75)], [0, 1]);
  const m1 = useTransform(p, [at(2, 0.25), at(2, 0.32)], [0, 1]);
  const m2 = useTransform(p, [at(2, 0.45), at(2, 0.52)], [0, 1]);
  const m3 = useTransform(p, [at(2, 0.68), at(2, 0.75)], [0, 1]);

  /* Step 3 — compound curve */
  const curveOpacity = useTransform(p, [at(3, 0), at(3, 0.12)], [0, 1]);
  const curve = useTransform(p, [at(3, 0.1), at(3, 0.8)], [0, 1]);
  const area = useTransform(p, [at(3, 0.55), at(3, 0.85)], [0, 1]);
  const total = useTransform(p, [at(3, 0.1), at(3, 0.8)], [0, 11_570_000]);

  const curvePath = (() => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const x = 90 + t * 640;
      const y = 520 - (Math.pow(1.07, t * 20) - 1) / (Math.pow(1.07, 20) - 1) * 360 - t * 60;
      pts.push(`${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  })();

  return (
    <svg viewBox="40 50 720 560" className="h-full w-full overflow-visible" aria-hidden>
      {/* Income bar */}
      <motion.g style={{ opacity: incomeOpacity }}>
        <text x={100} y={92} fill="var(--muted)" fontSize="13" fontFamily="var(--font-geist-mono)" letterSpacing="1.5">
          REVENU DU MOIS · 200 000 F
        </text>
        <rect x={100} y={108} width={600} height={30} rx={15} fill="var(--line)" />
        <motion.rect x={100} y={108} height={30} rx={15} style={{ width: incomeW }} fill="url(#income)" />
        <defs>
          <linearGradient id="income" x1="0" x2="1">
            <stop offset="0" stopColor="#f6d58e" />
            <stop offset="0.5" stopColor="#e9b44c" />
            <stop offset="0.8" stopColor="#e9b44c" />
            <stop offset="0.8" stopColor="#6fd39a" />
            <stop offset="1" stopColor="#6fd39a" />
          </linearGradient>
        </defs>
      </motion.g>

      <FallingCoins opacity={coinsOpacity} />

      <Jar x={90} level={needs} share="50 %" label="Besoins" color="#e9b44c" opacity={sideJars} />
      <Jar x={340} level={wants} share="30 %" label="Envies & famille" color="#f6d58e" opacity={sideJars} />
      <Jar x={590} level={saveLevel} share="20 %" label="Épargne" color="#6fd39a" opacity={saveOpacity} tx={saveX} scale={saveScale} />

      {/* Protection ring around the (now centred) savings jar */}
      <motion.g style={{ opacity: ringOpacity }}>
        <circle cx={400} cy={405} r={210} fill="none" stroke="var(--line)" strokeWidth={10} />
        <motion.circle
          cx={400}
          cy={405}
          r={210}
          fill="none"
          stroke="#6fd39a"
          strokeWidth={10}
          strokeLinecap="round"
          style={{ pathLength: ring, rotate: -90, transformOrigin: "400px 405px" }}
        />
        {[1, 2, 3, 4, 5, 6].map((m) => {
          const a = (m / 6) * Math.PI * 2 - Math.PI / 2;
          return (
            <text
              key={m}
              x={400 + Math.cos(a) * 248}
              y={405 + Math.sin(a) * 248 + 5}
              textAnchor="middle"
              fill="var(--muted)"
              fontSize="13"
              fontFamily="var(--font-geist-mono)"
            >
              {m}m
            </text>
          );
        })}
        <text x={400} y={110} textAnchor="middle" fill="var(--cream)" fontSize="34" fontFamily="var(--font-avant-garde)">
          <Counter value={months} format={(v) => `${v.toFixed(1).replace(".", ",")} mois`} />
        </text>
        <text x={400} y={136} textAnchor="middle" fill="var(--muted)" fontSize="12" fontFamily="var(--font-geist-mono)" letterSpacing="1.5">
          DE DÉPENSES ESSENTIELLES COUVERTES
        </text>
      </motion.g>

      {/* Goal road */}
      <motion.g style={{ opacity: roadOpacity }}>
        <path d="M150 470 C 300 470, 300 300, 450 300 S 620 140, 720 140" fill="none" stroke="var(--line-strong)" strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round" />
        <motion.path
          d="M150 470 C 300 470, 300 300, 450 300 S 620 140, 720 140"
          fill="none"
          stroke="#9fb6ff"
          strokeWidth={5}
          strokeLinecap="round"
          style={{ pathLength: road }}
        />
        {[
          { x: 285, y: 420, o: m1, t: "Rentrée", v: "150 000 F", d: "août" },
          { x: 470, y: 293, o: m2, t: "Tabaski", v: "250 000 F", d: "juin" },
          { x: 720, y: 140, o: m3, t: "Terrain", v: "2 000 000 F", d: "dans 3 ans" },
        ].map((m) => (
          <motion.g key={m.t} style={{ opacity: m.o, scale: m.o, transformOrigin: `${m.x}px ${m.y}px` }}>
            <circle cx={m.x} cy={m.y} r={14} fill="var(--ink)" stroke="#9fb6ff" strokeWidth={4} />
            <circle cx={m.x} cy={m.y} r={5} fill="#9fb6ff" />
            <text x={m.x} y={m.y - 52} textAnchor="middle" fill="var(--cream)" fontSize="22" fontFamily="var(--font-avant-garde)">
              {m.t}
            </text>
            <text x={m.x} y={m.y - 30} textAnchor="middle" fill="var(--muted)" fontSize="12" fontFamily="var(--font-geist-mono)">
              {m.v} · {m.d}
            </text>
          </motion.g>
        ))}
      </motion.g>

      {/* Compound curve */}
      <motion.g style={{ opacity: curveOpacity }}>
        {[0, 1, 2, 3].map((k) => (
          <line key={k} x1={90} x2={730} y1={520 - k * 120} y2={520 - k * 120} stroke="var(--line)" strokeDasharray="2 8" />
        ))}
        <path d="M90 520 L730 460" stroke="var(--line-strong)" strokeWidth={2} strokeDasharray="6 8" fill="none" />
        <motion.path d={`${curvePath} L730 520 L90 520 Z`} fill="url(#curve-fill)" style={{ opacity: area }} />
        <motion.path d={curvePath} fill="none" stroke="#e2603b" strokeWidth={5} strokeLinecap="round" style={{ pathLength: curve }} />
        <defs>
          <linearGradient id="curve-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#e2603b" stopOpacity="0.35" />
            <stop offset="1" stopColor="#e2603b" stopOpacity="0" />
          </linearGradient>
        </defs>
        <text x={90} y={110} fill="var(--cream)" fontSize="44" fontFamily="var(--font-avant-garde)">
          <Counter value={total} format={fmtF} />
        </text>
        <text x={90} y={138} fill="var(--muted)" fontSize="12" fontFamily="var(--font-geist-mono)" letterSpacing="1.5">
          25 000 F PAR MOIS · 20 ANS · 6 % PAR AN (EXEMPLE)
        </text>
        {["auj.", "5 ans", "10 ans", "15 ans", "20 ans"].map((t, i) => (
          <text key={t} x={90 + i * 160} y={552} textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"} fill="var(--faint)" fontSize="12" fontFamily="var(--font-geist-mono)">
            {t}
          </text>
        ))}
      </motion.g>
    </svg>
  );
}

/* ─────────── Section ─────────── */

function RailSegment({ p, i, label, active }: { p: MotionValue<number>; i: number; label: string; active: boolean }) {
  const fill = useTransform(p, [i / N, (i + 1) / N], ["0%", "100%"]);
  return (
    <div className="flex-1">
      <div className="h-[3px] overflow-hidden rounded-full bg-line">
        <motion.div className="h-full rounded-full bg-cream" style={{ width: fill }} />
      </div>
      <div className={`mt-3 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-500 sm:text-[11px] ${active ? "text-cream" : "text-faint"}`}>
        {label}
      </div>
    </div>
  );
}

export function SavingsJourney() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.35 });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(N - 1, Math.max(0, Math.floor(v * N))));
  });

  const glow = useTransform(
    p,
    steps.map((_, i) => at(i, 0.5)),
    steps.map((s) => s.accent),
  );
  const s = steps[active];

  return (
    <section ref={ref} id="methode-epargne" className="relative" style={{ height: `${N * 130}svh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* colour wash that follows the step */}
        <motion.div
          className="pointer-events-none absolute top-1/2 right-[-10%] -z-10 aspect-square w-[70vw] -translate-y-1/2 rounded-full opacity-[0.13] blur-[120px]"
          style={{ backgroundColor: glow }}
        />

        {/* giant outlined word behind everything */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[8%] -z-10 overflow-hidden select-none">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={s.word}
              initial={{ y: "40%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-40%", opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="px-5 font-display text-[22vw] leading-none whitespace-nowrap text-transparent sm:px-8 lg:px-14"
              style={{ WebkitTextStroke: "1px var(--line-strong)" }}
            >
              {s.word}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mx-auto grid w-full max-w-[1560px] flex-1 grid-rows-[auto_1fr] items-center gap-4 px-5 pt-24 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-1 lg:gap-16 lg:px-14 lg:pt-20">
          <div className="relative order-2 min-h-[13rem] lg:order-1 lg:min-h-[22rem]">
            <div className="mb-6 hidden items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-muted uppercase lg:flex">
              <span className="size-1.5 rounded-full bg-gold" />
              Une méthode, quatre étapes
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -24, filter: "blur(10px)" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: s.accent }}>
                  {s.kicker}
                </div>
                <h2 className="mt-3 font-display text-[clamp(2rem,4.6vw,5.4rem)] leading-[0.98] text-balance">{s.title}</h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-muted lg:mt-7 lg:text-lg">{s.body}</p>
                <Link
                  href={s.href}
                  className="group mt-6 inline-flex items-center gap-2 text-sm text-cream lg:mt-9"
                >
                  <span className="border-b border-line-strong pb-0.5 transition-colors group-hover:border-cream">Ouvrir la leçon</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="order-1 h-[40svh] lg:order-2 lg:h-[76svh]">
            <Stage p={p} />
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[1560px] gap-3 px-5 pb-8 sm:gap-5 sm:px-8 lg:px-14 lg:pb-10">
          {steps.map((st, i) => (
            <RailSegment key={st.key} p={p} i={i} label={st.word} active={active === i} />
          ))}
        </div>
      </div>
    </section>
  );
}
