export type LessonKind = "vidéo" | "exercice" | "simulateur";

export type Lesson = {
  title: string;
  minutes: number;
  kind: LessonKind;
  free?: boolean;
  /** Lessons with a slug have a full page under /cours/[slug]. */
  slug?: string;
};

export type Chapter = {
  number: string;
  title: string;
  tagline: string;
  accent: string;
  lessons: Lesson[];
};

export const chapters: Chapter[] = [
  {
    number: "01",
    title: "Les fondations",
    tagline: "Comprendre ce qu'est vraiment l'argent, et pourquoi personne ne vous l'a expliqué.",
    accent: "var(--gold-soft)",
    lessons: [
      { title: "Ce que l'école ne vous a pas appris", minutes: 12, kind: "vidéo", free: true, slug: "ce-que-l-ecole-ne-vous-a-pas-appris" },
      { title: "Du cauri au franc CFA : une histoire de la monnaie", minutes: 18, kind: "vidéo", free: true, slug: "du-cauri-au-franc-cfa" },
      { title: "L'inflation, cet impôt invisible sur le marché", minutes: 16, kind: "simulateur", free: true, slug: "l-inflation" },
      { title: "Actifs et passifs", minutes: 14, kind: "exercice", free: true, slug: "actifs-et-passifs" },
      { title: "Dresser votre bilan personnel", minutes: 20, kind: "exercice", free: true, slug: "bilan-personnel" },
    ],
  },
  {
    number: "02",
    title: "Revenus irréguliers",
    tagline: "Commerce, prestations, salaire en retard : tenir un budget quand rien ne tombe deux fois pareil.",
    accent: "var(--gold)",
    lessons: [
      { title: "Le budget 50/30/20, version réelle", minutes: 18, kind: "simulateur", free: true, slug: "budget-50-30-20" },
      { title: "Le budget quand le revenu varie", minutes: 19, kind: "vidéo" },
      { title: "Se verser un « salaire » à soi-même", minutes: 15, kind: "exercice" },
      { title: "Séparer l'argent du commerce et l'argent de la maison", minutes: 17, kind: "vidéo" },
      { title: "L'épargne de précaution", minutes: 16, kind: "simulateur", free: true, slug: "epargne-de-precaution" },
      { title: "Mois creux, mois pleins : lisser sur l'année", minutes: 16, kind: "simulateur" },
      { title: "Dettes : bonnes, mauvaises, toxiques", minutes: 21, kind: "vidéo" },
    ],
  },
  {
    number: "03",
    title: "Famille & pression sociale",
    tagline: "Aider les siens sans s'oublier. Le chapitre dont personne ne parle, et dont tout le monde a besoin.",
    accent: "var(--ember)",
    lessons: [
      { title: "Pourquoi on se sent toujours redevable", minutes: 14, kind: "vidéo", free: true },
      { title: "Le budget solidarité : donner avec une limite", minutes: 18, kind: "exercice" },
      { title: "Dire non avec respect", minutes: 16, kind: "vidéo" },
      { title: "Baptêmes, mariages, funérailles : anticiper les cérémonies", minutes: 20, kind: "simulateur" },
      { title: "Tabaski, Noël, rentrée : les mois qui coûtent cher", minutes: 13, kind: "simulateur" },
      { title: "Parler d'argent en couple et en famille", minutes: 19, kind: "vidéo" },
    ],
  },
  {
    number: "04",
    title: "Tontine & Mobile Money",
    tagline: "Les outils financiers que vous utilisez déjà, enfin utilisés à votre avantage.",
    accent: "var(--mint)",
    lessons: [
      { title: "La tontine, première banque d'Afrique", minutes: 17, kind: "vidéo", free: true },
      { title: "Tontine rotative ou cumulative : laquelle choisir ?", minutes: 15, kind: "simulateur" },
      { title: "Les risques d'une tontine, et comment s'en protéger", minutes: 18, kind: "vidéo" },
      { title: "Les vrais frais du Mobile Money", minutes: 14, kind: "simulateur" },
      { title: "Épargner sur son téléphone", minutes: 12, kind: "vidéo" },
      { title: "Arnaques par SMS et appels : les reconnaître en 30 secondes", minutes: 15, kind: "vidéo" },
      { title: "Microcrédit et prêts sur mobile : lire le vrai taux", minutes: 19, kind: "exercice" },
    ],
  },
  {
    number: "05",
    title: "Épargner & investir à la BRVM",
    tagline: "Le moteur le plus puissant de la finance : le temps multiplié par la régularité.",
    accent: "#9fb6ff",
    lessons: [
      { title: "L'épargne d'objectif", minutes: 17, kind: "simulateur", free: true, slug: "epargne-d-objectif" },
      { title: "L'épargne d'investissement", minutes: 22, kind: "simulateur", free: true, slug: "epargne-d-investissement" },
      { title: "Les intérêts composés en détail", minutes: 18, kind: "simulateur" },
      { title: "Compte épargne, DAT, assurance-vie : où placer son argent ?", minutes: 21, kind: "vidéo" },
      { title: "La BRVM expliquée simplement", minutes: 26, kind: "vidéo" },
      { title: "Choisir une SGI et ouvrir son compte-titres", minutes: 18, kind: "exercice" },
      { title: "Actions, dividendes et rendement", minutes: 24, kind: "vidéo" },
      { title: "Les obligations d'État de l'UEMOA", minutes: 20, kind: "vidéo" },
      { title: "FCP et OPCVM : investir à plusieurs", minutes: 17, kind: "vidéo" },
      { title: "Construire votre premier portefeuille", minutes: 30, kind: "exercice" },
    ],
  },
  {
    number: "06",
    title: "Terrain & immobilier",
    tagline: "Acheter un terrain, construire petit à petit, louer : faire les calculs avant de poser la première brique.",
    accent: "#d9a6ff",
    lessons: [
      { title: "Titre foncier, permis d'habiter, attestation : les papiers qui comptent", minutes: 24, kind: "vidéo", free: true },
      { title: "Éviter les arnaques au terrain", minutes: 18, kind: "vidéo" },
      { title: "Construire par étapes sans s'endetter", minutes: 22, kind: "simulateur" },
      { title: "Rendement locatif : le vrai calcul", minutes: 20, kind: "exercice" },
      { title: "Le crédit immobilier et l'effet de levier", minutes: 19, kind: "vidéo" },
    ],
  },
  {
    number: "07",
    title: "Retraite & protection",
    tagline: "Préparer ses vieux jours quand on est salarié, indépendant ou commerçant.",
    accent: "#ff9fb0",
    lessons: [
      { title: "Comment fonctionne la retraite par répartition", minutes: 16, kind: "vidéo", free: true },
      { title: "Indépendants : construire sa propre retraite", minutes: 21, kind: "simulateur" },
      { title: "Calculer votre chiffre de liberté", minutes: 18, kind: "simulateur" },
      { title: "Assurance santé, décès, biens : ce qui vaut le coup", minutes: 20, kind: "vidéo" },
      { title: "Protéger et transmettre", minutes: 19, kind: "vidéo" },
      { title: "Votre plan sur dix ans", minutes: 32, kind: "exercice" },
    ],
  },
];

