"use client";

import { motion } from "motion/react";
import { type Profile, initials, setThemePref, updateProfile, useProfile, useThemePref } from "./store";
import { Avatar, Card, Choice, Field, PageHead, Toggle, inputClass, useToast } from "./ui";

const colors = ["#e9b44c", "#6fd39a", "#e2603b", "#9fb6ff", "#d9a6ff", "#ff9fb0"];

const codes = [
  ["+221", "Sénégal"],
  ["+225", "Côte d'Ivoire"],
  ["+229", "Bénin"],
  ["+226", "Burkina Faso"],
  ["+223", "Mali"],
  ["+227", "Niger"],
  ["+228", "Togo"],
  ["+237", "Cameroun"],
  ["+241", "Gabon"],
  ["+33", "France"],
] as const;

export function Settings() {
  const p = useProfile();
  const theme = useThemePref();
  const toast = useToast();

  const save = (patch: Partial<Profile>, msg = "Enregistré") => {
    updateProfile(patch);
    toast.show(msg);
  };

  return (
    <>
      <PageHead title="Paramètres" text="Vos informations et vos préférences. Tout est enregistré automatiquement sur cet appareil." />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Profil" text="Ce nom apparaît sur vos certificats.">
          <div className="flex flex-wrap items-center gap-5">
            <motion.div key={p.avatarColor} initial={{ scale: 0.8, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
              <Avatar name={initials(p.name)} color={p.avatarColor} size={76} />
            </motion.div>
            <div>
              <div className="mb-2 text-sm text-cream/85">Couleur de l&apos;avatar</div>
              <div className="flex gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => save({ avatarColor: c })}
                    aria-label={`Couleur ${c}`}
                    aria-pressed={p.avatarColor === c}
                    className="relative size-9 rounded-full transition-transform hover:scale-110"
                    style={{ background: c }}
                  >
                    {p.avatarColor === c && (
                      <motion.span layoutId="avatar-color" className="absolute -inset-1 rounded-full border-2 border-cream" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Nom complet">
                {(id) => (
                  <input
                    id={id}
                    className={inputClass}
                    placeholder="Ex. Aminata Diallo"
                    defaultValue={p.name}
                    key={`name-${p.name}`}
                    onBlur={(e) => e.target.value !== p.name && save({ name: e.target.value.trim() })}
                    autoComplete="name"
                  />
                )}
              </Field>
            </div>
            <Field label="Téléphone" hint="Pour la connexion et les rappels.">
              {(id) => (
                <div className="flex min-w-0 gap-2">
                  <select
                    aria-label="Indicatif"
                    className={`${inputClass.replace("w-full ", "")} w-[6.5rem] shrink-0 px-2.5`}
                    value={p.phoneCode}
                    onChange={(e) => save({ phoneCode: e.target.value })}
                  >
                    {codes.map(([c, country]) => (
                      <option key={c} value={c}>
                        {c} {country}
                      </option>
                    ))}
                  </select>
                  <input
                    id={id}
                    className={`${inputClass} min-w-0`}
                    inputMode="tel"
                    placeholder="77 123 45 67"
                    defaultValue={p.phone}
                    key={`phone-${p.phone}`}
                    onBlur={(e) => e.target.value !== p.phone && save({ phone: e.target.value.trim() })}
                    autoComplete="tel-national"
                  />
                </div>
              )}
            </Field>
            <Field label="E-mail (facultatif)">
              {(id) => (
                <input
                  id={id}
                  type="email"
                  className={inputClass}
                  placeholder="vous@exemple.com"
                  defaultValue={p.email}
                  key={`email-${p.email}`}
                  onBlur={(e) => e.target.value !== p.email && save({ email: e.target.value.trim() })}
                  autoComplete="email"
                />
              )}
            </Field>
          </div>
        </Card>

        <div className="grid gap-4">
          <Card title="Apparence et langue" delay={0.05}>
            <div className="space-y-5">
              <div>
                <div className="mb-2 text-sm text-cream/85">Thème</div>
                <Choice
                  label="Thème"
                  value={theme}
                  onChange={(v) => {
                    setThemePref(v);
                    toast.show("Thème mis à jour");
                  }}
                  options={[
                    { value: "system", label: "Système" },
                    { value: "light", label: "Clair" },
                    { value: "dark", label: "Sombre" },
                  ]}
                />
              </div>
              <div>
                <div className="mb-2 text-sm text-cream/85">Langue</div>
                <Choice
                  label="Langue"
                  value={p.language}
                  onChange={(v) => save({ language: v })}
                  options={[
                    { value: "fr", label: "Français" },
                    { value: "wo", label: "Wolof", disabled: "bientôt" },
                    { value: "dyu", label: "Dioula", disabled: "bientôt" },
                  ]}
                />
              </div>
            </div>
          </Card>

          <Card title="Objectif d'apprentissage" text="Une petite dose chaque jour vaut mieux qu'un marathon." delay={0.1}>
            <div className="flex flex-wrap items-end gap-5">
              <div>
                <div className="mb-2 text-sm text-cream/85">Par jour</div>
                <Choice
                  label="Objectif quotidien"
                  value={p.goal}
                  onChange={(v) => save({ goal: v })}
                  options={[
                    { value: 5, label: "5 min" },
                    { value: 10, label: "10 min" },
                    { value: 20, label: "20 min" },
                  ]}
                />
              </div>
              <Field label="Rappel">
                {(id) => (
                  <input id={id} type="time" className={`${inputClass} w-36`} value={p.reminder} onChange={(e) => save({ reminder: e.target.value }, "Rappel enregistré")} />
                )}
              </Field>
            </div>
          </Card>
        </div>

        <Card title="Notifications" text="Comment voulez-vous recevoir vos rappels ?" delay={0.1}>
          <div className="divide-y divide-line">
            <Toggle label="WhatsApp" hint="Un message court au moment du rappel." checked={p.notifications.whatsapp} onChange={(v) => save({ notifications: { ...p.notifications, whatsapp: v } })} />
            <Toggle label="SMS" hint="Utile sans connexion internet." checked={p.notifications.sms} onChange={(v) => save({ notifications: { ...p.notifications, sms: v } })} />
            <Toggle label="E-mail" hint="Le résumé de la semaine." checked={p.notifications.email} onChange={(v) => save({ notifications: { ...p.notifications, email: v } })} disabled={!p.email} />
          </div>
          {!p.email && <p className="mt-2 text-[13px] text-muted">Ajoutez un e-mail pour activer cette option.</p>}
        </Card>

        <Card title="Confort et données" delay={0.15}>
          <div className="divide-y divide-line">
            <Toggle label="Texte plus grand" hint="Agrandit les textes de votre espace." checked={p.largeText} onChange={(v) => save({ largeText: v })} />
            <Toggle label="Économie de données" hint="Animations plus légères, idéal avec un petit forfait." checked={p.dataSaver} onChange={(v) => save({ dataSaver: v })} />
            <Toggle label="Sons" hint="Petits sons de réussite dans les quiz." checked={p.sound} onChange={(v) => save({ sound: v })} />
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            Les animations suivent aussi le réglage « réduire les animations » de votre appareil.
          </p>
        </Card>
      </div>
      {toast.node}
    </>
  );
}
