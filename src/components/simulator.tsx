"use client";

import { motion, useMotionValueEvent, useSpring } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { fcfa, simulateGrowth } from "@/lib/finance";
import { Eyebrow, Reveal } from "./reveal";


const W = 800;
const H = 340;
const PAD = { t: 20, r: 12, b: 32, l: 12 };
const SAMPLES = 64; // fixed point count so paths can morph smoothly

function AnimatedAmount({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const spring = useSpring(value, { stiffness: 70, damping: 20 });
  useEffect(() => spring.set(value), [spring, value]);
  useMotionValueEvent(spring, "change", (v) => {
    if (ref.current) ref.current.textContent = fcfa.format(v);
  });
  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {fcfa.format(value)}
    </span>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <span className="mb-3 flex items-baseline justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-mono text-cream tabular-nums">{format(value)}</span>
      </span>
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
      />
    </label>
  );
}

export function Simulator() {
  const [initial, setInitial] = useState(100000);
  const [monthly, setMonthly] = useState(25000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(6);
  const [hover, setHover] = useState<number | null>(null);

  const data = useMemo(() => simulateGrowth(initial, monthly, years, rate, SAMPLES), [initial, monthly, years, rate]);
  const last = data[data.length - 1];
  const interest = last.total - last.paid;
  const late = years > 10 ? simulateGrowth(initial, monthly, years - 10, rate, SAMPLES).at(-1)! : null;

  const maxY = Math.max(last.total, 1) * 1.08;
  const x = (i: number) => PAD.l + (i / (SAMPLES - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => H - PAD.b - (v / maxY) * (H - PAD.t - PAD.b);

  const line = (key: "paid" | "total") =>
    data.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");
  const area = (key: "paid" | "total") =>
    `${line(key)} L${x(SAMPLES - 1).toFixed(1)},${H - PAD.b} L${x(0).toFixed(1)},${H - PAD.b} Z`;

  const hovered = hover !== null ? data[hover] : null;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const rel = ((e.clientX - box.left) / box.width) * W;
    const i = Math.round(((rel - PAD.l) / (W - PAD.l - PAD.r)) * (SAMPLES - 1));
    setHover(Math.max(0, Math.min(SAMPLES - 1, i)));
  };

  const spring = { type: "spring", stiffness: 90, damping: 20 } as const;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * years));

  return (
    <section id="simulateur" className="mx-auto max-w-[1560px] px-5 py-24 sm:px-6 md:py-32">
      <Reveal>
        <Eyebrow>Essayez maintenant</Eyebrow>
        <h2 className="mt-6 max-w-3xl font-display text-[clamp(2.5rem,5.8vw,6.6rem)] leading-[1] tracking-[-0.015em]">
          La huitième merveille du monde, <em className="text-gold">entre vos mains.</em>
        </h2>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Bougez les curseurs. C&apos;est votre argent, votre courbe.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-14 overflow-hidden rounded-[28px] border border-line bg-ink-2">
        <div className="grid lg:grid-cols-[320px_1fr]">
          <div className="space-y-8 border-b border-line p-6 sm:p-8 lg:border-r lg:border-b-0">
            <Slider label="Capital de départ" value={initial} min={0} max={5000000} step={50000} format={fcfa.format} onChange={setInitial} />
            <Slider label="Versement mensuel" value={monthly} min={0} max={500000} step={5000} format={fcfa.format} onChange={setMonthly} />
            <Slider label="Durée" value={years} min={1} max={45} step={1} format={(v) => `${v} ans`} onChange={setYears} />
            <Slider
              label="Rendement annuel"
              value={rate}
              min={0}
              max={12}
              step={0.5}
              format={(v) => `${v.toLocaleString("fr-FR")} %`}
              onChange={setRate}
            />
            <p className="border-t border-line pt-6 font-mono text-[11px] leading-relaxed text-faint">
              Exemple pédagogique. Rendement non garanti, pas un conseil en investissement.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
                  Dans {years} ans
                </div>
                <AnimatedAmount value={last.total} className="mt-2 block font-display text-[clamp(2.1rem,5vw,4.2rem)] leading-none" />
              </div>
              <div className="flex gap-8 text-sm">
                <div>
                  <div className="flex items-center gap-2 text-muted">
                    <span className="size-2 rounded-full bg-cream/50" /> Versé
                  </div>
                  <AnimatedAmount value={last.paid} className="mt-1 block text-lg" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted">
                    <span className="size-2 rounded-full bg-gold" /> Intérêts
                  </div>
                  <AnimatedAmount value={interest} className="mt-1 block text-lg text-gold" />
                </div>
              </div>
            </div>

            <div className="relative mt-8">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full touch-none select-none"
                onPointerMove={onMove}
                onPointerLeave={() => setHover(null)}
                role="img"
                aria-label={`Projection : ${fcfa.format(last.total)} après ${years} ans, dont ${fcfa.format(interest)} d'intérêts.`}
              >
                <defs>
                  <linearGradient id="g-total" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#e9b44c" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#e9b44c" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0.25, 0.5, 0.75, 1].map((f) => (
                  <line key={f} x1={PAD.l} x2={W - PAD.r} y1={y(maxY * f / 1.08)} y2={y(maxY * f / 1.08)} stroke="var(--line)" strokeDasharray="2 6" />
                ))}
                <motion.path initial={false} animate={{ d: area("total") }} transition={spring} fill="url(#g-total)" />
                <motion.path initial={false} animate={{ d: area("paid") }} transition={spring} fill="color-mix(in oklab, var(--cream) 7%, transparent)" />
                <motion.path initial={false} animate={{ d: line("paid") }} transition={spring} fill="none" stroke="color-mix(in oklab, var(--cream) 45%, transparent)" strokeWidth="1.5" strokeDasharray="4 5" />
                <motion.path initial={false} animate={{ d: line("total") }} transition={spring} fill="none" stroke="#e9b44c" strokeWidth="2.5" strokeLinecap="round" />
                <motion.circle initial={false} animate={{ cx: x(SAMPLES - 1), cy: y(last.total) }} transition={spring} r="5" fill="#f6d58e" />

                {hovered && hover !== null && (
                  <g>
                    <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} stroke="var(--line-strong)" />
                    <circle cx={x(hover)} cy={y(hovered.total)} r="5" fill="var(--ink)" stroke="#e9b44c" strokeWidth="2" />
                    <circle cx={x(hover)} cy={y(hovered.paid)} r="4" fill="var(--ink)" stroke="color-mix(in oklab, var(--cream) 60%, transparent)" strokeWidth="1.5" />
                  </g>
                )}
                {ticks.map((t, i) => (
                  <text key={i} x={PAD.l + (i / 4) * (W - PAD.l - PAD.r)} y={H - 8} fill="var(--faint)" fontSize="12" fontFamily="var(--font-geist-mono)" textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"}>
                    {t === 0 ? "auj." : `${t} ans`}
                  </text>
                ))}
              </svg>

              {hovered && hover !== null && (
                <div
                  className="pointer-events-none absolute top-0 rounded-xl border border-line-strong bg-ink/90 px-3 py-2 font-mono text-[11px] backdrop-blur-md"
                  style={{
                    left: `${(x(hover) / W) * 100}%`,
                    transform: `translateX(${hover > SAMPLES / 2 ? "calc(-100% - 12px)" : "12px"})`,
                  }}
                >
                  <div className="text-muted">Année {hovered.year.toFixed(1).replace(".0", "").replace(".", ",")}</div>
                  <div className="text-gold">{fcfa.format(hovered.total)}</div>
                  <div className="text-cream/60">dont {fcfa.format(hovered.paid)} versés</div>
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-ink-3/60 p-4">
                <div className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">Effet multiplicateur</div>
                <div className="mt-2 text-sm text-cream/80">
                  Chaque franc versé devient{" "}
                  <span className="font-mono text-gold">
                    {(last.paid > 0 ? last.total / last.paid : 1).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} FCFA
                  </span>
                  . Le reste, c&apos;est le temps qui travaille.
                </div>
              </div>
              <div className="rounded-2xl border border-ember/25 bg-ember/[0.06] p-4">
                <div className="font-mono text-[11px] tracking-[0.18em] text-ember uppercase">Le prix de l&apos;attente</div>
                <div className="mt-2 text-sm text-cream/80">
                  {late ? (
                    <>
                      Commencer dans 10 ans vous coûterait{" "}
                      <span className="font-mono text-ember">{fcfa.format(last.total - late.total)}</span>.
                    </>
                  ) : (
                    "Allongez la durée au-delà de 10 ans pour voir ce que coûte l'attente."
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
