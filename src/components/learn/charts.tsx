"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useId, useRef, useState } from "react";
import type { GrowthPoint } from "@/lib/finance";
import { spring } from "./motion";

export type Segment = { label: string; value: number; color: string };

/* ───────────────────────── Donut ───────────────────────── */

export function Donut({
  segments,
  size = 220,
  thickness = 26,
  children,
}: {
  segments: Segment[];
  size?: number;
  thickness?: number;
  children?: React.ReactNode;
}) {
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  const total = segments.reduce((n, s) => n + Math.max(0, s.value), 0) || 1;
  const gap = segments.length > 1 ? 4 : 0;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const starts = segments.map((_, i) =>
    segments.slice(0, i).reduce((n, s) => n + (Math.max(0, s.value) / total) * C, 0),
  );

  return (
    <div ref={ref} className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={thickness} />
        {segments.map((s, i) => {
          const len = inView ? Math.max(0, (Math.max(0, s.value) / total) * C - gap) : 0;
          const offset = starts[i];
          return (
            <motion.circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeLinecap="butt"
              initial={{ strokeDasharray: `0 ${C}`, strokeDashoffset: -offset }}
              animate={{ strokeDasharray: `${len} ${C - len}`, strokeDashoffset: -offset }}
              transition={{ ...spring, delay: inView ? i * 0.12 : 0 }}
            />
          );
        })}
      </svg>
      <div className="relative text-center">{children}</div>
    </div>
  );
}

/* ───────────────────────── Stacked bar ───────────────────────── */

