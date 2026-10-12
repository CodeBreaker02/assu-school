"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";
import { useLessonProgress } from "@/components/learn/progress";
import { CauriMark } from "@/components/logo";
import { fcfa } from "@/lib/finance";
import { type Invoice, certificates, findCertificateMeta, formatDate, verificationCode } from "./data";
import { displayName, recordCertificates, useCertificateDates, useProfile } from "./store";

function PrintBar({ back, label }: { back: string; label: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
      <Link href={back} className="text-sm text-cream/80 hover:text-cream">
        ← {label}
      </Link>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-on-gold active:scale-95"
      >
        Imprimer ou enregistrer en PDF
      </button>
    </div>
  );
}

/* ───────────────────────── Invoice ───────────────────────── */

export function InvoiceView({ invoice }: { invoice: Invoice }) {
  const p = useProfile();
  const ht = Math.round(invoice.amount / 1.18);
  return (
    <div className="mx-auto max-w-3xl">
      <PrintBar back="/compte/abonnement" label="Factures" />
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        data-theme="light"
        className="rounded-3xl border border-line bg-ink-2 p-8 text-cream shadow-xl sm:p-12 print:rounded-none print:border-0 print:shadow-none"
      >
        <div className="mb-8 rounded-xl border border-dashed border-ember/60 px-4 py-2 text-center text-sm text-ember">
          Facture de démonstration · sans valeur comptable
        </div>
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <CauriMark className="h-10 w-8" />
            <div>
              <div className="font-display text-2xl leading-none">assu school</div>
              <div className="mt-1 text-sm text-muted">L&apos;école de l&apos;argent</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl">Facture</div>
            <div className="font-mono text-sm text-muted">{invoice.id}</div>
            <div className="mt-1 text-sm text-cream/80">{formatDate(invoice.date)}</div>
          </div>
        </header>

        <div className="mt-10 grid gap-6 text-[15px] sm:grid-cols-2">
          <div>
            <div className="text-xs tracking-[0.14em] text-muted uppercase">Facturé à</div>
            <div className="mt-1.5 text-cream">{displayName(p)}</div>
            {p.phone && <div className="text-cream/80">{`${p.phoneCode} ${p.phone}`}</div>}
            {p.email && <div className="text-cream/80">{p.email}</div>}
          </div>
          <div className="sm:text-right">
            <div className="text-xs tracking-[0.14em] text-muted uppercase">Paiement</div>
            <div className="mt-1.5 text-cream">{invoice.method}</div>
            <div className={invoice.status === "payée" ? "text-mint" : "text-ember"}>{invoice.status}</div>
          </div>
        </div>

        <table className="mt-10 w-full text-[15px]">
          <thead>
            <tr className="border-b border-line-strong text-left text-sm text-muted">
              <th className="pb-3 font-normal">Description</th>
              <th className="pb-3 text-right font-normal">Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line">
              <td className="py-4">
                <div className="text-cream">{invoice.label}</div>
                <div className="text-sm text-muted">{invoice.period}</div>
              </td>
              <td className="py-4 text-right font-mono tabular-nums">{fcfa.format(ht)}</td>
            </tr>
          </tbody>
          <tfoot className="text-right">
            <tr>
              <td className="pt-4 text-cream/80">TVA (18 %)</td>
              <td className="pt-4 font-mono tabular-nums">{fcfa.format(invoice.amount - ht)}</td>
            </tr>
            <tr>
              <td className="pt-2 font-display text-xl">Total TTC</td>
              <td className="pt-2 font-display text-xl tabular-nums">{fcfa.format(invoice.amount)}</td>
            </tr>
          </tfoot>
        </table>

        <footer className="mt-12 border-t border-line pt-6 text-sm leading-relaxed text-muted">
          Merci d&apos;apprendre avec Assu School. Pour toute question sur cette facture, écrivez-nous depuis votre espace.
        </footer>
      </motion.article>
    </div>
  );
}

/* ───────────────────────── Certificate ───────────────────────── */

