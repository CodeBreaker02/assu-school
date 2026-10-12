/**
 * Written content for the lessons that have a full page under /cours/[slug].
 * Inline text supports **bold** only; everything else is structured blocks.
 */

import { chapterOne } from "./lessons-ch1";

export type WidgetId = "budget" | "precaution" | "objectif" | "croissance" | "inflation" | "bilan";

/** Animated "video" scene shown at the top of the lesson. */
export type SceneId = "jars" | "shield" | "road" | "growth" | "orbit" | "history" | "basket" | "flows" | "balance";

export type Block =
  | { type: "h2"; id: string; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; tone: "info" | "tip" | "warning"; title: string; text: string }
  | {
      type: "example";
      title: string;
      lines: [string, string][];
      result: [string, string];
      note?: string;
    }
  | { type: "compare"; columns: { title: string; tone: "good" | "bad" | "neutral"; items: string[] }[] }
  | { type: "widget"; widget: WidgetId }
  /** One question from the lesson's quiz bank, asked inline (active recall). */
  | { type: "check"; id: string }
  /** Vertical timeline that draws itself as you scroll. */
  | { type: "timeline"; items: { when: string; title: string; text: string }[] }
  /** Cards that flip from a common belief to the reality. */
  | { type: "myths"; items: { myth: string; truth: string }[] }
  /** Tap-to-classify exercise with instant feedback. */
  | {
      type: "sort";
      prompt: string;
      bins: [string, string];
      items: { label: string; bin: 0 | 1; why: string }[];
    };

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type LessonContent = {
  subtitle: string;
  scene: SceneId;
  captions: string[];
  blocks: Block[];
  keyPoints: string[];
  quiz: QuizQuestion[];
  /** Outside resources shown in the lesson's "Liens" panel. Official sources only. */
  links?: { label: string; href: string; note?: string }[];
};