export const totalLessons = chapters.reduce((n, c) => n + c.lessons.length, 0);
export const totalMinutes = chapters.reduce(
  (n, c) => n + c.lessons.reduce((m, l) => m + l.minutes, 0),
  0,
);
export const freeLessons = chapters.reduce(
  (n, c) => n + c.lessons.filter((l) => l.free).length,
  0,
);

export const testimonials = [
  {
    quote:
      "Mes revenus changent chaque semaine. Avec le « salaire à soi-même », je sais enfin combien dépenser sans toucher au stock.",
    name: "Aminata D.",
    role: "Commerçante, Dakar",
  },
  {
    quote:
      "J'aide toujours mes parents. Mais avec un budget solidarité, je n'ai plus honte de dire non.",
    name: "Koffi A.",
    role: "Chauffeur VTC, Abidjan",
  },
  {
    quote:
      "Je pensais que la BRVM, c'était pour les riches. J'ai acheté mes premières actions avec 50 000 FCFA.",
    name: "Mariam K.",
    role: "Infirmière, Ouagadougou",
  },
  {
    quote:
      "Six ans de tontine entre collègues. Le simulateur nous a montré comment faire mieux.",
    name: "Edem T.",
    role: "Fonctionnaire, Lomé",
  },
  {
    quote:
      "Des leçons courtes, légères en données. Je les regarde dans le bus.",
    name: "Fatou S.",
    role: "Étudiante, Cotonou",
  },
  {
    quote:
      "Offert à nos 400 agents. Les avances sur salaire ont nettement baissé.",
    name: "Ibrahima N.",
    role: "DRH, Bamako",
  },
];

