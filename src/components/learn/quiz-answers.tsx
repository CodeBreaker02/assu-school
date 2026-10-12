"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useId, useState } from "react";
import type { Question } from "@/lib/quiz";

/* ───────────── Answer values & grading ───────────── */

export type MatchValue = { matched: number[]; mistakes: number };
export type AnswerValue = number | boolean | string | number[] | MatchValue | null;

export function initialValue(q: Question): AnswerValue {
  if (q.type === "numeric") return "";
  if (q.type === "order") return [];
  if (q.type === "match") return { matched: [], mistakes: 0 };
  return null;
}

const parseNumber = (s: string) => Number(s.replace(/[\s  ]/g, "").replace(",", "."));

export function isAnswered(q: Question, v: AnswerValue) {
  switch (q.type) {
    case "numeric":
      return typeof v === "string" && v.trim() !== "" && Number.isFinite(parseNumber(v));
    case "order":
      return Array.isArray(v) && v.length === q.items.length;
    case "match":
      return (v as MatchValue).matched.length === q.pairs.length;
    default:
      return v !== null;
  }
}

export function isCorrect(q: Question, v: AnswerValue) {
  switch (q.type) {
    case "choice":
    case "fill":
      return v === q.answer;
    case "truefalse":
      return v === q.answer;
    case "numeric":
      return Math.abs(parseNumber(v as string) - q.answer) <= (q.tolerance ?? 0);
    case "order":
      return (v as number[]).every((x, i) => x === i);
    case "match":
      // Matching is self-correcting; one slip is forgiven.
      return (v as MatchValue).mistakes <= 1;
  }
}

export function correctAnswerLabel(q: Question) {
  switch (q.type) {
    case "choice":
    case "fill":
      return q.options[q.answer];
    case "truefalse":
      return q.answer ? "Vrai" : "Faux";
    case "numeric":
      return `${q.answer.toLocaleString("fr-FR")}${q.unit ? ` ${q.unit}` : ""}`;
    case "order":
      return q.items.join(" → ");
    case "match":
      return q.pairs.map(([a, b]) => `${a} : ${b}`).join(" · ");
  }
}

export function promptOf(q: Question) {
  return q.type === "fill" ? "Complétez la phrase" : q.prompt;
}

export const typeLabel: Record<Question["type"], string> = {
  choice: "Choisissez la bonne réponse",
  truefalse: "Vrai ou faux ?",
  numeric: "Calculez",
  fill: "Complétez la phrase",
  match: "Associez les paires",
  order: "Remettez dans l'ordre",
};

/* ───────────── Shared bits ───────────── */

type Props<V> = { q: Question; value: V; onChange: (v: V) => void; locked: boolean; result: boolean | null };

function Key({ n }: { n: number }) {
  return (
    <span className="hidden size-7 shrink-0 place-items-center rounded-lg border border-line-strong font-mono text-xs text-muted sm:grid" aria-hidden>
      {n}
    </span>
  );
}

const optionClass = (selected: boolean, locked: boolean, result: boolean | null, isAnswer: boolean) => {
  if (locked && isAnswer) return "border-mint bg-mint/12 text-cream";
  if (locked && selected && result === false) return "border-ember bg-ember/12 text-cream";
  if (selected) return "border-gold bg-gold/12 text-cream shadow-[0_0_0_3px_color-mix(in_oklab,var(--gold)_20%,transparent)]";
  return "border-line-strong bg-ink-2 text-cream/90 hover:border-cream/40 hover:bg-cream/[0.04]";
};

/* ───────────── Choice ───────────── */

