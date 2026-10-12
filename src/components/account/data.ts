import { allLessons, chapters, type Chapter } from "@/lib/content";

/* ───────────── Demo records (no backend yet — always labelled as such in the UI) ───────────── */

export type Invoice = {
  id: string;
  date: string;
  label: string;
  period: string;
  amount: number;
  method: "Orange Money" | "Wave" | "MTN MoMo" | "Carte Visa";
  status: "payée" | "remboursée";
};

export const demoInvoices: Invoice[] = [
  { id: "AS-2026-0412", date: "2026-09-14", label: "Assu School Premium · annuel", period: "14 sept. 2026 → 13 sept. 2027", amount: 15_000, method: "Wave", status: "payée" },
  { id: "AS-2026-0288", date: "2026-08-14", label: "Assu School Premium · mensuel", period: "14 août → 13 sept. 2026", amount: 2_000, method: "Orange Money", status: "payée" },
  { id: "AS-2026-0157", date: "2026-07-14", label: "Assu School Premium · mensuel", period: "14 juil. → 13 août 2026", amount: 2_000, method: "MTN MoMo", status: "remboursée" },
];

export const demoSessions = [
  { id: "s1", device: "Chrome · macOS", place: "Dakar, Sénégal", when: "Session actuelle", current: true },
  { id: "s2", device: "Application · Android", place: "Abidjan, Côte d'Ivoire", when: "Il y a 2 jours", current: false },
  { id: "s3", device: "Safari · iPhone", place: "Cotonou, Bénin", when: "Il y a 3 semaines", current: false },
];

export const demoPaymentMethods = [
  { id: "p1", label: "Wave", detail: "+221 •• ••• 42 18", primary: true },
  { id: "p2", label: "Orange Money", detail: "+221 •• ••• 07 63", primary: false },
];

export const findInvoice = (id: string) => demoInvoices.find((i) => i.id === id);

/* ───────────── Derived from real progress ───────────── */

export function chapterStats(done: Set<string>) {
  return chapters.map((c) => {
    const lessons = allLessons.filter((l) => l.chapter.number === c.number);
    const ready = lessons.filter((l) => l.ready);
    const doneCount = lessons.filter((l) => done.has(l.slug)).length;
    return { chapter: c, total: lessons.length, ready: ready.length, done: doneCount };
  });
}

export const minutesLearned = (done: Set<string>) =>
  allLessons.filter((l) => done.has(l.slug)).reduce((n, l) => n + l.minutes, 0);

export const nextLesson = (done: Set<string>) => allLessons.find((l) => l.ready && !done.has(l.slug));

export type Certificate = {
  id: string;
  title: string;
  subtitle: string;
  chapter?: Chapter;
  unlocked: boolean;
  /** Human-readable requirement shown while locked. */
  requirement: string;
  progress: number;
};

/** A chapter certificate needs every lesson of the chapter; the final one needs the whole course. */
export function certificates(done: Set<string>): Certificate[] {
  const perChapter = chapters.map((c) => {
    const lessons = allLessons.filter((l) => l.chapter.number === c.number);
    const doneCount = lessons.filter((l) => done.has(l.slug)).length;
    const available = lessons.every((l) => l.ready);
    return {
      id: c.number,
      title: c.title,
      subtitle: `Chapitre ${c.number}`,
      chapter: c,
      unlocked: available && doneCount === lessons.length,
      requirement: available
        ? `Terminez les ${lessons.length} leçons du chapitre (${doneCount}/${lessons.length}).`
        : `Disponible quand toutes les leçons du chapitre seront en ligne.`,
      progress: doneCount / lessons.length,
    };
  });
  const all = allLessons.filter((l) => done.has(l.slug)).length;
  return [
    ...perChapter,
    {
      id: "final",
      title: "Éducation financière",
      subtitle: "Certificat de fin de parcours",
      unlocked: all === allLessons.length,
      requirement: `Terminez les ${allLessons.length} leçons du parcours (${all}/${allLessons.length}).`,
      progress: all / allLessons.length,
    },
  ];
}

export function findCertificateMeta(id: string) {
  if (id === "final") return { title: "Éducation financière", subtitle: "Certificat de fin de parcours", chapter: undefined };
  const c = chapters.find((ch) => ch.number === id);
  return c ? { title: c.title, subtitle: `Chapitre ${c.number}`, chapter: c } : null;
}

export const certificateIds = [...chapters.map((c) => c.number), "final"];

/** Stable, human-checkable code: ASSU-01-7K2Q9F. */
export function verificationCode(name: string, id: string) {
  let h = 2166136261;
  for (const ch of `${name.trim().toLowerCase()}|${id}`) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return `ASSU-${id === "final" ? "FIN" : id}-${(h >>> 0).toString(36).toUpperCase().padStart(6, "0").slice(0, 6)}`;
}

export type Badge = { id: string; title: string; text: string; earned: boolean; color: string };

export function badges(done: Set<string>): Badge[] {
  const n = done.size;
  const ch1 = allLessons.filter((l) => l.chapter.number === "01");
  return [
    { id: "start", title: "Premiers pas", text: "Terminer une leçon", earned: n >= 1, color: "var(--gold)" },
    { id: "five", title: "Sur la lancée", text: "Terminer 5 leçons", earned: n >= 5, color: "var(--mint)" },
    { id: "found", title: "Fondations", text: "Finir le chapitre 01", earned: ch1.every((l) => done.has(l.slug)), color: "var(--gold-soft)" },
    { id: "budget", title: "Budget en main", text: "Leçon 50/30/20", earned: done.has("budget-50-30-20"), color: "var(--gold)" },
    { id: "shield", title: "Bouclier", text: "Épargne de précaution", earned: done.has("epargne-de-precaution"), color: "var(--mint)" },
    { id: "goal", title: "Cap fixé", text: "Épargne d'objectif", earned: done.has("epargne-d-objectif"), color: "#9fb6ff" },
    { id: "grow", title: "Investisseur", text: "Épargne d'investissement", earned: done.has("epargne-d-investissement"), color: "var(--ember)" },
    { id: "ten", title: "Assidu", text: "Terminer 10 leçons", earned: n >= 10, color: "#d9a6ff" },
  ];
}


export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
