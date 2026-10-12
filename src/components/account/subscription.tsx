"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { allLessons, freeLessons } from "@/lib/content";
import { fcfa } from "@/lib/finance";
import { demoInvoices, demoPaymentMethods, formatDate } from "./data";
import { updateProfile, useProfile } from "./store";
import { Card, DemoBadge, PageHead, useToast } from "./ui";

const check = (
  <svg viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0 fill-none stroke-mint stroke-2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 8.5 6.5 12 13 4.5" />
  </svg>
);

export function Subscription() {
  const p = useProfile();
  const toast = useToast();
  const premium = p.plan === "premium";

  return (
    <>
      <PageHead title="Abonnement et factures" text="Votre formule, vos moyens de paiement et l'historique de vos paiements." />

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -bottom-24 size-72 rounded-full bg-gold/15 blur-3xl" />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm text-cream/75">Formule actuelle</span>
              <DemoBadge label="Changement de formule simulé" />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={p.plan}
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.4 }}
              >
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-display text-5xl leading-none">{premium ? "Premium" : "Gratuit"}</span>
                  <span className="text-[15px] text-cream/75">{premium ? "15 000 FCFA / an" : "0 FCFA"}</span>
                </div>
                <ul className="mt-6 grid gap-2.5 text-[15px] text-cream/90 sm:grid-cols-2">
                  {(premium
                    ? [`Les ${allLessons.length} leçons`, "Tous les simulateurs", "Leçons hors connexion", "Certificats"]
                    : [`${freeLessons} leçons gratuites`, "Simulateurs de base", "Communauté", "Sans engagement"]
                  ).map((f) => (
                    <li key={f} className="flex gap-2.5">
                      {check}
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
            <div className="mt-7 flex flex-wrap gap-3">
              {premium ? (
                <button
                  type="button"
                  onClick={() => {
                    updateProfile({ plan: "gratuit" });
                    toast.show("Retour à la formule gratuite (démo)");
                  }}
                  className="rounded-full border border-line-strong px-5 py-3 text-sm hover:bg-cream/5"
                >
                  Revenir à la formule gratuite
                </button>
              ) : (
                <>
                  <Link href="/#tarif" className="rounded-full bg-gold px-5 py-3 text-sm font-medium text-on-gold transition-transform active:scale-95">
                    Passer Premium · 2 000 FCFA/mois
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      updateProfile({ plan: "premium" });
                      toast.show("Premium activé (démo)");
                    }}
                    className="rounded-full border border-line-strong px-5 py-3 text-sm hover:bg-cream/5"
                  >
                    Simuler Premium
                  </button>
                </>
              )}
            </div>
          </div>
        </Card>

        <Card title="Moyens de paiement" action={<DemoBadge />} delay={0.06}>
          <ul className="space-y-2.5">
            {demoPaymentMethods.map((m) => (
              <li key={m.id} className="flex items-center gap-3 rounded-2xl border border-line bg-ink p-4">
                <span className="grid size-10 place-items-center rounded-xl bg-cream/10 font-display text-sm">{m.label[0]}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] text-cream">{m.label}</div>
                  <div className="font-mono text-sm text-muted">{m.detail}</div>
                </div>
                {m.primary && <span className="rounded-full bg-mint/15 px-2.5 py-1 text-xs text-mint">Principal</span>}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] leading-relaxed text-muted">Orange Money, Wave, MTN MoMo, Moov Money ou carte bancaire.</p>
        </Card>
      </div>

      <Card className="mt-4" title="Factures" delay={0.1} action={<DemoBadge />}>
        <ul className="divide-y divide-line sm:hidden">
          {demoInvoices.map((inv) => (
            <li key={inv.id} className="flex items-center gap-3 py-3.5">
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] text-cream">{inv.label}</div>
                <div className="text-[13px] text-muted">
                  {formatDate(inv.date)} · {inv.method}
                </div>
                <div className="mt-0.5 font-mono text-sm tabular-nums">
                  {fcfa.format(inv.amount)} <span className={inv.status === "payée" ? "text-mint" : "text-ember"}>· {inv.status}</span>
                </div>
              </div>
              <Link href={`/compte/factures/${inv.id}`} className="shrink-0 rounded-full border border-line-strong px-3.5 py-1.5 text-sm">
                Voir
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden sm:block">
          <table className="w-full text-left text-[15px]">
            <thead>
              <tr className="border-b border-line text-sm text-muted">
                <th className="px-5 py-3 font-normal sm:px-0">Date</th>
                <th className="py-3 font-normal">Description</th>
                <th className="py-3 font-normal">Paiement</th>
                <th className="py-3 text-right font-normal">Montant</th>
                <th className="py-3 pr-5 text-right font-normal sm:pr-0">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {demoInvoices.map((inv, i) => (
                <motion.tr
                  key={inv.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="border-b border-line last:border-0"
                >
                  <td className="px-5 py-4 whitespace-nowrap text-cream/85 sm:px-0">{formatDate(inv.date)}</td>
                  <td className="py-4">
                    <div className="text-cream">{inv.label}</div>
                    <div className="font-mono text-xs text-muted">{inv.id}</div>
                  </td>
                  <td className="py-4 text-cream/85">{inv.method}</td>
                  <td className="py-4 text-right font-mono whitespace-nowrap tabular-nums">
                    {fcfa.format(inv.amount)}
                    <div className={`text-xs ${inv.status === "payée" ? "text-mint" : "text-ember"}`}>{inv.status}</div>
                  </td>
                  <td className="py-4 pr-5 text-right sm:pr-0">
                    <Link href={`/compte/factures/${inv.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-sm hover:bg-cream/5">
                      Télécharger
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {toast.node}
    </>
  );
}