export function StackedBar({
  segments,
  height = "h-12",
  showLabels = true,
}: {
  segments: Segment[];
  height?: string;
  showLabels?: boolean;
}) {
  const total = segments.reduce((n, s) => n + Math.max(0, s.value), 0) || 1;
  return (
    <div className={`flex w-full gap-1 overflow-hidden rounded-xl ${height}`}>
      {segments.map((s) => {
        const pct = (Math.max(0, s.value) / total) * 100;
        return (
          <motion.div
            key={s.label}
            className="relative flex min-w-0 items-center overflow-hidden rounded-lg px-3"
            style={{ background: s.color }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={spring}
          >
            {showLabels && pct > 12 && (
              <span className="truncate font-mono text-xs font-medium text-on-gold/80 tabular-nums">
                {Math.round(pct)} %
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Jar (fill gauge) ───────────────────────── */

export function Jar({
  level,
  color = "var(--gold)",
  marks = [],
  className = "w-40",
  label,
}: {
  /** 0 → 1 */
  level: number;
  color?: string;
  marks?: { at: number; label: string }[];
  className?: string;
  label?: React.ReactNode;
}) {
  const id = useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  const clamped = Math.max(0, Math.min(1, level));
  // Jar interior spans y = 30 → 190 in a 140×200 box.
  const top = 30;
  const bottom = 190;
  const y = bottom - clamped * (bottom - top);
  const shape = "M30 30 Q30 20 40 20 L100 20 Q110 20 110 30 L110 40 Q130 52 130 80 L130 175 Q130 195 110 195 L30 195 Q10 195 10 175 L10 80 Q10 52 30 40 Z";

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 140 205" className="w-full overflow-visible" aria-hidden>
        <defs>
          <clipPath id={`jar-${id}`}>
            <path d={shape} />
          </clipPath>
          <linearGradient id={`liq-${id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={color} stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <path d={shape} fill="var(--ink-3)" />
        <g clipPath={`url(#jar-${id})`}>
          <motion.g initial={{ y: bottom + 10 }} animate={{ y }} transition={{ type: "spring", stiffness: 60, damping: 16 }}>
            <motion.path
              d="M-140 0 Q-122 -7 -105 0 T-70 0 T-35 0 T0 0 T35 0 T70 0 T105 0 T140 0 T175 0 T210 0 L210 220 L-140 220 Z"
              fill={`url(#liq-${id})`}
              animate={reduced ? undefined : { x: [0, 70] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            />
          </motion.g>
          {/* bubbles */}
          {!reduced &&
            clamped > 0.05 &&
            [30, 62, 95].map((cx, i) => (
              <motion.circle
                key={cx}
                cx={cx}
                r={2 + i}
                fill="rgb(255 255 255 / 0.35)"
                initial={{ cy: bottom }}
                animate={{ cy: [bottom, y + 6], opacity: [0, 1, 0] }}
                transition={{ duration: 2.6 + i * 0.7, repeat: Infinity, delay: i * 0.9, ease: "easeOut" }}
              />
            ))}
        </g>
        <path d={shape} fill="none" stroke="var(--line-strong)" strokeWidth="2" />
        <path d="M24 70 Q22 120 26 165" stroke="rgb(255 255 255 / 0.18)" strokeWidth="4" strokeLinecap="round" fill="none" />
        {marks.map((m) => {
          const my = bottom - m.at * (bottom - top);
          return (
            <g key={m.label}>
              <line x1="112" x2="130" y1={my} y2={my} stroke="var(--line-strong)" strokeDasharray="2 3" />
              <text x="136" y={my + 3} fontSize="9" fill="var(--faint)" fontFamily="var(--font-geist-mono)">
                {m.label}
              </text>
            </g>
          );
        })}
      </svg>
      {label && <div className="mt-2 text-center">{label}</div>}
    </div>
  );
}

/* ───────────────────────── Growth chart ───────────────────────── */

const W = 720;
const H = 300;
const PAD = { t: 16, r: 8, b: 28, l: 8 };

export function GrowthChart({
  data,
  format,
  paidLabel = "Versé",
  totalLabel = "Total",
}: {
  data: GrowthPoint[];
  format: (v: number) => string;
  paidLabel?: string;
  totalLabel?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const id = useId().replace(/:/g, "");
  const n = data.length;
  const last = data[n - 1];
  const maxY = Math.max(last.total, 1) * 1.08;
  const x = (i: number) => PAD.l + (i / (n - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => H - PAD.b - (v / maxY) * (H - PAD.t - PAD.b);
  const line = (k: "paid" | "total") =>
    data.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p[k]).toFixed(1)}`).join(" ");
  const area = (k: "paid" | "total") => `${line(k)} L${x(n - 1)},${H - PAD.b} L${x(0)},${H - PAD.b} Z`;
  const years = last.year;
  const h = hover !== null ? data[hover] : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none select-none"
        onPointerMove={(e) => {
          const b = e.currentTarget.getBoundingClientRect();
          const rel = ((e.clientX - b.left) / b.width) * W;
          setHover(Math.max(0, Math.min(n - 1, Math.round(((rel - PAD.l) / (W - PAD.l - PAD.r)) * (n - 1)))));
        }}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label={`${totalLabel} : ${format(last.total)} après ${Math.round(years)} ans`}
      >
        <defs>
          <linearGradient id={`gt-${id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={PAD.l} x2={W - PAD.r} y1={y((maxY / 1.08) * f)} y2={y((maxY / 1.08) * f)} stroke="var(--line)" strokeDasharray="2 6" />
        ))}
        <motion.path initial={false} animate={{ d: area("total") }} transition={spring} fill={`url(#gt-${id})`} />
        <motion.path initial={false} animate={{ d: area("paid") }} transition={spring} fill="color-mix(in oklab, var(--cream) 7%, transparent)" />
        <motion.path initial={false} animate={{ d: line("paid") }} transition={spring} fill="none" stroke="color-mix(in oklab, var(--cream) 45%, transparent)" strokeWidth="1.5" strokeDasharray="4 5" />
        <motion.path
          initial={{ pathLength: 0, d: line("total") }}
          whileInView={{ pathLength: 1 }}
          animate={{ d: line("total") }}
          viewport={{ once: true }}
          transition={{ pathLength: { duration: 1.6, ease: "easeInOut" }, d: spring }}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <motion.circle initial={false} animate={{ cx: x(n - 1), cy: y(last.total) }} transition={spring} r="5" fill="var(--gold-soft)" />
        {h && hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} stroke="var(--line-strong)" />
            <circle cx={x(hover)} cy={y(h.total)} r="5" fill="var(--ink)" stroke="var(--gold)" strokeWidth="2" />
          </g>
        )}
        {[0, 0.5, 1].map((f, i) => (
          <text key={f} x={PAD.l + f * (W - PAD.l - PAD.r)} y={H - 6} fill="var(--faint)" fontSize="12" fontFamily="var(--font-geist-mono)" textAnchor={i === 0 ? "start" : i === 2 ? "end" : "middle"}>
            {f === 0 ? "auj." : `${Math.round(years * f)} ans`}
          </text>
        ))}
      </svg>
      {h && hover !== null && (
        <div
          className="pointer-events-none absolute top-0 rounded-xl border border-line-strong bg-ink/90 px-3 py-2 font-mono text-xs backdrop-blur-md"
          style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > n / 2 ? "calc(-100% - 12px)" : "12px"})` }}
        >
          <div className="text-muted">Année {Math.round(h.year)}</div>
          <div className="text-gold">{totalLabel} {format(h.total)}</div>
          <div className="text-cream/60">{paidLabel} {format(h.paid)}</div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Coin burst ───────────────────────── */

/** A one-shot shower of coins. Change `trigger` to fire again; 0 renders nothing. */
export function CoinBurst({ trigger, count = 16 }: { trigger: number; count?: number }) {
  const reduced = useReducedMotion();
  if (!trigger || reduced) return null;
  return (
    <div key={trigger} className="pointer-events-none absolute inset-0 z-20 overflow-visible" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + (trigger % 7) * 0.3;
        const dist = 70 + ((i * 37) % 60);
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 30;
        return (
          <motion.span
            key={i}
            className="absolute top-1/2 left-1/2 grid size-4 place-items-center rounded-full border border-[#b8862b] bg-[radial-gradient(circle_at_35%_30%,#fff1c4,#e9b44c_55%,#b8862b)] text-[7px] font-bold text-[#7a5410] shadow-md"
            initial={{ x: -8, y: -8, scale: 0, rotate: 0, opacity: 1 }}
            animate={{
              x: [-8, dx - 8, dx * 1.1 - 8],
              y: [-8, dy - 8, dy + 90],
              scale: [0, 1.1, 0.8],
              rotate: [0, 180 + i * 20],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 1.1, ease: [0.2, 0.7, 0.4, 1], times: [0, 0.45, 1] }}
          >
            F
          </motion.span>
        );
      })}
    </div>
  );
}
