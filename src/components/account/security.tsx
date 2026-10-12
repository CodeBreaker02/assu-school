"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { demoSessions } from "./data";
import { deleteLocalAccount, exportLocalData, resetProgress, updateProfile, useProfile } from "./store";
import { Card, Choice, DemoBadge, Field, PageHead, inputClass, useToast } from "./ui";

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(4, s);
}
const levels = [
  { label: "Trop faible", color: "var(--ember)" },
  { label: "Faible", color: "var(--ember)" },
  { label: "Correct", color: "var(--gold)" },
  { label: "Bon", color: "var(--mint)" },
  { label: "Excellent", color: "var(--mint)" },
];

function PasswordCard({ onDone }: { onDone: (m: string) => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const s = strength(next);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return setError("Entrez votre mot de passe actuel.");
    if (next.length < 8) return setError("Le nouveau mot de passe doit faire au moins 8 caractères.");
    if (s < 2) return setError("Choisissez un mot de passe plus solide.");
    if (next !== confirm) return setError("Les deux mots de passe ne correspondent pas.");
    setError("");
    setCurrent("");
    setNext("");
    setConfirm("");
    onDone("Mot de passe mis à jour (démo)");
  };

  return (
    <Card title="Mot de passe" action={<DemoBadge label="Aucun serveur : démonstration" />}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Mot de passe actuel">
          {(id) => <input id={id} type="password" autoComplete="current-password" className={inputClass} value={current} onChange={(e) => setCurrent(e.target.value)} />}
        </Field>
        <Field label="Nouveau mot de passe">
          {(id) => <input id={id} type="password" autoComplete="new-password" className={inputClass} value={next} onChange={(e) => setNext(e.target.value)} />}
        </Field>
        {next && (
          <div aria-live="polite">
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 flex-1 rounded-full"
                  animate={{ background: i < s ? levels[s].color : "var(--line-strong)" }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
            <div className="mt-1.5 text-[13px]" style={{ color: levels[s].color }}>
              {levels[s].label} · 12 caractères, chiffres et symboles recommandés
            </div>
          </div>
        )}
        <Field label="Confirmer le nouveau mot de passe">
          {(id) => <input id={id} type="password" autoComplete="new-password" className={inputClass} value={confirm} onChange={(e) => setConfirm(e.target.value)} />}
        </Field>
        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-[14px] text-ember" role="alert">
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        <button type="submit" className="rounded-full bg-cream px-5 py-3 text-sm font-medium text-ink active:scale-95">
          Mettre à jour
        </button>
      </form>
    </Card>
  );
}

function Danger({
  title,
  text,
  action,
  confirmText,
  onConfirm,
}: {
  title: string;
  text: string;
  action: string;
  confirmText: string;
  onConfirm: () => void;
}) {
  const [asking, setAsking] = useState(false);
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4">
      <div className="min-w-0 max-w-md">
        <div className="text-[15px] text-cream">{title}</div>
        <div className="mt-0.5 text-[13px] leading-snug text-muted">{text}</div>
      </div>
      <AnimatePresence mode="wait">
        {asking ? (
          <motion.div key="ask" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex gap-2">
            <button type="button" onClick={() => setAsking(false)} className="rounded-full border border-line-strong px-4 py-2 text-sm hover:bg-cream/5">
              Annuler
            </button>
            <button
              type="button"
              onClick={() => {
                setAsking(false);
                onConfirm();
              }}
              className="rounded-full bg-ember px-4 py-2 text-sm font-medium text-[#0a0907]"
            >
              {confirmText}
            </button>
          </motion.div>
        ) : (
          <motion.button key="btn" type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAsking(true)} className="rounded-full border border-ember/50 px-4 py-2 text-sm text-ember hover:bg-ember/10">
            {action}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Security() {
  const p = useProfile();
  const toast = useToast();
  const router = useRouter();
  const [sessions, setSessions] = useState(demoSessions);

  return (
    <>
      <PageHead title="Sécurité" text="Protégez votre compte et gardez la main sur vos données." />

      <div className="grid gap-4 xl:grid-cols-2">
        <PasswordCard onDone={toast.show} />

        <div className="grid gap-4">
          <Card title="Double authentification" text="Un code en plus du mot de passe à chaque nouvelle connexion." delay={0.05} action={<DemoBadge label="Démo" />}>
            <Choice
              label="Double authentification"
              value={p.twoFactor}
              onChange={(v) => {
                updateProfile({ twoFactor: v });
                toast.show(v === "off" ? "Double authentification désactivée (démo)" : "Double authentification activée (démo)");
              }}
              options={[
                { value: "off", label: "Désactivée" },
                { value: "sms", label: "Par SMS" },
                { value: "app", label: "Application" },
              ]}
            />
            <AnimatePresence mode="wait">
              <motion.p key={p.twoFactor} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 text-[15px] leading-relaxed text-cream/80">
                {p.twoFactor === "off"
                  ? "Recommandé : activez-la, surtout si vous payez avec Mobile Money."
                  : p.twoFactor === "sms"
                    ? `Un code sera envoyé au ${p.phone ? `${p.phoneCode} ${p.phone}` : "numéro de votre profil"}.`
                    : "Utilisez une application comme Google Authenticator."}
              </motion.p>
            </AnimatePresence>
          </Card>

          <Card title="Appareils connectés" delay={0.1} action={<DemoBadge />}>
            <ul className="divide-y divide-line">
              <AnimatePresence initial={false}>
                {sessions.map((s) => (
                  <motion.li key={s.id} layout exit={{ opacity: 0, x: 30, height: 0 }} className="flex items-center gap-3 overflow-hidden py-3.5">
                    <span className={`size-2.5 shrink-0 rounded-full ${s.current ? "bg-mint" : "bg-cream/30"}`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] text-cream">{s.device}</div>
                      <div className="text-[13px] text-muted">
                        {s.place} · {s.when}
                      </div>
                    </div>
                    {!s.current && (
                      <button
                        type="button"
                        onClick={() => {
                          setSessions((list) => list.filter((x) => x.id !== s.id));
                          toast.show("Appareil déconnecté (démo)");
                        }}
                        className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm hover:bg-cream/5"
                      >
                        Déconnecter
                      </button>
                    )}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </Card>
        </div>

        <Card title="Mes données" text="Tout ce que vous faites ici est stocké sur cet appareil." delay={0.1} className="xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
            <div className="max-w-md">
              <div className="text-[15px] text-cream">Exporter mes données</div>
              <div className="mt-0.5 text-[13px] text-muted">Profil, progression et certificats, dans un fichier JSON.</div>
            </div>
            <button
              type="button"
              onClick={() => {
                exportLocalData();
                toast.show("Export téléchargé");
              }}
              className="rounded-full bg-cream px-4 py-2 text-sm font-medium text-ink active:scale-95"
            >
              Télécharger
            </button>
          </div>
          <div className="divide-y divide-line">
            <Danger
              title="Réinitialiser ma progression"
              text="Remet toutes les leçons à zéro. Vos paramètres sont conservés."
              action="Réinitialiser"
              confirmText="Oui, tout remettre à zéro"
              onConfirm={() => {
                resetProgress();
                toast.show("Progression réinitialisée");
              }}
            />
            <Danger
              title="Supprimer mon compte"
              text="Efface le profil, la progression et les certificats de cet appareil. Action définitive."
              action="Supprimer"
              confirmText="Supprimer définitivement"
              onConfirm={() => {
                deleteLocalAccount();
                router.push("/");
              }}
            />
          </div>
        </Card>
      </div>
      {toast.node}
    </>
  );
}
