"use client";

import { motion } from "motion/react";
import { AnimatedNumber, InView, ease, stagger } from "./motion";

/* ───────────────────────── Inline text ───────────────────────── */

/** Renders `**bold**` spans; everything else is plain text. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold text-cream">
            {p.slice(2, -2)}
          </strong>
        ) : (
          p
        ),
      )}
    </>
  );
}

export function Paragraph({ text }: { text: string }) {
  return (
    <InView>
      <p className="my-5 text-[18px] leading-[1.75] text-cream/90">
        <RichText text={text} />
      </p>
    </InView>
  );
}

export function BulletList({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const List = ordered ? motion.ol : motion.ul;
  return (
    <List {...stagger.parent} className="my-6 space-y-3">
      {items.map((item, i) => (
        <motion.li key={i} variants={stagger.child} className="flex gap-4 text-[17px] leading-relaxed text-cream/90">
          {ordered ? (
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gold/15 font-mono text-xs text-gold">
              {i + 1}
            </span>
          ) : (
            <span className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-gold" />
          )}
          <span>
            <RichText text={item} />
          </span>
        </motion.li>
      ))}
    </List>
  );
}

export function SectionHeading({ id, text }: { id: string; text: string }) {
  return (
    <InView y={16} className="mt-16 mb-6 first:mt-0">
      <h2 id={id} className="scroll-mt-28 font-display text-[clamp(1.7rem,3.2vw,2.3rem)] leading-tight">
        {text}
      </h2>
    </InView>
  );
}

/* ───────────────────────── Callout ───────────────────────── */

const tones = {
  info: { label: "À noter", color: "var(--mint)", icon: <path d="M12 8v.01M12 11v5" /> },
  tip: { label: "Astuce", color: "var(--gold)", icon: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3Z" /> },
  warning: { label: "Attention", color: "var(--ember)", icon: <path d="M12 9v4M12 17v.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /> },
} as const;

export function Callout({ tone, title, text }: { tone: keyof typeof tones; title: string; text: string }) {
  const t = tones[tone];
  return (
    <InView className="my-8">
      <div
        className="relative overflow-hidden rounded-2xl border p-5 sm:p-6"
        style={{
          borderColor: `color-mix(in oklab, ${t.color} 30%, transparent)`,
          background: `color-mix(in oklab, ${t.color} 7%, transparent)`,
        }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 w-1 origin-top"
          style={{ background: t.color }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
        />
        <div className="flex gap-4">
          <motion.svg
            viewBox="0 0 24 24"
            className="mt-0.5 size-5 shrink-0 fill-none stroke-[1.8]"
            style={{ stroke: t.color }}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ scale: 0, rotate: -30 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.25 }}
            aria-hidden
          >
            {tone === "info" && <circle cx="12" cy="12" r="9" />}
            {t.icon}
          </motion.svg>
          <div>
            <div className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: t.color }}>
              {t.label}
            </div>
            <div className="mt-1 font-display text-lg">{title}</div>
            <p className="mt-2 text-[16px] leading-relaxed text-cream/85">
              <RichText text={text} />
            </p>
          </div>
        </div>
      </div>
    </InView>
  );
}

/* ───────────────────────── Compare columns ───────────────────────── */

const columnTone = {
  good: { color: "var(--mint)", mark: <path d="M3 8.5 6.5 12 13 4.5" /> },
  bad: { color: "var(--ember)", mark: <path d="M4 4l8 8M12 4l-8 8" /> },
  neutral: { color: "var(--gold)", mark: <circle cx="8" cy="8" r="2.5" /> },
} as const;

