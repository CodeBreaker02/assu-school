"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ComponentType, useEffect, useMemo, useState } from "react";
import { fcfa, fcfaShort, monthlyForGoal, simulateGrowth } from "@/lib/finance";
import type { WidgetId } from "@/lib/lessons";
import { Donut, GrowthChart, Jar, type Segment, StackedBar } from "./charts";
import { AmountSlider, Segmented, WidgetCard } from "./controls";
import { BilanWidget, InflationWidget } from "./widgets-ch1";
import { AnimatedNumber, spring } from "./motion";

const money = (v: number) => fcfa.format(Math.round(v));

const C = {
  besoins: "var(--gold)",
  envies: "var(--ember)",
  solidarite: "#b98cf0",
  epargne: "var(--mint)",
};

function Legend({ segments, total }: { segments: Segment[]; total: number }) {
  return (
    <ul className="space-y-3">
      {segments.map((s) => (
        <motion.li key={s.label} layout transition={spring} className="flex items-center gap-3">
          <span className="size-3 shrink-0 rounded-[4px]" style={{ background: s.color }} />
          <span className="flex-1 text-sm text-muted">{s.label}</span>
          <span className="font-mono text-xs text-muted tabular-nums">{Math.round((s.value / (total || 1)) * 100)} %</span>
          <AnimatedNumber value={s.value} format={money} className="w-32 text-right font-mono text-sm text-cream" />
        </motion.li>
      ))}
    </ul>
  );
}

function formatDuration(months: number) {
  if (!Number.isFinite(months)) return "jamais";
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (!y) return `${m} mois`;
  return m ? `${y} an${y > 1 ? "s" : ""} et ${m} mois` : `${y} an${y > 1 ? "s" : ""}`;
}

/* ───────────────────────── Budget 50/30/20 ───────────────────────── */

