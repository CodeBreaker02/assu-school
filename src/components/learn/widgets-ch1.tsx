"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { fcfa, fcfaShort } from "@/lib/finance";
import { AmountSlider, Segmented, WidgetCard } from "./controls";
import { AnimatedNumber, spring } from "./motion";

const money = (v: number) => fcfa.format(Math.round(v));

/* ───────────────────────── Inflation ───────────────────────── */

const basket = ["Riz", "Huile", "Sucre", "Lait", "Pain", "Oignons", "Tomates", "Savon", "Thé", "Gaz"];

export function InflationWidget() {
  const [amount, setAmount] = useState(100_000);
  const [rate, setRate] = useState(3);
  const [years, setYears] = useState(10);

  const ratio = 1 / Math.pow(1 + rate / 100, years);
  const worth = amount * ratio;
  const needed = amount / ratio;
  const kept = Math.round(basket.length * ratio);

  return (
    <WidgetCard eyebrow="Simulateur" title="Ce que votre argent achètera demain">
      <Segmented
        label="Inflation"
        value={rate}
        onChange={setRate}
        options={[
          { value: 2, label: "2 % · cible BCEAO" },
          { value: 3, label: "3 %" },
          { value: 5, label: "5 %" },
          { value: 8, label: "8 % · année difficile" },
        ]}
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-ink p-5">
          <div className="text-sm text-muted">Aujourd&apos;hui</div>
          <AnimatedNumber value={amount} format={money} className="mt-1 block font-display text-3xl" />
        </div>
        <div className="rounded-2xl border border-ember/40 bg-ember/[0.07] p-5">
          <div className="text-sm text-muted">Pouvoir d&apos;achat dans {years} ans</div>
          <AnimatedNumber value={worth} format={money} className="mt-1 block font-display text-3xl text-ember" />
        </div>
      </div>

      {/* the market basket empties as purchasing power falls */}
      <div className="mt-6 rounded-2xl border border-line bg-ink p-5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-muted">Votre panier au marché</span>
          <span className="font-mono text-sm text-cream tabular-nums">
            {kept}/{basket.length} produits
          </span>
        </div>
        <ul className="mt-4 grid grid-cols-5 gap-2">
          {basket.map((item, i) => {
            const lost = i >= kept;
            return (
              <motion.li
                key={item}
                animate={{ opacity: lost ? 0.28 : 1, scale: lost ? 0.92 : 1, y: lost ? 4 : 0 }}
                transition={{ ...spring, delay: (basket.length - i) * 0.02 }}
                className={`relative rounded-xl border px-1 py-2.5 text-center text-[13px] ${lost ? "border-dashed border-line-strong text-muted" : "border-gold/40 bg-gold/10 text-cream"}`}
              >
                {item}
                <AnimatePresence>
                  {lost && (
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      className="absolute top-1/2 right-2 left-2 h-px origin-left bg-ember"
                    />
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
        <p className="mt-4 text-[15px] leading-relaxed text-cream/85">
          Pour acheter la même chose dans {years} ans, il faudra{" "}
          <AnimatedNumber value={needed} format={money} className="font-semibold text-gold" />.
        </p>
      </div>

      <div className="mt-7 grid gap-6 sm:grid-cols-3">
        <AmountSlider label="Somme gardée" value={amount} min={10_000} max={2_000_000} step={10_000} onChange={setAmount} />
        <AmountSlider label="Inflation par an" value={rate} min={0} max={10} step={0.5} onChange={setRate} format={(v) => `${v.toLocaleString("fr-FR")} %`} />
        <AmountSlider label="Durée" value={years} min={1} max={20} step={1} onChange={setYears} format={(v) => `${v} an${v > 1 ? "s" : ""}`} />
      </div>
    </WidgetCard>
  );
}

/* ───────────────────────── Bilan personnel ───────────────────────── */

const assetFields = [
  { key: "epargne", label: "Épargne et Mobile Money", max: 3_000_000, step: 10_000 },
  { key: "tontine", label: "Tontine (déjà versé, pas encore reçu)", max: 1_000_000, step: 10_000 },
  { key: "biens", label: "Terrain, maison", max: 30_000_000, step: 250_000 },
  { key: "outils", label: "Stock, matériel, véhicule", max: 5_000_000, step: 50_000 },
] as const;

const debtFields = [
  { key: "credits", label: "Crédits bancaires et microcrédits", max: 10_000_000, step: 50_000 },
  { key: "proches", label: "Prêts de la famille ou d'amis", max: 2_000_000, step: 10_000 },
  { key: "mobile", label: "Crédits mobile, achats à crédit", max: 1_000_000, step: 5_000 },
] as const;

type Key = (typeof assetFields)[number]["key"] | (typeof debtFields)[number]["key"];

function Balance({ assets, debts }: { assets: number; debts: number }) {
  const max = Math.max(assets, debts, 1);
  // Tilts toward the heavier side, capped at 14°.
  const angle = ((debts - assets) / max) * 14;
  return (
    <svg viewBox="0 0 400 210" className="w-full" aria-hidden>
      <path d="M200 60 L200 186 M150 192 L250 192" stroke="var(--line-strong)" strokeWidth="6" strokeLinecap="round" />
      <path d="M180 192 L200 172 L220 192 Z" fill="var(--line-strong)" />
      <motion.g style={{ transformOrigin: "200px 60px" }} animate={{ rotate: angle }} transition={{ type: "spring", stiffness: 60, damping: 9 }}>
        <rect x="40" y="56" width="320" height="8" rx="4" fill="var(--cream)" opacity="0.8" />
        <circle cx="200" cy="60" r="9" fill="var(--gold)" />
        {[
          { x: 70, label: "Possédé", value: assets, color: "var(--mint)" },
          { x: 330, label: "Dû", value: debts, color: "var(--ember)" },
        ].map((pan) => (
          <motion.g key={pan.label} style={{ transformOrigin: `${pan.x}px 64px` }} animate={{ rotate: -angle }} transition={{ type: "spring", stiffness: 60, damping: 9 }}>
            <line x1={pan.x} y1="64" x2={pan.x - 42} y2="120" stroke="var(--line-strong)" strokeWidth="2" />
            <line x1={pan.x} y1="64" x2={pan.x + 42} y2="120" stroke="var(--line-strong)" strokeWidth="2" />
            <path d={`M${pan.x - 56} 120 Q${pan.x} 152 ${pan.x + 56} 120 Z`} fill={pan.color} opacity="0.9" />
            <text x={pan.x} y="104" textAnchor="middle" fill="var(--cream)" fontSize="15" fontFamily="var(--font-avant-garde)">
              {fcfaShort(pan.value)}
            </text>
            <text x={pan.x} y="172" textAnchor="middle" fill="var(--muted)" fontSize="13" fontFamily="var(--font-geist-mono)">
              {pan.label}
            </text>
          </motion.g>
        ))}
      </motion.g>
    </svg>
  );
}

export function BilanWidget() {
  const [v, setV] = useState<Record<Key, number>>({
    epargne: 150_000,
    tontine: 60_000,
    biens: 0,
    outils: 400_000,
    credits: 200_000,
    proches: 50_000,
    mobile: 30_000,
  });
  const set = (k: Key) => (n: number) => setV((s) => ({ ...s, [k]: n }));
  const assets = assetFields.reduce((n, f) => n + v[f.key], 0);
  const debts = debtFields.reduce((n, f) => n + v[f.key], 0);
  const net = assets - debts;

  return (
    <WidgetCard eyebrow="Exercice" title="Votre bilan en dix minutes">
      <div className="grid items-center gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <div className="text-sm text-muted">Votre valeur nette</div>
          <AnimatedNumber
            value={net}
            format={(x) => `${x < 0 ? "− " : ""}${fcfa.format(Math.abs(Math.round(x)))}`}
            className={`mt-1 block font-display text-[2.6rem] leading-none transition-colors duration-500 ${net >= 0 ? "text-mint" : "text-ember"}`}
          />
          <p className="mt-3 text-[15px] leading-relaxed text-cream/85">
            {net >= 0
              ? "Positive : vous possédez plus que vous ne devez. Objectif, la faire monter."
              : "Négative pour l'instant. Priorité : rembourser les dettes les plus chères."}
          </p>
        </div>
        <Balance assets={assets} debts={debts} />
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <fieldset className="space-y-6">
          <legend className="mb-5 flex items-center gap-2 font-display text-lg">
            <span className="size-2.5 rounded-full bg-mint" /> Ce que je possède
          </legend>
          {assetFields.map((f) => (
            <AmountSlider key={f.key} label={f.label} value={v[f.key]} min={0} max={f.max} step={f.step} onChange={set(f.key)} />
          ))}
        </fieldset>
        <fieldset className="space-y-6">
          <legend className="mb-5 flex items-center gap-2 font-display text-lg">
            <span className="size-2.5 rounded-full bg-ember" /> Ce que je dois
          </legend>
          {debtFields.map((f) => (
            <AmountSlider key={f.key} label={f.label} value={v[f.key]} min={0} max={f.max} step={f.step} onChange={set(f.key)} />
          ))}
        </fieldset>
      </div>
    </WidgetCard>
  );
}