export const faqs = [
  {
    q: "Qu'est-ce qui est gratuit ?",
    a: "Tout le premier chapitre, la première leçon de chaque chapitre, les simulateurs de base et la communauté. Sans carte, sans engagement : un numéro de téléphone suffit.",
  },
  {
    q: "Comment payer le Premium ?",
    a: "Orange Money, Wave, MTN MoMo, Moov Money ou carte bancaire. Au mois ou à l'année, et vous pouvez arrêter quand vous voulez.",
  },
  {
    q: "Je n'y connais absolument rien. Est-ce pour moi ?",
    a: "Oui, c'est même pour vous qu'on l'a conçu. On part de zéro, sans jargon, avec des exemples en FCFA tirés de la vie de tous les jours : le marché, la tontine, le transfert à la famille.",
  },
  {
    q: "Vendez-vous des produits financiers ?",
    a: "Non. Assu School ne touche aucune commission sur les placements, les crédits ou les SGI dont on parle. Le cours est éducatif et ne constitue pas un conseil en investissement personnalisé.",
  },
  {
    q: "Ça consomme beaucoup de données ?",
    a: "Non. Les leçons sont courtes et la qualité vidéo s'adapte à votre connexion. Vous pouvez aussi télécharger une leçon en Wi-Fi pour la regarder plus tard.",
  },
  {
    q: "Mon organisation peut-elle l'offrir à ses membres ?",
    a: "Oui. Banques, institutions de microfinance, mutuelles, assureurs, coopératives et entreprises proposent Assu School à leurs clients, membres ou employés, avec un tableau de bord pour suivre l'impact.",
  },
];

export const pillars = [
  "Tontine",
  "Mobile Money",
  "Revenus irréguliers",
  "Budget solidarité",
  "BRVM",
  "Épargne",
  "Terrain",
  "Retraite",
  "Assurance",
  "Microcrédit",
  "Arnaques",
  "Transmission",
];

export const countries = ["SN", "CI", "BJ", "BF", "ML", "NE", "TG", "GW", "CM", "GA"];

/** Lessons with written content (an explicit slug marks a lesson as ready). */
export const courseLessons = chapters.flatMap((c) =>
  c.lessons.flatMap((l) => (l.slug ? [{ ...l, slug: l.slug, chapter: c }] : [])),
);

export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type CourseLesson = Lesson & {
  slug: string;
  /** Has a full written lesson; otherwise the page shows a Premium lock or "bientôt". */
  ready: boolean;
  chapter: Chapter;
  /** 1-based position in the whole course. */
  number: number;
};

/** Every lesson of the course, in order, each with its own page under /cours/[slug]. */
export const allLessons: CourseLesson[] = chapters
  .flatMap((c) => c.lessons.map((l) => ({ ...l, slug: l.slug ?? slugify(l.title), ready: Boolean(l.slug), chapter: c })))
  .map((l, i) => ({ ...l, number: i + 1 }));

export const firstLesson = allLessons[0];