function BudgetWidget() {
  const [income, setIncome] = useState(200_000);
  const [mode, setMode] = useState<"classique" | "adapte">("adapte");
  const [solidarity, setSolidarity] = useState(10);
  const [compare, setCompare] = useState(false);
  const [actual, setActual] = useState({ besoins: 130_000, envies: 30_000, solidarite: 25_000 });

  const target: Segment[] =
    mode === "classique"
      ? [
          { label: "Besoins", value: income * 0.5, color: C.besoins },
          { label: "Envies", value: income * 0.3, color: C.envies },
          { label: "Épargne", value: income * 0.2, color: C.epargne },
        ]
      : [
          { label: "Besoins", value: income * 0.5, color: C.besoins },
          { label: "Envies", value: income * ((30 - solidarity) / 100), color: C.envies },
          { label: "Solidarité", value: income * (solidarity / 100), color: C.solidarite },
          { label: "Épargne", value: income * 0.2, color: C.epargne },
        ];

  const spent = actual.besoins + actual.envies + (mode === "adapte" ? actual.solidarite : 0);
  const realSaving = Math.max(0, income - spent);
  const real: Segment[] = [
    { label: "Besoins", value: actual.besoins, color: C.besoins },
    { label: "Envies", value: actual.envies, color: C.envies },
    ...(mode === "adapte" ? [{ label: "Solidarité", value: actual.solidarite, color: C.solidarite }] : []),
    { label: "Épargne", value: realSaving, color: C.epargne },
  ];
  const gaps = real
    .map((r) => ({ label: r.label, diff: r.value - (target.find((t) => t.label === r.label)?.value ?? 0) }))
    .filter((g) => Math.abs(g.diff) >= 1000);

  return (
    <WidgetCard eyebrow="Simulateur" title="Découpez votre revenu">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="Version du budget"
          value={mode}
          onChange={setMode}
          options={[
            { value: "classique", label: "50/30/20 classique" },
            { value: "adapte", label: "Version Assu" },
          ]}
        />
        <Segmented
          label="Comparer"
          value={compare ? "oui" : "non"}
          onChange={(v) => setCompare(v === "oui")}
          options={[
            { value: "non", label: "Cible" },
            { value: "oui", label: "Comparer à mes dépenses" },
          ]}
        />
      </div>

      <div className="mt-7 grid items-center gap-8 md:grid-cols-[240px_1fr]">
        <div className="mx-auto">
          <Donut segments={target} size={220}>
            <div className="font-mono text-xs tracking-[0.18em] text-muted uppercase">Revenu</div>
            <AnimatedNumber value={income} format={fcfaShort} className="mt-1 block font-display text-2xl" />
          </Donut>
        </div>
        <div className="space-y-7">
          <AmountSlider
            label={mode === "adapte" ? "Revenu de votre mois le plus faible" : "Revenu mensuel"}
            value={income}
            min={25_000}
            max={1_500_000}
            step={5_000}
            onChange={setIncome}
          />
          <AnimatePresence initial={false}>
            {mode === "adapte" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <AmountSlider
                  label="Part solidarité (prise sur les 30 %)"
                  value={solidarity}
                  min={0}
                  max={20}
                  step={1}
                  onChange={setSolidarity}
                  format={(v) => `${v} %`}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <Legend segments={target} total={income} />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {compare && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-8 border-t border-line pt-7">
              <div className="grid gap-6 sm:grid-cols-3">
                <AmountSlider label="Mes besoins" value={actual.besoins} min={0} max={income} step={5_000} onChange={(v) => setActual((a) => ({ ...a, besoins: v }))} />
                <AmountSlider label="Mes envies" value={actual.envies} min={0} max={income} step={5_000} onChange={(v) => setActual((a) => ({ ...a, envies: v }))} />
                {mode === "adapte" && (
                  <AmountSlider label="Ma solidarité" value={actual.solidarite} min={0} max={income} step={5_000} onChange={(v) => setActual((a) => ({ ...a, solidarite: v }))} />
                )}
              </div>
              <div className="mt-7 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-12 font-mono text-xs text-muted uppercase">Cible</span>
                  <StackedBar segments={target} height="h-9" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-12 font-mono text-xs text-muted uppercase">Réel</span>
                  <StackedBar segments={real} height="h-9" />
                </div>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                <AnimatePresence>
                  {spent > income && (
                    <motion.li key="over" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="rounded-full bg-ember/15 px-3 py-1.5 font-mono text-xs text-ember">
                      Dépassement : {money(spent - income)}
                    </motion.li>
                  )}
                  {gaps.map((g) => (
                    <motion.li
                      key={g.label}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`rounded-full px-3 py-1.5 font-mono text-xs ${
                        (g.label === "Épargne" ? g.diff >= 0 : g.diff <= 0) ? "bg-mint/15 text-mint" : "bg-ember/15 text-ember"
                      }`}
                    >
                      {g.label} {g.diff > 0 ? "+" : "−"}
                      {money(Math.abs(g.diff))}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </WidgetCard>
  );
}

/* ───────────────────────── Épargne de précaution ───────────────────────── */

function PrecautionWidget() {
  const [expenses, setExpenses] = useState(150_000);
  const [months, setMonths] = useState(6);
  const [saving, setSaving] = useState(45_000);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();

  const target = expenses * months;
  const toReach = saving > 0 ? Math.ceil(target / saving) : Infinity;
  const horizon = Number.isFinite(toReach) ? toReach : 0;
  const shownElapsed = Math.min(elapsed, horizon);
  const saved = Math.min(target, shownElapsed * saving);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setElapsed((e) => {
        if (e >= horizon) {
          setPlaying(false);
          return e;
        }
        return e + 1;
      });
    }, Math.max(60, 1600 / Math.max(horizon, 1)));
    return () => clearInterval(id);
  }, [playing, horizon]);

  const marks = Array.from({ length: months }, (_, i) => ({ at: (i + 1) / months, label: `${i + 1} m` })).filter(
    (_, i) => months <= 6 || (i + 1) % 3 === 0,
  );

  return (
    <WidgetCard eyebrow="Simulateur" title="Votre coussin de sécurité">
      {/* auto-plays once, the first time the widget scrolls into view */}
      <motion.div
        onViewportEnter={() => !reduced && setPlaying(true)}
        viewport={{ once: true, margin: "-20% 0px" }}
        className="grid items-center gap-8 md:grid-cols-[1fr_220px]"
      >
        <div className="space-y-7">
          <AmountSlider label="Dépenses essentielles par mois" value={expenses} min={20_000} max={800_000} step={5_000} onChange={(v) => { setExpenses(v); setElapsed(0); }} />
          <div>
            <div className="mb-3 text-sm text-muted">Nombre de mois à couvrir</div>
            <Segmented
              label="Mois à couvrir"
              value={months}
              onChange={(v) => { setMonths(v); setElapsed(0); }}
              options={[
                { value: 3, label: "3 mois" },
                { value: 6, label: "6 mois" },
                { value: 9, label: "9 mois" },
                { value: 12, label: "12 mois" },
              ]}
            />
            <p className="mt-2 font-mono text-xs text-muted">Revenus irréguliers : visez 6 mois ou plus.</p>
          </div>
          <AmountSlider label="Je peux épargner par mois" value={saving} min={2_000} max={300_000} step={1_000} onChange={(v) => { setSaving(v); setElapsed(0); }} />

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-line bg-ink p-4">
              <div className="font-mono text-xs tracking-[0.18em] text-muted uppercase">Coussin visé</div>
              <AnimatedNumber value={target} format={money} className="mt-1 block font-display text-xl" />
            </div>
            <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4">
              <div className="font-mono text-xs tracking-[0.18em] text-gold uppercase">Atteint en</div>
              <motion.div key={toReach} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-1 font-display text-xl">
                {formatDuration(toReach)}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <Jar
            level={target ? saved / target : 0}
            color="var(--mint)"
            marks={marks}
            className="w-44"
            label={
              <div>
                <AnimatedNumber value={saved} format={fcfaShort} className="font-display text-lg" />
                <div className="font-mono text-xs text-muted">après {shownElapsed} mois</div>
              </div>
            }
          />
          <button
            type="button"
            onClick={() => {
              setElapsed(0);
              setPlaying(true);
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-xs text-cream transition-colors hover:border-gold hover:text-gold"
          >
            <svg viewBox="0 0 10 12" className="size-2.5 fill-current" aria-hidden>
              <path d="M0 0l10 6-10 6z" />
            </svg>
            {playing ? "Simulation…" : "Rejouer la simulation"}
          </button>
        </div>
      </motion.div>
    </WidgetCard>
  );
}

/* ───────────────────────── Épargne d'objectif ───────────────────────── */

const presets = [
  { value: "rentree", label: "Rentrée", amount: 180_000, months: 6 },
  { value: "tabaski", label: "Tabaski", amount: 250_000, months: 8 },
  { value: "moto", label: "Moto", amount: 720_000, months: 12 },
  { value: "mariage", label: "Mariage", amount: 1_500_000, months: 24 },
  { value: "terrain", label: "Terrain", amount: 4_000_000, months: 48 },
] as const;

function ObjectifWidget() {
  const [preset, setPreset] = useState<(typeof presets)[number]["value"]>("moto");
  const [amount, setAmount] = useState(720_000);
  const [months, setMonths] = useState(12);
  const [already, setAlready] = useState(120_000);

  const monthly = monthlyForGoal(amount, months, Math.min(already, amount));
  const bars = useMemo(
    () => Array.from({ length: months }, (_, i) => Math.min(amount, already + monthly * (i + 1))),
    [months, amount, already, monthly],
  );

  const pick = (v: (typeof presets)[number]["value"]) => {
    const p = presets.find((x) => x.value === v)!;
    setPreset(v);
    setAmount(p.amount);
    setMonths(p.months);
    setAlready(0);
  };

  return (
    <WidgetCard eyebrow="Simulateur" title="Combien par mois pour votre projet ?">
      <Segmented label="Projet" value={preset} onChange={pick} options={presets.map((p) => ({ value: p.value, label: p.label }))} />

      <div className="mt-7 grid gap-8 md:grid-cols-2">
        <div className="space-y-7">
          <AmountSlider label="Montant du projet" value={amount} min={50_000} max={6_000_000} step={10_000} onChange={(v) => { setAmount(v); setAlready((a) => Math.min(a, v)); }} />
          <AmountSlider label="Échéance" value={months} min={1} max={60} step={1} onChange={setMonths} format={(v) => formatDuration(v)} />
          <AmountSlider label="Déjà épargné" value={already} min={0} max={amount} step={5_000} onChange={setAlready} />
        </div>

        <div className="flex flex-col justify-between gap-6">
          <div className="rounded-2xl border border-gold/30 bg-gold/10 p-5">
            <div className="font-mono text-xs tracking-[0.18em] text-gold uppercase">Effort mensuel</div>
            <AnimatedNumber value={monthly} format={money} className="mt-1 block font-display text-[clamp(2rem,5vw,2.8rem)] leading-none" />
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gold/20 pt-4 font-mono text-xs">
              <div>
                <div className="text-muted">par semaine</div>
                <AnimatedNumber value={monthly / 4.33} format={money} className="text-cream" />
              </div>
              <div>
                <div className="text-muted">par jour</div>
                <AnimatedNumber value={monthly / 30} format={money} className="text-cream" />
              </div>
            </div>
          </div>

          {/* timeline: each bar is the balance at the end of a month */}
          <div>
            <div className="relative flex h-32 items-end gap-[2px]">
              <div className="absolute inset-x-0 top-0 border-t border-dashed border-gold/50" />
              <span className="absolute -top-5 right-0 font-mono text-xs text-gold">Objectif</span>
              {bars.map((v, i) => (
                <motion.div
                  key={`${months}-${i}`}
                  className="flex-1 rounded-t-[3px]"
                  style={{ background: i === months - 1 ? "var(--gold)" : "color-mix(in oklab, var(--gold) 45%, transparent)" }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / amount) * 100}%` }}
                  transition={{ ...spring, delay: i * Math.min(0.04, 0.8 / months) }}
                />
              ))}
              <motion.svg
                key={`flag-${months}`}
                viewBox="0 0 20 24"
                className="absolute -top-9 -right-1 size-6"
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.6 }}
                aria-hidden
              >
                <path d="M3 2v20" stroke="var(--cream)" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 3h13l-3 4 3 4H4z" fill="var(--gold)" />
              </motion.svg>
            </div>
            <div className="mt-2 flex justify-between font-mono text-xs text-muted">
              <span>auj.</span>
              <span>{formatDuration(months)}</span>
            </div>
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}

/* ───────────────────────── Épargne d'investissement ───────────────────────── */

function CroissanceWidget() {
  const [initial, setInitial] = useState(100_000);
  const [monthly, setMonthly] = useState(25_000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(6);
  const data = useMemo(() => simulateGrowth(initial, monthly, years, rate), [initial, monthly, years, rate]);
  const last = data[data.length - 1];

  return (
    <WidgetCard eyebrow="Simulateur" title="Le temps au travail">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Segmented
          label="Profil"
          value={rate}
          onChange={setRate}
          options={[
            { value: 3, label: "Prudent · 3 %" },
            { value: 6, label: "Équilibré · 6 %" },
            { value: 9, label: "Dynamique · 9 %" },
          ]}
        />
        <span className="font-mono text-xs text-muted">Hypothèses pédagogiques, non garanties</span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: `Dans ${years} ans`, value: last.total, cls: "text-cream" },
          { label: "Versé", value: last.paid, cls: "text-muted" },
          { label: "Intérêts", value: last.total - last.paid, cls: "text-gold" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-ink p-3 sm:p-4">
            <div className="font-mono text-xs tracking-[0.15em] text-muted uppercase">{s.label}</div>
            <AnimatedNumber value={s.value} format={fcfaShort} className={`mt-1 block font-display text-base sm:text-xl ${s.cls}`} />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <GrowthChart data={data} format={fcfaShort} totalLabel="Total" paidLabel="Versé" />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <AmountSlider label="Versement mensuel" value={monthly} min={5_000} max={300_000} step={5_000} onChange={setMonthly} />
        <AmountSlider label="Durée" value={years} min={1} max={40} step={1} onChange={setYears} format={(v) => `${v} ans`} />
        <AmountSlider label="Capital de départ" value={initial} min={0} max={5_000_000} step={50_000} onChange={setInitial} />
        <AmountSlider label="Rendement annuel" value={rate} min={0} max={12} step={0.5} onChange={setRate} format={(v) => `${v.toLocaleString("fr-FR")} %`} />
      </div>
    </WidgetCard>
  );
}

/** Lesson data references widgets by id; this registry maps ids to components. */
export const widgets: Record<WidgetId, ComponentType> = {
  budget: BudgetWidget,
  precaution: PrecautionWidget,
  objectif: ObjectifWidget,
  croissance: CroissanceWidget,
  inflation: InflationWidget,
  bilan: BilanWidget,
};