export function CertificateView({ id }: { id: string }) {
  const p = useProfile();
  const done = useLessonProgress();
  const dates = useCertificateDates();
  const meta = findCertificateMeta(id);
  const cert = certificates(done).find((c) => c.id === id);
  const unlocked = !!cert?.unlocked;

  useEffect(() => {
    if (unlocked) recordCertificates([id]);
  }, [unlocked, id]);

  if (!meta || !cert) return null;

  if (!unlocked)
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-line-strong bg-ink-2">
          <svg viewBox="0 0 24 24" className="size-7 fill-none stroke-cream stroke-[1.6]" aria-hidden>
            <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
            <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
          </svg>
        </div>
        <h1 className="mt-6 font-display text-3xl">Certificat verrouillé</h1>
        <p className="mt-3 text-[16px] text-cream/80">{cert.requirement}</p>
        <Link href="/compte/certificats" className="mt-6 inline-block rounded-full border border-line-strong px-5 py-2.5 text-sm hover:bg-cream/5">
          ← Mes certificats
        </Link>
      </div>
    );

  const date = dates[id] ? formatDate(dates[id]) : formatDate(new Date().toISOString());
  const name = displayName(p);
  const accent = meta.chapter?.accent ?? "#e9b44c";

  return (
    <div className="mx-auto max-w-5xl">
      <PrintBar back="/compte/certificats" label="Mes certificats" />
      {!p.name.trim() && (
        <p className="mb-4 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-[15px] text-cream print:hidden">
          Ajoutez votre nom dans{" "}
          <Link href="/compte/parametres" className="underline">
            Paramètres
          </Link>{" "}
          pour qu&apos;il apparaisse sur le certificat.
        </p>
      )}
      <motion.article
        initial={{ opacity: 0, scale: 0.96, rotateX: 8 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        data-theme="dark"
        className="relative min-h-[540px] overflow-hidden rounded-[28px] bg-[#0f0d0a] sm:aspect-[1.414] sm:min-h-0 text-[#f3ebdd] shadow-[0_50px_120px_-40px_rgb(0_0_0/0.7)] print:rounded-none print:shadow-none"
        style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
      >
        {/* guilloché-like rings */}
        <svg viewBox="0 0 1000 707" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
          <defs>
            <radialGradient id="cert-glow" cx="80%" cy="20%" r="70%">
              <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1000" height="707" fill="url(#cert-glow)" />
          <rect x="24" y="24" width="952" height="659" rx="18" fill="none" stroke="#e9b44c" strokeOpacity="0.55" strokeWidth="1.5" />
          <rect x="36" y="36" width="928" height="635" rx="12" fill="none" stroke="#e9b44c" strokeOpacity="0.25" />
          {Array.from({ length: 14 }, (_, i) => (
            <circle key={i} cx="860" cy="560" r={40 + i * 14} fill="none" stroke="#e9b44c" strokeOpacity={0.12 - i * 0.006} />
          ))}
        </svg>

        <div className="relative flex h-full min-h-[540px] flex-col p-7 sm:min-h-0 sm:p-[6%]">
          <div className="flex items-center gap-3">
            <CauriMark className="h-[clamp(1.5rem,4vw,2.5rem)] w-auto" />
            <span className="font-display text-[clamp(1rem,2.4vw,1.6rem)]">assu school</span>
          </div>

          <div className="mt-[5%] text-[clamp(0.6rem,1.3vw,0.85rem)] tracking-[0.3em] text-[#e9b44c] uppercase">
            Certificat de réussite · {meta.subtitle}
          </div>
          <div className="mt-[2%] text-[clamp(0.8rem,1.6vw,1.05rem)] text-[#f3ebdd]/75">Décerné à</div>
          <div className="font-display text-[clamp(1.8rem,6vw,4.4rem)] leading-[1.05]">{name}</div>
          <div className="mt-[2%] max-w-full sm:max-w-[70%] text-[clamp(0.8rem,1.7vw,1.15rem)] leading-relaxed text-[#f3ebdd]/85">
            pour avoir terminé avec succès {id === "final" ? "l'ensemble du parcours" : "le chapitre"}{" "}
            <span className="font-display" style={{ color: id === "final" ? "#e9b44c" : accent }}>
              « {meta.title} »
            </span>{" "}
            d&apos;Assu School, l&apos;école de l&apos;argent.
          </div>

          <div className="mt-auto flex items-end justify-between gap-6">
            <div className="space-y-1 text-[clamp(0.6rem,1.3vw,0.9rem)]">
              <div className="text-[#f3ebdd]/70">Délivré le</div>
              <div className="font-display text-[clamp(0.9rem,1.8vw,1.2rem)]">{date}</div>
              <div className="pt-2 text-[#f3ebdd]/70">Code de vérification</div>
              <div className="font-mono tracking-wider">{verificationCode(name, id)}</div>
            </div>
            {/* seal */}
            <motion.div
              initial={{ rotate: -40, scale: 0.4, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.5 }}
              className="relative grid aspect-square w-24 shrink-0 place-items-center sm:w-[16%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#f6d58e,#c08419)] shadow-[0_10px_30px_-8px_rgb(233_180_76/0.6)]"
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_40s_linear_infinite] print:animate-none" aria-hidden>
                <defs>
                  <path id="seal-path" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
                </defs>
                <text fontSize="7.5" fill="#3a2a10" letterSpacing="2.2" fontFamily="var(--font-geist-mono)">
                  <textPath href="#seal-path">ASSU SCHOOL · CERTIFIÉ · ASSU SCHOOL · CERTIFIÉ ·</textPath>
                </text>
              </svg>
              <CauriMark className="relative h-[42%] w-auto" />
            </motion.div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