export function ChoiceAnswer({ q, value, onChange, locked, result }: Props<number | null>) {
  if (q.type !== "choice") return null;
  return (
    <div className="grid gap-3">
      {q.options.map((o, i) => (
        <motion.button
          key={o}
          type="button"
          disabled={locked}
          onClick={() => onChange(i)}
          whileTap={{ scale: 0.98 }}
          animate={locked && value === i && result === false ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className={`flex items-center gap-4 rounded-2xl border-2 px-4 py-4 text-left text-[17px] leading-snug transition-colors ${optionClass(value === i, locked, result, i === q.answer)}`}
        >
          <Key n={i + 1} />
          <span>{o}</span>
        </motion.button>
      ))}
    </div>
  );
}

/* ───────────── True / false ───────────── */

export function TrueFalseAnswer({ q, value, onChange, locked, result }: Props<boolean | null>) {
  if (q.type !== "truefalse") return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      {[true, false].map((b, i) => (
        <motion.button
          key={String(b)}
          type="button"
          disabled={locked}
          onClick={() => onChange(b)}
          whileTap={{ scale: 0.97 }}
          animate={locked && value === b && result === false ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
          className={`flex flex-col items-center gap-3 rounded-2xl border-2 px-4 py-6 text-xl font-medium transition-colors ${optionClass(value === b, locked, result, b === q.answer)}`}
        >
          <svg viewBox="0 0 24 24" className="size-8 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            {b ? <path d="M5 12.5 10 17.5 19 7" /> : <path d="M6 6l12 12M18 6 6 18" />}
          </svg>
          <span className="flex items-center gap-2">
            {b ? "Vrai" : "Faux"} <Key n={i + 1} />
          </span>
        </motion.button>
      ))}
    </div>
  );
}

/* ───────────── Numeric ───────────── */

export function NumericAnswer({ q, value, onChange, locked, result }: Props<string>) {
  const id = useId();
  const [hint, setHint] = useState(false);
  if (q.type !== "numeric") return null;
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        Votre réponse
      </label>
      <div
        className={`flex items-center gap-3 rounded-2xl border-2 bg-ink-2 px-5 py-4 transition-colors ${
          locked ? (result ? "border-mint" : "border-ember") : "border-line-strong focus-within:border-gold"
        }`}
      >
        <input
          id={id}
          autoFocus
          inputMode="decimal"
          autoComplete="off"
          disabled={locked}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d\s,.-]/g, ""))}
          placeholder="Votre réponse"
          className="min-w-0 flex-1 bg-transparent font-display text-3xl tabular-nums outline-none placeholder:text-muted/60"
        />
        {q.unit && <span className="font-display text-2xl text-muted">{q.unit}</span>}
      </div>
      {q.hint && !locked && (
        <div className="mt-3">
          {hint ? (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[15px] text-cream/80">
              <span className="font-medium text-gold">Indice : </span>{q.hint}
            </motion.p>
          ) : (
            <button type="button" onClick={() => setHint(true)} className="text-[15px] text-gold underline underline-offset-4">
              Besoin d&apos;un indice ?
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ───────────── Fill the blank ───────────── */

export function FillAnswer({ q, value, onChange, locked, result }: Props<number | null>) {
  const group = useId();
  if (q.type !== "fill") return null;
  return (
    <LayoutGroup id={group}>
      <p className="text-[22px] leading-[1.9] text-cream">
        {q.before}{" "}
        <span
          className={`inline-flex min-w-[7rem] items-center justify-center rounded-xl border-b-[3px] px-1 align-middle ${
            locked ? (result ? "border-mint" : "border-ember") : "border-gold"
          }`}
        >
          {value !== null ? (
            <motion.button
              layoutId={`chip-${value}`}
              type="button"
              disabled={locked}
              onClick={() => onChange(null)}
              className="my-1 rounded-xl border-2 border-gold bg-gold/15 px-3 py-1 text-[18px]"
            >
              {q.options[value]}
            </motion.button>
          ) : (
            <span className="px-3 py-1 text-muted">…</span>
          )}
        </span>{" "}
        {q.after}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {q.options.map((o, i) =>
          value === i ? (
            <span key={o} className="rounded-xl border-2 border-dashed border-line-strong px-4 py-2.5 text-[17px] text-transparent">
              {o}
            </span>
          ) : (
            <motion.button
              key={o}
              layoutId={`chip-${i}`}
              type="button"
              disabled={locked}
              onClick={() => onChange(i)}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-xl border-2 border-line-strong bg-ink-2 px-4 py-2.5 text-[17px] hover:border-cream/40"
            >
              {o}
            </motion.button>
          ),
        )}
      </div>
    </LayoutGroup>
  );
}

/* ───────────── Match pairs ───────────── */

export function MatchAnswer({ q, value, onChange, locked }: Props<MatchValue>) {
  // Right column shuffled once per mount.
  const [order] = useState(() => (q.type === "match" ? [...q.pairs.keys()].sort(() => Math.random() - 0.5) : []));
  const [left, setLeft] = useState<number | null>(null);
  const [wrong, setWrong] = useState<[number, number] | null>(null);
  if (q.type !== "match") return null;

  const pickRight = (r: number) => {
    if (left === null || locked) return;
    if (left === r) {
      onChange({ ...value, matched: [...value.matched, r] });
      setLeft(null);
    } else {
      setWrong([left, r]);
      onChange({ ...value, mistakes: value.mistakes + 1 });
      setTimeout(() => {
        setWrong(null);
        setLeft(null);
      }, 550);
    }
  };

  const cell = (state: "idle" | "on" | "done" | "bad") =>
    `w-full rounded-2xl border-2 px-4 py-3.5 text-left text-[16px] leading-snug transition-colors ${
      state === "done"
        ? "border-mint/50 bg-mint/10 text-cream/60"
        : state === "bad"
          ? "border-ember bg-ember/12"
          : state === "on"
            ? "border-gold bg-gold/12"
            : "border-line-strong bg-ink-2 hover:border-cream/40"
    }`;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-3">
        {q.pairs.map(([a], i) => {
          const done = value.matched.includes(i);
          const bad = wrong?.[0] === i;
          return (
            <motion.button
              key={a}
              type="button"
              disabled={done || locked}
              onClick={() => setLeft(i)}
              animate={bad ? { x: [0, -6, 6, -4, 4, 0] } : done ? { scale: [1, 1.04, 1] } : {}}
              className={cell(done ? "done" : bad ? "bad" : left === i ? "on" : "idle")}
            >
              {a}
            </motion.button>
          );
        })}
      </div>
      <div className="space-y-3">
        {order.map((r) => {
          const done = value.matched.includes(r);
          const bad = wrong?.[1] === r;
          return (
            <motion.button
              key={q.pairs[r][1]}
              type="button"
              disabled={done || locked}
              onClick={() => pickRight(r)}
              animate={bad ? { x: [0, -6, 6, -4, 4, 0] } : done ? { scale: [1, 1.04, 1] } : {}}
              className={cell(done ? "done" : bad ? "bad" : "idle")}
            >
              {q.pairs[r][1]}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────── Order ───────────── */

export function OrderAnswer({ q, value, onChange, locked, result }: Props<number[]>) {
  const group = useId();
  const [bank] = useState(() => {
    if (q.type !== "order") return [];
    let s = [...q.items.keys()];
    // Make sure the starting order is never already correct.
    while (s.length > 1 && s.every((x, i) => x === i)) s = s.sort(() => Math.random() - 0.5);
    return s;
  });
  if (q.type !== "order") return null;

  return (
    <LayoutGroup id={group}>
      <ol
        className={`min-h-[4.5rem] space-y-2 rounded-2xl border-2 border-dashed p-2 transition-colors ${
          locked ? (result ? "border-mint" : "border-ember") : "border-line-strong"
        }`}
      >
        {value.length === 0 && <li className="px-3 py-3 text-[15px] text-muted">Touchez les étapes dans le bon ordre.</li>}
        <AnimatePresence>
          {value.map((i, pos) => (
            <motion.li key={i} layoutId={`ord-${i}`} className="flex items-center gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gold/15 font-mono text-xs text-gold">{pos + 1}</span>
              <button
                type="button"
                disabled={locked}
                onClick={() => onChange(value.filter((x) => x !== i))}
                className={`flex-1 rounded-xl border-2 px-4 py-3 text-left text-[16px] ${
                  locked ? (i === pos ? "border-mint/60 bg-mint/10" : "border-ember/60 bg-ember/10") : "border-gold/60 bg-gold/10"
                }`}
              >
                {q.items[i]}
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
      <div className="mt-5 flex flex-wrap gap-2.5">
        {bank.map((i) =>
          value.includes(i) ? null : (
            <motion.button
              key={i}
              layoutId={`ord-${i}`}
              type="button"
              disabled={locked}
              onClick={() => onChange([...value, i])}
              whileTap={{ scale: 0.96 }}
              className="rounded-xl border-2 border-line-strong bg-ink-2 px-4 py-3 text-left text-[16px] hover:border-cream/40"
            >
              {q.items[i]}
            </motion.button>
          ),
        )}
      </div>
    </LayoutGroup>
  );
}

/* ───────────── Dispatcher ───────────── */

export function AnswerInput(props: Props<AnswerValue>) {
  const { q } = props;
  switch (q.type) {
    case "choice":
      return <ChoiceAnswer {...(props as Props<number | null>)} />;
    case "truefalse":
      return <TrueFalseAnswer {...(props as Props<boolean | null>)} />;
    case "numeric":
      return <NumericAnswer {...(props as Props<string>)} />;
    case "fill":
      return <FillAnswer {...(props as Props<number | null>)} />;
    case "match":
      return <MatchAnswer {...(props as Props<MatchValue>)} />;
    case "order":
      return <OrderAnswer {...(props as Props<number[]>)} />;
  }
}
