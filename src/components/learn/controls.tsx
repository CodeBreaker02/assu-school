"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { fcfa } from "@/lib/finance";

/** Range input with a live, formatted value. Defaults to FCFA amounts. */
export function AmountSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format = fcfa.format,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  hint?: string;
}) {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <label htmlFor={id} className="mb-3 flex items-baseline justify-between gap-4 text-sm">
        <span className="text-muted">{label}</span>
        <motion.span
          key={Math.round(value)}
          initial={{ y: -4, opacity: 0.4 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-mono text-cream tabular-nums"
        >
          {format(value)}
        </motion.span>
      </label>
      <input
        id={id}
        type="range"
        className="slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
      />
      {hint && <p className="mt-2 font-mono text-xs text-muted">{hint}</p>}
    </div>
  );
}

/** Pill switch whose highlight glides between options (shared layoutId). */
export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  const id = useId();
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap rounded-full border border-line bg-ink p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`relative rounded-full px-4 py-2 text-sm transition-colors ${active ? "text-ink" : "text-muted hover:text-cream"}`}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-full bg-cream"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Frame shared by every interactive widget, so they read as one family. */
export function WidgetCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="not-prose my-10 overflow-hidden rounded-3xl border border-line bg-ink-2 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.5)]">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-gold uppercase">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-gold" />
            </span>
            {eyebrow}
          </div>
          <div className="mt-1 font-display text-lg">{title}</div>
        </div>
      </div>
      <div className="p-5 sm:p-7">{children}</div>
    </div>
  );
}
