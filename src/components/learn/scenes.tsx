"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ComponentType, useEffect, useRef, useState } from "react";
import type { SceneId } from "@/lib/lessons";
import { BalanceScene, BasketScene, FlowsScene, HistoryScene, OrbitScene } from "./scenes-ch1";

/** Every scene is a pure function of playback progress t ∈ [0, 1]. */
type SceneProps = { t: number };

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const range = (t: number, from: number, to: number) => clamp((t - from) / (to - from));
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

const GOLD = "#e9b44c";
const GOLD_SOFT = "#f6d58e";
const EMBER = "#e2603b";
const MINT = "#6fd39a";
const CREAM = "#f3ebdd";
const FAINT = "#6b6458";

function Coin({ x, y, r = 9, opacity = 1 }: { x: number; y: number; r?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <circle r={r} fill={GOLD} stroke="#b8862b" strokeWidth="1.5" />
      <circle r={r * 0.62} fill="none" stroke={GOLD_SOFT} strokeWidth="1" opacity="0.8" />
    </g>
  );
}

/* ───────────── 50/30/20 : coins pouring into three jars ───────────── */

const jars = [
  { x: 150, share: 0.5, label: "Besoins", pct: "50 %", color: GOLD, at: 0.22 },
  { x: 320, share: 0.3, label: "Envies", pct: "30 %", color: EMBER, at: 0.42 },
  { x: 490, share: 0.2, label: "Épargne", pct: "20 %", color: MINT, at: 0.62 },
];
const route = [0, 1, 0, 2, 0, 1, 0, 1, 0, 2];

