"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { ease } from "@/components/learn/motion";

/** Page title block used at the top of every account tab. */
export function PageHead({ title, text, children }: { title: string; text?: string; children?: React.ReactNode }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="mb-8 flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        <h1 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.02]">{title}</h1>
        {text && <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-cream/80">{text}</p>}
      </div>
      {children}
    </motion.header>
  );
}

export function Card({
  title,
  text,
  children,
  className = "",
  delay = 0,
  action,
}: {
  title?: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  action?: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease, delay }}
      className={`rounded-3xl border border-line bg-ink-2 p-5 sm:p-7 ${className}`}
    >
      {(title || action) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="font-display text-xl leading-tight sm:text-2xl">{title}</h2>}
            {text && <p className="mt-1.5 text-[15px] leading-relaxed text-cream/75">{text}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </motion.section>
  );
}

/** Small pill telling the learner that a block shows illustrative data. */
export function DemoBadge({ label = "Données de démonstration" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-line-strong px-2.5 py-1 text-xs text-muted">
      <span className="size-1.5 rounded-full bg-ember" />
      {label}
    </span>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className={`flex items-center justify-between gap-6 py-3.5 ${disabled ? "opacity-50" : ""}`}>
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="block text-[15px] text-cream">{label}</span>
        {hint && <span className="mt-0.5 block text-[13px] leading-snug text-muted">{hint}</span>}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${checked ? "bg-mint" : "bg-cream/15"}`}
      >
        <motion.span
          className="absolute top-1 left-1 size-5 rounded-full bg-white shadow"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
        />
      </button>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-cream/85">
        {label}
      </label>
      {children(id)}
      {hint && <p className="mt-1.5 text-[13px] text-muted">{hint}</p>}
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line-strong bg-ink px-4 py-3 text-[15px] text-cream outline-none transition-colors placeholder:text-muted/70 focus:border-gold";

/** Generic pill switch (glides between options). Options can be disabled with a reason. */
export function Choice<T extends string | number>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; disabled?: string }[];
  label: string;
}) {
  const id = useId();
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-2xl border border-line bg-ink p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={!!o.disabled}
            onClick={() => onChange(o.value)}
            className={`relative rounded-xl px-4 py-2 text-sm transition-colors disabled:cursor-not-allowed ${
              active ? "text-ink" : o.disabled ? "text-muted/70" : "text-cream/80 hover:text-cream"
            }`}
          >
            {active && (
              <motion.span layoutId={`choice-${id}`} className="absolute inset-0 rounded-xl bg-cream" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
            )}
            <span className="relative">
              {o.label}
              {o.disabled && <span className="ml-1.5 text-xs">· {o.disabled}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Lightweight toast: call show("…") and it slides in for a few seconds. */
export function useToast() {
  const [msg, setMsg] = useState<{ text: string; key: number } | null>(null);
  const show = (text: string) => {
    const key = Date.now();
    setMsg({ text, key });
    setTimeout(() => setMsg((m) => (m?.key === key ? null : m)), 2800);
  };
  const node = (
    <AnimatePresence>
      {msg && (
        <motion.div
          key={msg.key}
          role="status"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="fixed bottom-6 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-3 rounded-full border border-line-strong bg-ink-2/95 px-5 py-3 text-[15px] shadow-2xl backdrop-blur-xl"
        >
          <span className="grid size-6 place-items-center rounded-full bg-mint text-[#0a0907]">
            <svg viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 8.5 6.5 12 13 4.5" />
            </svg>
          </span>
          {msg.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
  return { show, node };
}

export function Avatar({ name, color, size = 40 }: { name: string; color: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-display text-[#0a0907]"
      style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}
      aria-hidden
    >
      {name}
    </span>
  );
}

/** Animated ring gauge (0..1). */
export function Ring({ value, size = 160, stroke = 12, color = "var(--gold)", children }: { value: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line-strong)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: Math.max(0.001, value) }}
          transition={{ duration: 1.4, ease }}
        />
      </svg>
      <div className="relative text-center">{children}</div>
    </div>
  );
}