export function Compare({
  columns,
}: {
  columns: { title: string; tone: keyof typeof columnTone; items: string[] }[];
}) {
  return (
    <div className={`my-8 grid gap-3 ${columns.length === 3 ? "md:grid-cols-3" : "sm:grid-cols-2"}`}>
      {columns.map((c, ci) => {
        const tone = columnTone[c.tone];
        return (
          <InView key={c.title} delay={ci * 0.08} className="rounded-2xl border border-line bg-ink-2 p-5">
            <div className="flex items-center gap-2 font-display text-lg">
              <span className="size-2 rounded-full" style={{ background: tone.color }} />
              {c.title}
            </div>
            <motion.ul {...stagger.parent} className="mt-4 space-y-2.5">
              {c.items.map((item) => (
                <motion.li key={item} variants={stagger.child} className="flex gap-3 text-[15px] leading-relaxed text-cream/90">
                  <svg viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0 fill-none stroke-2" style={{ stroke: tone.color, fill: c.tone === "neutral" ? tone.color : "none" }} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {tone.mark}
                  </svg>
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </InView>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Worked example ───────────────────────── */

/** "600 000 FCFA" → { n: 600000, suffix: "FCFA" }; null when the value isn't a plain amount. */
function parseAmount(s: string) {
  const m = s.match(/^([\d\s  ]+)\s*([^\d]*)$/);
  if (!m) return null;
  const n = Number(m[1].replace(/[\s  ]/g, ""));
  return Number.isFinite(n) && n > 0 ? { n, suffix: m[2].trim() } : null;
}

/** A calculation that reveals itself line by line, then lands on its result. */
export function WorkedExample({
  title,
  lines,
  result,
  note,
}: {
  title: string;
  lines: [string, string][];
  result: [string, string];
  note?: string;
}) {
  const amount = parseAmount(result[1]);
  return (
    <InView className="my-10">
      <div className="overflow-hidden rounded-3xl border border-line bg-ink-2">
        <div className="flex items-center gap-3 border-b border-line px-5 py-4 sm:px-6">
          <span className="grid size-8 place-items-center rounded-full bg-gold/15 font-mono text-xs text-gold">ex.</span>
          <span className="font-display text-lg leading-tight">{title}</span>
        </div>
        <motion.dl
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.28, delayChildren: 0.2 } } }}
          className="px-5 py-3 text-[15px] sm:px-6"
        >
          {lines.map(([k, v]) => (
            <motion.div
              key={k}
              variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease } } }}
              className="flex items-baseline justify-between gap-4 border-b border-dashed border-line py-3 last:border-0"
            >
              <dt className="text-cream/75">{k}</dt>
              <dd className="text-right font-mono text-cream tabular-nums">{v}</dd>
            </motion.div>
          ))}
          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.96 }, show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 18 } } }}
            className="-mx-5 mt-2 flex flex-wrap items-baseline justify-between gap-3 bg-gold/10 px-5 py-4 sm:-mx-6 sm:px-6"
          >
            <dt className="font-medium text-gold">{result[0]}</dt>
            <dd className="font-display text-2xl text-gold">
              {amount ? (
                <AnimatedNumber value={amount.n} format={(v) => `${Math.round(v).toLocaleString("fr-FR")} ${amount.suffix}`} />
              ) : (
                result[1]
              )}
            </dd>
          </motion.div>
        </motion.dl>
        {note && <p className="border-t border-line px-5 py-4 text-[15px] leading-relaxed text-cream/80 sm:px-6">{note}</p>}
      </div>
    </InView>
  );
}

/* ───────────────────────── Key points ───────────────────────── */

export function KeyPoints({ points }: { points: string[] }) {
  return (
    <InView className="my-14 scroll-mt-28" id="a-retenir">
      <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--gold)_10%,transparent),transparent_60%)] p-6 sm:p-8">
        <div className="font-mono text-xs tracking-[0.2em] text-gold uppercase">À retenir</div>
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.22 } } }}
          className="mt-5 space-y-4"
        >
          {points.map((p) => (
            <motion.li key={p} variants={{ hidden: { opacity: 0.25 }, show: { opacity: 1 } }} className="flex gap-4 text-[17px] leading-relaxed">
              <svg viewBox="0 0 24 24" className="mt-0.5 size-6 shrink-0" aria-hidden>
                <circle cx="12" cy="12" r="11" fill="var(--gold)" opacity="0.15" />
                <motion.path
                  d="M7 12.5l3.2 3.2L17 9"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.5 } } }}
                />
              </svg>
              <span className="text-cream">{p}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </InView>
  );
}