function JarsScene({ t }: SceneProps) {
  const fill = easeOut(range(t, 0.08, 0.85));
  return (
    <svg viewBox="0 0 640 360" className="size-full">
      {/* source: the month's income */}
      <g opacity={1 - range(t, 0.85, 0.95) * 0.6}>
        <rect x="250" y="22" width="140" height="34" rx="17" fill="rgb(243 235 221 / 0.08)" stroke="rgb(243 235 221 / 0.15)" />
        <text x="320" y="44" textAnchor="middle" fill={CREAM} fontSize="13" fontFamily="var(--font-geist-mono)">
          Revenu du mois
        </text>
      </g>
      {/* falling coins */}
      {t > 0.04 &&
        t < 0.9 &&
        Array.from({ length: 20 }, (_, i) => {
          const p = (t * 7 + i / 20) % 1;
          const j = jars[route[i % route.length]];
          const x = 320 + (j.x - 320) * easeOut(p);
          const y = 60 + 200 * p * p;
          return <Coin key={i} x={x} y={y} r={7} opacity={p < 0.9 ? 1 : (1 - p) * 10} />;
        })}
      {jars.map((j) => {
        const level = j.share * fill * 1.6; // 50 % → 80 % full
        const h = 120;
        const top = 340 - h;
        const liquid = h * level;
        const show = range(t, j.at, j.at + 0.12);
        return (
          <g key={j.label}>
            <clipPath id={`jar-${j.label}`}>
              <rect x={j.x - 52} y={top} width="104" height={h} rx="20" />
            </clipPath>
            <rect x={j.x - 52} y={top} width="104" height={h} rx="20" fill="rgb(243 235 221 / 0.05)" stroke="rgb(243 235 221 / 0.2)" strokeWidth="1.5" />
            <rect x={j.x - 40} y={top - 12} width="80" height="12" rx="4" fill="rgb(243 235 221 / 0.12)" />
            <g clipPath={`url(#jar-${j.label})`}>
              <rect x={j.x - 60} y={340 - liquid} width="120" height={liquid + 4} fill={j.color} opacity="0.85" />
              <path
                d={`M${j.x - 60} ${340 - liquid} q 15 -6 30 0 t 30 0 t 30 0 t 30 0`}
                fill={j.color}
                transform={`translate(${((t * 400) % 30) - 15} 0)`}
              />
            </g>
            <g opacity={show} transform={`translate(0 ${(1 - show) * 10})`}>
              <text x={j.x} y={top - 48} textAnchor="middle" fill={j.color} fontSize="30" fontFamily="var(--font-avant-garde)">
                {j.pct}
              </text>
              <text x={j.x} y={top - 26} textAnchor="middle" fill={CREAM} fontSize="13" fontFamily="var(--font-geist-mono)" opacity="0.75">
                {j.label}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/* ───────────── Précaution : a shield fills while hazards bounce off ───────────── */

const hazards = [
  { label: "Panne", from: [-40, 90] as const, to: [235, 150] as const },
  { label: "Santé", from: [680, 110] as const, to: [405, 160] as const },
  { label: "Mois creux", from: [680, 300] as const, to: [400, 250] as const },
  { label: "Retard de salaire", from: [-40, 300] as const, to: [240, 250] as const },
];

function ShieldScene({ t }: SceneProps) {
  const fill = easeOut(range(t, 0.15, 0.85));
  const shield = "M320 40 L420 78 Q420 230 320 320 Q220 230 220 78 Z";
  return (
    <svg viewBox="0 0 640 360" className="size-full">
      <defs>
        <clipPath id="shield-clip">
          <path d={shield} />
        </clipPath>
        <radialGradient id="shield-glow">
          <stop offset="0%" stopColor={MINT} stopOpacity="0.35" />
          <stop offset="100%" stopColor={MINT} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="320" cy="180" r={120 + fill * 60} fill="url(#shield-glow)" opacity={fill} />
      <path d={shield} fill="rgb(243 235 221 / 0.05)" />
      <g clipPath="url(#shield-clip)">
        <rect x="200" y={320 - 285 * fill} width="240" height="300" fill={MINT} opacity="0.75" />
        {[1, 2, 3, 4, 5, 6].map((m) => {
          const y = 320 - (285 * m) / 6;
          return (
            <g key={m} opacity={fill * 6 >= m ? 1 : 0.35}>
              <line x1="230" x2="410" y1={y} y2={y} stroke="rgb(10 9 7 / 0.35)" strokeDasharray="3 5" />
              <text x="318" y={y + 15} textAnchor="middle" fontSize="10" fill="rgb(10 9 7 / 0.6)" fontFamily="var(--font-geist-mono)">
                {m} mois
              </text>
            </g>
          );
        })}
      </g>
      <path d={shield} fill="none" stroke={fill > 0.95 ? MINT : CREAM} strokeOpacity={fill > 0.95 ? 1 : 0.35} strokeWidth="3" />
      {hazards.map((h, k) => {
        const p = (t * 2.2 + k / hazards.length) % 1;
        const go = range(p, 0, 0.55);
        const x = h.from[0] + (h.to[0] - h.from[0]) * go;
        const y = h.from[1] + (h.to[1] - h.from[1]) * go;
        const impact = range(p, 0.55, 0.85);
        return (
          <g key={h.label}>
            {impact === 0 ? (
              <g transform={`translate(${x} ${y})`}>
                <circle r="14" fill={EMBER} opacity="0.9" />
                <path d="M-2 -8 L4 -1 L-1 0 L2 8 L-5 0 L0 -1 Z" fill={CREAM} />
                <text y="-22" textAnchor="middle" fontSize="11" fill={CREAM} fontFamily="var(--font-geist-mono)" opacity="0.8">
                  {h.label}
                </text>
              </g>
            ) : (
              <circle cx={h.to[0]} cy={h.to[1]} r={10 + impact * 34} fill="none" stroke={fill > 0.2 ? MINT : EMBER} strokeWidth={3 * (1 - impact)} opacity={1 - impact} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ───────────── Objectif : a road to the flag, coin milestones ───────────── */

const P = [
  [50, 310],
  [300, 360],
  [200, 70],
  [585, 80],
] as const;
function bezier(s: number) {
  const u = 1 - s;
  const a = u * u * u, b = 3 * u * u * s, c = 3 * u * s * s, d = s * s * s;
  return [a * P[0][0] + b * P[1][0] + c * P[2][0] + d * P[3][0], a * P[0][1] + b * P[1][1] + c * P[2][1] + d * P[3][1]];
}
const roadD = `M${P[0][0]} ${P[0][1]} C${P[1][0]} ${P[1][1]} ${P[2][0]} ${P[2][1]} ${P[3][0]} ${P[3][1]}`;

function RoadScene({ t }: SceneProps) {
  const s = easeOut(range(t, 0.08, 0.88));
  const [x, y] = bezier(s);
  const goal = 720_000;
  const saved = Math.round((120_000 + 600_000 * s) / 1000) * 1000;
  return (
    <svg viewBox="0 0 640 360" className="size-full">
      <path d={roadD} fill="none" stroke="rgb(243 235 221 / 0.08)" strokeWidth="34" strokeLinecap="round" />
      <path d={roadD} fill="none" stroke="rgb(243 235 221 / 0.25)" strokeWidth="1.5" strokeDasharray="8 10" />
      <path d={roadD} fill="none" stroke={GOLD} strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray={`${s} 1`} />
      {[0.25, 0.5, 0.75].map((m, i) => {
        const [mx, my] = bezier(m);
        const passed = s >= m;
        const pop = range(s, m, m + 0.06);
        return (
          <g key={m}>
            <Coin x={mx} y={my - (passed ? 30 * pop : 0)} r={passed ? 11 : 9} opacity={passed ? 1 - pop * 0.6 : 0.5} />
            <text x={mx} y={my + 28} textAnchor="middle" fontSize="11" fill={passed ? GOLD_SOFT : FAINT} fontFamily="var(--font-geist-mono)">
              mois {(i + 1) * 3}
            </text>
          </g>
        );
      })}
      {/* flag */}
      <g transform="translate(585 80)">
        <line x1="0" y1="0" x2="0" y2="-62" stroke={CREAM} strokeWidth="3" strokeLinecap="round" />
        <path d={`M2 -60 Q 22 ${-66 + Math.sin(t * 40) * 4} 44 -58 L 44 -34 Q 22 ${-40 + Math.sin(t * 40 + 1) * 4} 2 -34 Z`} fill={s > 0.99 ? MINT : GOLD} />
        <text x="0" y="28" textAnchor="middle" fontSize="12" fill={CREAM} fontFamily="var(--font-geist-mono)">
          Moto · 12 mois
        </text>
      </g>
      {/* traveller */}
      <g transform={`translate(${x} ${y})`}>
        <circle r="18" fill={GOLD} opacity="0.2" />
        <circle r="9" fill={GOLD_SOFT} stroke={CREAM} strokeWidth="2" />
      </g>
      <g transform="translate(40 40)">
        <text fontSize="11" fill={FAINT} fontFamily="var(--font-geist-mono)">
          ÉPARGNÉ
        </text>
        <text y="30" fontSize="26" fill={CREAM} fontFamily="var(--font-avant-garde)">
          {saved.toLocaleString("fr-FR")} <tspan fill={FAINT} fontSize="14">/ {goal.toLocaleString("fr-FR")} FCFA</tspan>
        </text>
      </g>
    </svg>
  );
}

/* ───────────── Investissement : a compounding curve grows a tree ───────────── */

const YEARS = 30;
const values = Array.from({ length: YEARS }, (_, i) => {
  const months = (i + 1) * 12;
  const r = 0.06 / 12;
  return 25_000 * ((Math.pow(1 + r, months) - 1) / r);
});
const VMAX = values[YEARS - 1];

function GrowthScene({ t }: SceneProps) {
  const s = range(t, 0.05, 0.9);
  const shown = Math.max(1, Math.round(s * YEARS));
  const value = values[shown - 1];
  const bx = (i: number) => 40 + i * 13;
  const by = (v: number) => 320 - (v / VMAX) * 220;
  const curve = values
    .slice(0, shown)
    .map((v, i) => `${i ? "L" : "M"}${bx(i) + 5} ${by(v)}`)
    .join(" ");
  const tree = clamp(value / VMAX);
  return (
    <svg viewBox="0 0 640 360" className="size-full">
      {/* ghost of the full 30-year path, so the frame has shape from the first second */}
      {values.map((v, i) => (
        <rect key={`ghost-${i}`} x={bx(i)} width="10" y={by(v)} height={320 - by(v)} rx="2" fill="none" stroke="rgb(243 235 221 / 0.07)" strokeDasharray="2 3" />
      ))}
      {values.map((v, i) => (
        <rect
          key={i}
          x={bx(i)}
          width="10"
          y={i < shown ? by(v) : 320}
          height={i < shown ? 320 - by(v) : 0}
          rx="2"
          fill={i === shown - 1 ? GOLD_SOFT : GOLD}
          opacity={i < shown ? 0.25 + (i / YEARS) * 0.6 : 0}
        />
      ))}
      <path d={curve} fill="none" stroke={GOLD_SOFT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* tree */}
      <g transform="translate(545 320)">
        <line x1="0" y1="0" x2="0" y2={-30 - tree * 70} stroke="#8a6a3a" strokeWidth={4 + tree * 6} strokeLinecap="round" />
        {[
          [0, -60, 34],
          [-30, -40, 24],
          [30, -42, 26],
          [-14, -86, 22],
          [18, -80, 24],
        ].map(([cx, cy, r], i) => {
          const g = range(tree, i * 0.12, i * 0.12 + 0.4);
          return <circle key={i} cx={cx} cy={cy * (0.5 + tree * 0.6)} r={r * g} fill={i % 2 ? "#4fb57d" : MINT} opacity={0.9} />;
        })}
        {tree > 0.6 &&
          [
            [-18, -70],
            [14, -58],
            [2, -92],
          ].map(([cx, cy], i) => (
            <Coin key={i} x={cx} y={cy * (0.5 + tree * 0.6)} r={5 * range(tree, 0.6 + i * 0.1, 0.8 + i * 0.1)} />
          ))}
        <line x1="-60" x2="60" y1="0" y2="0" stroke="rgb(243 235 221 / 0.2)" />
      </g>
      <g transform="translate(40 40)">
        <text fontSize="11" fill={FAINT} fontFamily="var(--font-geist-mono)">
          ANNÉE {shown} · 25 000 FCFA / MOIS · 6 %
        </text>
        <text y="32" fontSize="28" fill={GOLD_SOFT} fontFamily="var(--font-avant-garde)">
          {(Math.round(value / 1000) * 1000).toLocaleString("fr-FR")} FCFA
        </text>
      </g>
    </svg>
  );
}

const scenes: Record<SceneId, ComponentType<SceneProps>> = {
  jars: JarsScene,
  shield: ShieldScene,
  road: RoadScene,
  growth: GrowthScene,
  orbit: OrbitScene,
  history: HistoryScene,
  basket: BasketScene,
  flows: FlowsScene,
  balance: BalanceScene,
};

/* ───────────── Player ───────────── */

const DURATION = 22_000;

/** The lesson's "video": an animated scene with captions and player controls. Always dark. */
export function LessonHero({
  scene,
  captions,
  title,
  minutes,
  chapters = [],
  fullBleed = false,
}: {
  scene: SceneId;
  captions: string[];
  title: string;
  minutes: number;
  /** Video chapters, shown as segments of the progress bar (the lesson's sections). */
  chapters?: { id: string; title: string }[];
  /** Edge to edge, filling the viewport under the header. */
  fullBleed?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const [t, setT] = useState(reduced ? 1 : 0);
  const [playing, setPlaying] = useState(!reduced);
  const last = useRef<number | null>(null);
  const tRef = useRef(t);
  const Scene = scenes[scene];

  const seek = (v: number) => {
    tRef.current = clamp(v);
    setT(tRef.current);
  };

  useEffect(() => {
    if (!playing) {
      last.current = null;
      return;
    }
    let frame = requestAnimationFrame(function tick(now) {
      const dt = last.current === null ? 0 : now - last.current;
      last.current = now;
      tRef.current = Math.min(1, tRef.current + dt / DURATION);
      setT(tRef.current);
      if (tRef.current >= 1) setPlaying(false);
      else frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const caption = captions[Math.min(captions.length - 1, Math.floor(t * captions.length))];
  const segs = chapters.length ? chapters : [{ id: "all", title }];
  const n = segs.length;
  const currentSeg = Math.min(n - 1, Math.floor(t * n));
  const secs = Math.round(t * minutes * 60);
  const total = `${minutes}:00`;

  return (
    <div
      data-theme="dark"
      className={`relative overflow-hidden bg-[radial-gradient(90%_90%_at_50%_100%,#2a1f0e,#0b0a08)] text-cream ${
        fullBleed ? "" : "rounded-3xl border border-line shadow-[0_40px_100px_-40px_rgb(0_0_0/0.8)]"
      }`}
    >
      <div className="hairline-grid absolute inset-0 opacity-30" />
      <div className={`relative ${fullBleed ? "aspect-[4/3] sm:aspect-video md:aspect-auto md:h-[calc(100svh-3.5rem)] md:min-h-[480px]" : "aspect-[4/3] sm:aspect-video"}`}>
        <div className="absolute top-4 right-24 left-5 z-10 truncate font-mono text-xs tracking-[0.2em] text-muted uppercase">{title}</div>
        <div className={`absolute inset-0 ${fullBleed ? "px-4 pt-12 pb-24 md:px-16" : "px-2 pt-6 pb-14"}`}>
          <Scene t={t} />
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={caption}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.35 }}
            className={`absolute inset-x-0 z-10 px-6 text-center ${fullBleed ? "bottom-20 text-sm sm:text-base md:bottom-24 md:text-xl" : "bottom-14 text-sm sm:text-base"}`}
          >
            <span className="rounded-md bg-black/80 px-3 py-1 leading-loose [box-decoration-break:clone]">{caption}</span>
          </motion.p>
        </AnimatePresence>

        <AnimatePresence>
          {!playing && t >= 1 && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => {
                seek(0);
                setPlaying(true);
              }}
              className="absolute top-4 right-4 z-10 rounded-full bg-cream/10 px-3 py-1.5 font-mono text-xs text-cream backdrop-blur-md hover:bg-cream/20"
            >
              Revoir ↺
            </motion.button>
          )}
        </AnimatePresence>

        <div className={`absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 bg-gradient-to-t from-black/75 to-transparent pt-10 ${fullBleed ? "px-4 pb-4 md:px-8 md:pb-6" : "px-4 pb-3"}`}>
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (t >= 1) seek(0);
              setPlaying((p) => !p);
            }}
            className="grid size-8 place-items-center rounded-full bg-cream text-ink"
            aria-label={playing ? "Pause" : "Lecture"}
          >
            {playing ? (
              <svg viewBox="0 0 10 10" className="size-2.5 fill-current" aria-hidden>
                <rect x="1" width="3" height="10" />
                <rect x="6" width="3" height="10" />
              </svg>
            ) : (
              <svg viewBox="0 0 10 12" className="ml-0.5 size-2.5 fill-current" aria-hidden>
                <path d="M0 0l10 6-10 6z" />
              </svg>
            )}
          </motion.button>
          {/* Chapter-segmented timeline: one segment per section of the lesson. */}
          <div
            className="relative flex flex-1 cursor-pointer items-center gap-1 py-2"
            role="slider"
            aria-label="Progression de la vidéo"
            aria-valuenow={Math.round(t * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${Math.round(t * 100)} %, chapitre : ${segs[currentSeg].title}`}
            tabIndex={0}
            onPointerDown={(e) => {
              const b = e.currentTarget.getBoundingClientRect();
              seek((e.clientX - b.left) / b.width);
            }}
            onPointerMove={(e) => {
              const b = e.currentTarget.getBoundingClientRect();
              setHover(Math.min(n - 1, Math.max(0, Math.floor(((e.clientX - b.left) / b.width) * n))));
            }}
            onPointerLeave={() => setHover(null)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") seek(t + 0.05);
              if (e.key === "ArrowLeft") seek(t - 0.05);
              if (e.key === "PageDown") seek((currentSeg + 1) / n);
              if (e.key === "PageUp") seek(Math.max(0, currentSeg - (t * n - currentSeg < 0.15 ? 1 : 0)) / n);
            }}
          >
            {segs.map((sg, i) => {
              const fill = clamp((t - i / n) * n);
              const lit = hover === i;
              return (
                <div key={sg.id} className="relative flex-1">
                  <motion.div
                    className="overflow-hidden rounded-full bg-white/20"
                    animate={{ height: lit ? 8 : 5 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <div className="h-full bg-gold" style={{ width: `${fill * 100}%` }} />
                  </motion.div>
                  <AnimatePresence>
                    {lit && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.18 }}
                        className={`pointer-events-none absolute bottom-5 z-20 w-max max-w-[16rem] rounded-lg bg-black/90 px-3 py-2 text-left shadow-xl ${
                          i === 0 ? "left-0" : i === n - 1 ? "right-0" : "left-1/2 -translate-x-1/2"
                        }`}
                      >
                        <span className="block font-mono text-[11px] text-gold">
                          {i + 1}/{n} · {Math.floor((i / n) * minutes)}:00
                        </span>
                        <span className="block text-sm text-cream">{sg.title}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          <span className="shrink-0 font-mono text-xs text-cream/75 tabular-nums">
            {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")} / {total}
          </span>
          {chapters.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.span
                key={currentSeg}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="hidden max-w-[14rem] shrink-0 truncate text-sm text-cream/85 md:block"
              >
                · {segs[currentSeg].title}
              </motion.span>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