export const lessonContent: Record<string, LessonContent> = {
  ...chapterOne,
  "budget-50-30-20": {
    scene: "jars",
    subtitle:
      "La règle la plus célèbre du budget personnel, et comment l'adapter quand le revenu varie et que la famille compte sur vous.",
    captions: [
      "Votre argent arrive. Avant de le dépenser, on le découpe.",
      "50 % pour les besoins : ce qui est indispensable.",
      "30 % pour les envies… et la solidarité.",
      "20 % pour votre futur : l'épargne.",
      "Une règle simple. À adapter à votre vie.",
    ],
    blocks: [
      { type: "h2", id: "idee", text: "L'idée en une phrase" },
      {
        type: "p",
        text: "Le 50/30/20 découpe chaque revenu en trois parts : **50 %** pour les besoins, **30 %** pour les envies, **20 %** pour l'épargne. Popularisée aux États-Unis par Elizabeth Warren, la règle a un mérite énorme : elle tient sur un bout de papier.",
      },
      {
        type: "p",
        text: "Ce n'est pas une loi. C'est un point de départ, qui vous dit si votre budget est équilibré ou s'il penche dangereusement d'un côté.",
      },
      { type: "check", id: "q1" },
      { type: "h2", id: "trois-parts", text: "Les trois parts" },
      {
        type: "compare",
        columns: [
          {
            title: "Besoins · 50 %",
            tone: "neutral",
            items: ["Loyer", "Nourriture de base", "Transport pour travailler", "Eau, électricité, gaz", "Scolarité", "Santé"],
          },
          {
            title: "Envies · 30 %",
            tone: "neutral",
            items: ["Sorties et restaurants", "Vêtements au-delà du nécessaire", "Abonnements", "Nouveau téléphone", "Aide à la famille et cérémonies"],
          },
          {
            title: "Épargne · 20 %",
            tone: "good",
            items: ["Épargne de précaution", "Épargne d'objectif", "Investissement", "Remboursement anticipé de dettes"],
          },
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Le test du besoin",
        text: "Demandez-vous : « Si je supprime cette dépense, est-ce que ma vie ou mon travail s'arrête ? » Si oui, c'est un besoin. Sinon, c'est une envie, même si elle compte beaucoup pour vous.",
      },
      { type: "h2", id: "exemple", text: "Exemple : le budget d'Awa" },
      {
        type: "example",
        title: "Awa, salaire net de 250 000 FCFA",
        lines: [
          ["Besoins (50 %)", "125 000 FCFA"],
          ["Envies et solidarité (30 %)", "75 000 FCFA"],
          ["Épargne (20 %)", "50 000 FCFA"],
        ],
        result: ["Épargne sur un an", "600 000 FCFA"],
        note: "Sans rien changer d'autre, Awa met de côté 600 000 FCFA par an : de quoi constituer son épargne de précaution en moins de deux ans.",
      },
      { type: "h2", id: "limites", text: "Les limites de la règle ici" },
      {
        type: "p",
        text: "La règle a été pensée pour un salaire fixe, versé chaque mois. Dans la vraie vie ouest-africaine, trois choses la mettent à l'épreuve :",
      },
      {
        type: "list",
        items: [
          "**Le revenu irrégulier.** Commerçants, artisans, chauffeurs, travailleurs à la tâche : un pourcentage d'un revenu qui change chaque mois ne donne pas un budget stable.",
          "**La solidarité familiale.** Transferts aux parents, participation aux cérémonies, aide à un frère : ces dépenses n'entrent dans aucune case, alors qu'elles pèsent souvent lourd.",
          "**Les petits revenus.** Quand le loyer et la nourriture prennent déjà 70 % du revenu, viser 50 % de besoins décourage plus qu'il n'aide.",
        ],
      },
      { type: "h2", id: "version-adaptee", text: "La version Assu : le 50/30/20 adapté" },
      {
        type: "list",
        ordered: true,
        items: [
          "**Calculez sur votre mois le plus faible.** Prenez le revenu d'un mois difficile habituel, pas celui d'un bon mois. Tout ce qui dépasse part directement en épargne.",
          "**Donnez une ligne à la solidarité.** Elle prend sa place dans les 30 %, à côté des envies. Quand l'enveloppe est vide, vous pouvez dire non sans culpabiliser.",
          "**Payez-vous d'abord.** Le jour où l'argent arrive, transférez votre part d'épargne vers un compte ou un portefeuille séparé, avant toute dépense.",
          "**Ajustez les curseurs, pas le principe.** Commencer en 60/25/15, c'est très bien. L'important est que l'épargne existe et grandisse.",
        ],
      },
      { type: "widget", widget: "budget" },
      {
        type: "callout",
        tone: "info",
        title: "Un mois meilleur que prévu ?",
        text: "Le surplus ne va pas aux envies : il part en épargne ou dans votre coussin de sécurité. C'est ce qui vous permettra de tenir pendant les mois creux.",
      },
      { type: "h2", id: "action", text: "Passer à l'action" },
      {
        type: "list",
        ordered: true,
        items: [
          "Notez vos revenus des trois derniers mois et gardez le plus bas.",
          "Classez les dépenses du mois dernier : besoins, envies, solidarité.",
          "Fixez un jour fixe pour transférer votre part d'épargne, et tenez-le.",
        ],
      },
    ],
    keyPoints: [
      "50 % besoins, 30 % envies et solidarité, 20 % épargne : un repère, pas une loi.",
      "Avec un revenu irrégulier, basez le budget sur votre mois le plus faible.",
      "La solidarité mérite sa propre enveloppe, avec une limite.",
      "L'épargne se met de côté en premier, pas avec ce qui reste.",
    ],
    quiz: [
      {
        question: "Moussa gagne 180 000 FCFA ce mois-ci. Selon le 50/30/20, combien devrait-il épargner ?",
        options: ["18 000 FCFA", "36 000 FCFA", "54 000 FCFA", "90 000 FCFA"],
        answer: 1,
        explanation: "20 % de 180 000 FCFA, soit 36 000 FCFA.",
      },
      {
        question: "Fatou paie un forfait Internet indispensable à son activité de couture en ligne. C'est…",
        options: ["Un besoin", "Une envie", "De l'épargne"],
        answer: 0,
        explanation: "Sans ce forfait, son activité s'arrête : c'est un besoin.",
      },
      {
        question: "Votre revenu varie entre 120 000 et 300 000 FCFA par mois. Sur quel montant bâtir votre budget ?",
        options: ["120 000 FCFA", "210 000 FCFA (la moyenne)", "300 000 FCFA"],
        answer: 0,
        explanation: "On construit sur le mois le plus faible. Le surplus des bons mois part en épargne.",
      },
    ],
  },

  "epargne-de-precaution": {
    scene: "shield",
    subtitle:
      "Le coussin qui transforme une catastrophe en simple contretemps. La première épargne à construire, avant toutes les autres.",
    captions: [
      "Une panne. Une hospitalisation. Un mois sans clients.",
      "Sans réserve, on emprunte, souvent très cher.",
      "Avec un coussin, on respire.",
      "Mois après mois, la réserve se remplit.",
      "Trois à six mois de dépenses essentielles. Puis on passe à la suite.",
    ],
    blocks: [
      { type: "h2", id: "a-quoi-ca-sert", text: "À quoi elle sert" },
      {
        type: "p",
        text: "L'épargne de précaution, c'est l'argent réservé aux **imprévus** : une hospitalisation, une moto en panne, un toit à réparer, un mois sans clients ou un salaire qui arrive en retard.",
      },
      {
        type: "p",
        text: "Son rôle n'est pas de rapporter. Son rôle est d'**être là** au moment où vous en avez besoin, pour ne pas avoir à emprunter à un taux élevé, vendre votre stock à perte ou demander de l'aide dans l'urgence.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "Ce qu'elle n'est pas",
        text: "Ce n'est pas l'argent de la Tabaski, de la rentrée ou du prochain téléphone. Ces dépenses sont prévisibles : elles ont leur propre épargne d'objectif.",
      },
      { type: "check", id: "q1" },
      { type: "h2", id: "combien", text: "Combien mettre de côté" },
      {
        type: "p",
        text: "La règle : **3 à 6 mois de dépenses essentielles**, et non de revenus. Les dépenses essentielles, ce sont les besoins de votre budget : loyer, nourriture, transport, factures, scolarité, santé.",
      },
      {
        type: "list",
        items: [
          "**3 mois** si votre salaire est stable et que le foyer a deux revenus.",
          "**6 mois** si vous êtes seul·e à faire vivre le foyer.",
          "**6 mois ou plus** si vos revenus sont irréguliers : commerce, artisanat, transport, travail à la tâche.",
        ],
      },
      { type: "h2", id: "exemple", text: "Exemple : le coussin de Koffi" },
      {
        type: "example",
        title: "Koffi, chauffeur, 150 000 FCFA de dépenses essentielles par mois",
        lines: [
          ["Dépenses essentielles", "150 000 FCFA / mois"],
          ["Revenus irréguliers", "× 6 mois"],
          ["Coussin visé", "900 000 FCFA"],
          ["Épargne mensuelle", "45 000 FCFA"],
        ],
        result: ["Objectif atteint en", "20 mois"],
        note: "Vingt mois, ça paraît long. Mais dès le quatrième mois, Koffi a déjà un mois de dépenses de côté : assez pour encaisser une panne sans emprunter.",
      },
      { type: "widget", widget: "precaution" },
      { type: "h2", id: "ou-la-garder", text: "Où la garder" },
      {
        type: "p",
        text: "Trois critères : **disponible en 48 heures**, **sans risque de perte**, et **séparée de l'argent du quotidien** pour ne pas y toucher par réflexe.",
      },
      {
        type: "compare",
        columns: [
          {
            title: "Bonnes options",
            tone: "good",
            items: [
              "Un compte épargne en banque ou en microfinance",
              "Un portefeuille Mobile Money dédié, réservé à ça",
              "Un compte rémunéré retirable à tout moment",
            ],
          },
          {
            title: "À éviter",
            tone: "bad",
            items: [
              "La tontine : vous ne choisissez pas quand vous touchez l'argent",
              "Les actions à la BRVM : elles peuvent baisser au mauvais moment",
              "Le dépôt à terme bloqué jusqu'à l'échéance",
              "Le portefeuille du quotidien : il fond sans qu'on s'en rende compte",
            ],
          },
        ],
      },
      { type: "h2", id: "construire", text: "La construire pas à pas" },
      {
        type: "list",
        ordered: true,
        items: [
          "**Premier palier : un mois de dépenses.** C'est déjà assez pour encaisser la plupart des imprévus.",
          "**Rendez-la automatique.** Un transfert le jour de paie, ou un petit montant chaque jour de marché.",
          "**Ajoutez-y les rentrées exceptionnelles** : prime, très bonne semaine, cadeau.",
          "**Si vous l'utilisez, reconstituez-la en priorité**, avant de reprendre vos autres objectifs.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Et si j'ai des dettes chères ?",
        text: "Constituez d'abord un premier palier d'un mois, puis remboursez les dettes les plus chères avant de compléter le coussin.",
      },
    ],
    keyPoints: [
      "C'est la première épargne à construire, avant l'objectif et l'investissement.",
      "Visez 3 à 6 mois de dépenses essentielles, 6 ou plus si vos revenus varient.",
      "Disponible vite, sans risque, et séparée de l'argent du quotidien.",
      "Utilisée ? On la reconstitue en priorité.",
    ],
    quiz: [
      {
        question:
          "Mariam dépense 120 000 FCFA par mois en besoins essentiels, et ses revenus sont irréguliers. Quel coussin viser au minimum ?",
        options: ["120 000 FCFA", "360 000 FCFA", "720 000 FCFA", "1 440 000 FCFA"],
        answer: 2,
        explanation: "Revenus irréguliers : au moins 6 mois de dépenses essentielles, soit 6 × 120 000 = 720 000 FCFA.",
      },
      {
        question: "Quel est le meilleur endroit pour l'épargne de précaution ?",
        options: ["Une tontine mensuelle", "Des actions à la BRVM", "Un compte épargne séparé, retirable rapidement"],
        answer: 2,
        explanation: "Elle doit être disponible vite et sans risque de perte. La tontine et la bourse ne remplissent pas ces conditions.",
      },
      {
        question: "La rentrée scolaire approche. Faut-il puiser dans l'épargne de précaution ?",
        options: ["Oui, c'est fait pour ça", "Non : c'est une dépense prévisible, qui relève de l'épargne d'objectif"],
        answer: 1,
        explanation: "La rentrée revient chaque année à la même date : on l'anticipe avec une épargne d'objectif.",
      },
    ],
  },

  "epargne-d-objectif": {
    scene: "road",
    subtitle:
      "Rentrée, Tabaski, terrain, moto, mariage : transformer un « un jour » en date, et une date en montant mensuel.",
    captions: [
      "Un projet sans date reste un rêve.",
      "Fixez le montant. Fixez l'échéance.",
      "Divisez : voilà votre effort mensuel.",
      "Chaque versement vous rapproche du but.",
      "Le jour venu, l'argent est là. Sans crédit.",
    ],
    blocks: [
      { type: "h2", id: "principe", text: "Un projet, une date, un montant" },
      {
        type: "p",
        text: "L'épargne d'objectif finance les dépenses **prévisibles** : la rentrée scolaire, la Tabaski, un terrain, une moto pour travailler, un mariage. On sait qu'elles arrivent, souvent même à quelle date.",
      },
      {
        type: "p",
        text: "Le problème, c'est qu'on les traite comme des surprises. Résultat : on emprunte, on vend quelque chose ou on demande une avance. L'épargne d'objectif inverse le calcul : **montant ÷ nombre de mois = effort mensuel**.",
      },
      { type: "check", id: "q1" },
      { type: "h2", id: "bon-objectif", text: "Un objectif qui tient la route" },
      {
        type: "p",
        text: "« Économiser pour la rentrée » ne suffit pas. « 180 000 FCFA pour la rentrée de mes deux enfants, d'ici fin septembre » fonctionne. Un bon objectif est :",
      },
      {
        type: "list",
        items: [
          "**Précis** : qu'est-ce que vous achetez, exactement ?",
          "**Chiffré** : renseignez-vous sur le vrai prix, frais compris.",
          "**Daté** : une échéance claire, même approximative.",
          "**Réaliste** : un effort mensuel compatible avec votre budget.",
          "**Séparé** : une enveloppe, un compte ou un portefeuille par projet.",
        ],
      },
      { type: "h2", id: "exemple", text: "Exemple : la moto d'Ibrahim" },
      {
        type: "example",
        title: "Ibrahim veut une moto à 720 000 FCFA dans 12 mois",
        lines: [
          ["Prix de la moto", "720 000 FCFA"],
          ["Déjà épargné", "120 000 FCFA"],
          ["Reste à réunir", "600 000 FCFA"],
          ["Durée", "12 mois"],
        ],
        result: ["Effort mensuel", "50 000 FCFA"],
        note: "Soit environ 11 500 FCFA par semaine, ou 1 700 FCFA par jour. Découpé ainsi, l'objectif devient atteignable.",
      },
      { type: "widget", widget: "objectif" },
      { type: "h2", id: "tontine", text: "La tontine, un outil d'objectif" },
      {
        type: "p",
        text: "La tontine est faite pour l'épargne d'objectif : la pression du groupe vous aide à cotiser, et le jour de votre tour, vous touchez une grosse somme d'un coup.",
      },
      {
        type: "list",
        items: [
          "**Choisissez votre tour** en fonction de votre échéance, quand c'est possible.",
          "**Gardez le risque en tête** : si un membre ne paie pas, tout le groupe en souffre. Privilégiez les personnes de confiance et des règles écrites.",
          "**N'y mettez pas votre épargne de précaution** : vous ne choisissez pas toujours quand vous touchez l'argent.",
        ],
      },
      { type: "h2", id: "plusieurs-projets", text: "Plusieurs projets en même temps" },
      {
        type: "p",
        text: "Un projet, une enveloppe. Physique, sur un compte ou dans un portefeuille Mobile Money séparé : l'important est de voir chaque objectif avancer de son côté.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Priorisez",
        text: "La rentrée scolaire passe avant le nouveau téléphone. Si le budget ne suffit pas pour tout, repoussez la date du projet le moins urgent plutôt que de réduire tous les versements.",
      },
      { type: "h2", id: "ou-placer", text: "Où placer cet argent ?" },
      {
        type: "p",
        text: "Tout dépend de l'échéance. **Moins de 2 ans** : compte épargne, portefeuille séparé, tontine. **De 2 à 5 ans** (terrain, mariage) : un compte rémunéré ou un dépôt à terme qui arrive à échéance avant votre date peut faire travailler l'argent un peu, sans risque de perte. Au-delà, on entre dans le domaine de l'épargne d'investissement.",
      },
    ],
    keyPoints: [
      "Un objectif = un montant, une date, une enveloppe séparée.",
      "Effort mensuel = (montant − déjà épargné) ÷ nombre de mois.",
      "La tontine est un excellent outil d'objectif, pas de précaution.",
      "Plus l'échéance est proche, plus l'argent doit rester disponible et sans risque.",
    ],
    quiz: [
      {
        question: "Vous voulez 300 000 FCFA dans 10 mois et vous avez déjà 50 000 FCFA. Combien épargner par mois ?",
        options: ["25 000 FCFA", "30 000 FCFA", "35 000 FCFA"],
        answer: 0,
        explanation: "(300 000 − 50 000) ÷ 10 = 25 000 FCFA par mois.",
      },
      {
        question: "Lequel de ces objectifs est le mieux formulé ?",
        options: [
          "Mettre de l'argent de côté pour plus tard",
          "Économiser pour un terrain, un jour",
          "Réunir 400 000 FCFA d'ici décembre pour la scolarité",
        ],
        answer: 2,
        explanation: "Il est précis, chiffré et daté : on peut en déduire un effort mensuel.",
      },
      {
        question: "Votre mariage est dans 8 mois. Où placer l'argent ?",
        options: ["En actions à la BRVM", "Sur un compte épargne, ou dans une tontine dont le tour tombe avant"],
        answer: 1,
        explanation: "À 8 mois, l'argent doit rester disponible et ne pas risquer de baisser.",
      },
    ],
  },

  "epargne-d-investissement": {
    links: [
      { label: "BRVM", href: "https://www.brvm.org", note: "La bourse régionale de l'UEMOA" },
      { label: "AMF-UMOA", href: "https://www.amf-umoa.org", note: "Le régulateur : liste des SGI agréées" },
    ],
    scene: "growth",
    subtitle:
      "L'argent dont vous n'aurez pas besoin avant cinq ans peut travailler pour vous, à condition de respecter l'ordre et de comprendre le risque.",
    captions: [
      "Le temps est l'ingrédient le plus puissant de la finance.",
      "Les gains produisent à leur tour des gains.",
      "Les premières années, la courbe monte doucement…",
      "…puis elle accélère.",
      "Commencez tôt, même petit.",
    ],
    blocks: [
      { type: "h2", id: "ordre", text: "Le bon ordre" },
      {
        type: "p",
        text: "L'épargne d'investissement arrive **en troisième**. D'abord le coussin de précaution, ensuite les objectifs à court terme, et seulement après, l'investissement.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "La règle d'or",
        text: "On n'investit que l'argent dont on n'aura pas besoin avant au moins cinq ans. Si vous risquez de devoir le retirer en urgence, ce n'est pas de l'argent à investir.",
      },
      { type: "check", id: "q1" },
      { type: "h2", id: "interets-composes", text: "Le moteur : les intérêts composés" },
      {
        type: "p",
        text: "Quand votre argent rapporte, les gains s'ajoutent au capital et rapportent à leur tour. Sur quelques mois, l'effet est invisible. Sur dix ou vingt ans, il peut devenir la plus grosse partie de votre patrimoine.",
      },
      { type: "widget", widget: "croissance" },
      {
        type: "example",
        title: "Deux amis, deux départs, 25 000 FCFA par mois",
        lines: [
          ["Aïcha verse de 25 à 35 ans, puis s'arrête", "3 000 000 FCFA versés"],
          ["Paul verse de 35 à 60 ans", "7 500 000 FCFA versés"],
          ["Aïcha à 60 ans", "≈ 18,3 M FCFA"],
          ["Paul à 60 ans", "≈ 17,3 M FCFA"],
        ],
        result: ["Aïcha a versé 2,5 fois moins", "et finit plus riche"],
        note: "Hypothèse pédagogique : 6 % par an, intérêts capitalisés chaque mois. Les rendements réels varient et ne sont jamais garantis.",
      },
      { type: "h2", id: "risque", text: "Risque et rendement" },
      {
        type: "p",
        text: "Plus un placement peut rapporter, plus il peut aussi baisser. Ce n'est pas un défaut : c'est le prix du rendement. Le temps aide à lisser les variations, d'où la règle des cinq ans.",
      },
      {
        type: "list",
        items: [
          "**Risque faible** : comptes rémunérés, dépôts à terme. Rendement modeste, capital protégé.",
          "**Risque modéré** : obligations, fonds diversifiés.",
          "**Risque plus élevé** : actions. Les plus fortes variations, mais historiquement le meilleur potentiel sur longue période.",
        ],
      },
      { type: "h2", id: "uemoa", text: "Investir depuis l'Afrique de l'Ouest" },
      {
        type: "list",
        items: [
          "**La BRVM**, bourse régionale commune aux huit pays de l'UEMOA, basée à Abidjan. On y achète des actions d'entreprises cotées, qui peuvent verser des **dividendes**, et des obligations.",
          "**Une SGI** (société de gestion et d'intermédiation) agréée par le régulateur régional, l'AMF-UMOA, est indispensable : c'est elle qui ouvre votre compte-titres et passe vos ordres.",
          "**Les obligations** émises par les États et les entreprises de la zone, souvent proposées au public via les SGI : vous prêtez de l'argent contre des intérêts réguliers.",
          "**Les FCP** (fonds communs de placement) : vous achetez des parts d'un panier déjà diversifié, géré par des professionnels. Une bonne porte d'entrée avec de petits montants.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Vérifiez toujours",
        text: "Assurez-vous que l'intermédiaire est agréé, demandez la grille de frais complète, et méfiez-vous de toute promesse de rendement élevé « garanti » : c'est le premier signe d'une arnaque.",
      },
      { type: "h2", id: "diversifier", text: "Diversifier" },
      {
        type: "p",
        text: "Ne mettez pas tous vos œufs dans le même panier : plusieurs entreprises, plusieurs secteurs, plusieurs types de placements. Une entreprise peut traverser une crise ; un portefeuille diversifié encaisse le choc.",
      },
      { type: "h2", id: "commencer", text: "Commencer" },
      {
        type: "list",
        ordered: true,
        items: [
          "Vérifiez que votre coussin de précaution est complet.",
          "Fixez un montant mensuel que vous ne toucherez pas pendant au moins cinq ans.",
          "Commencez par un placement diversifié : un FCP, ou plusieurs titres.",
          "Investissez régulièrement, que les marchés montent ou baissent.",
          "Ne regardez pas la valeur tous les jours.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Important",
        text: "Cette leçon est éducative. Elle ne constitue pas un conseil en investissement personnalisé.",
      },
    ],
    keyPoints: [
      "Précaution, puis objectifs, puis investissement. Jamais dans l'autre sens.",
      "N'investissez que l'argent dont vous n'aurez pas besoin avant cinq ans.",
      "Le temps compte plus que le montant : commencez tôt, même petit.",
      "Diversifiez, passez par un intermédiaire agréé, fuyez les rendements « garantis ».",
    ],
    quiz: [
      {
        question: "Quelle épargne construire en premier ?",
        options: ["L'épargne d'investissement", "L'épargne d'objectif", "L'épargne de précaution"],
        answer: 2,
        explanation: "Le coussin de précaution d'abord : sans lui, le moindre imprévu vous forcerait à revendre vos placements.",
      },
      {
        question: "On vous propose un placement à 10 % par mois, « garanti ». C'est…",
        options: ["Une excellente affaire", "Très probablement une arnaque"],
        answer: 1,
        explanation: "Aucun placement sérieux ne garantit un tel rendement. C'est le signal classique d'une pyramide.",
      },
      {
        question: "Pour acheter des actions à la BRVM, il faut passer par…",
        options: ["Un opérateur Mobile Money", "Une SGI agréée", "Une tontine"],
        answer: 1,
        explanation: "Seule une SGI agréée peut ouvrir un compte-titres et passer vos ordres en bourse.",
      },
    ],
  },
};

export function getLesson(slug: string) {
  return lessonContent[slug];
}
