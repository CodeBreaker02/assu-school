import type { LessonContent } from "./lessons";

/** Chapitre 01 — Les fondations. Entièrement gratuit. */
export const chapterOne: Record<string, LessonContent> = {
  "ce-que-l-ecole-ne-vous-a-pas-appris": {
    scene: "orbit",
    subtitle:
      "Personne ne nous apprend l'argent. Pourtant, l'essentiel tient en quelques règles simples. On commence ici.",
    captions: [
      "Budget, tontine, crédit, famille, bourse…",
      "À l'école, personne ne nous l'a appris.",
      "Pourtant, tout est lié.",
      "Chaque décision d'argent en entraîne une autre.",
      "Ici, on apprend une chose à la fois.",
    ],
    blocks: [
      { type: "h2", id: "pourquoi", text: "Pourquoi ce cours existe" },
      {
        type: "p",
        text: "À l'école, on apprend à calculer un pourcentage. Personne ne nous apprend à calculer le vrai coût d'un crédit, à choisir une tontine ou à dire non à une demande d'argent.",
      },
      {
        type: "p",
        text: "Résultat : on apprend l'argent sur le tas, souvent en perdant. Ce cours vous donne les règles, **une leçon courte à la fois**.",
      },
      { type: "check", id: "q1" },
      { type: "h2", id: "idees-recues", text: "Quatre idées reçues" },
      {
        type: "myths",
        items: [
          {
            myth: "Il faut gagner beaucoup pour épargner.",
            truth: "L'épargne est d'abord une habitude. 5 000 F par semaine, c'est 260 000 F par an.",
          },
          {
            myth: "Parler d'argent, c'est mal élevé.",
            truth: "Ne pas en parler coûte plus cher : dettes cachées, malentendus en famille, mauvais choix.",
          },
          {
            myth: "La bourse, c'est pour les riches.",
            truth: "À la BRVM, on peut commencer avec de petits montants, via une SGI ou un fonds commun.",
          },
          {
            myth: "Avec plus d'argent, tout irait mieux.",
            truth: "Sans méthode, plus de revenus amène surtout plus de dépenses. La méthode d'abord.",
          },
        ],
      },
      { type: "h2", id: "programme", text: "Ce que vous allez apprendre" },
      {
        type: "list",
        ordered: true,
        items: [
          "**Les fondations** : l'argent, l'inflation, votre bilan.",
          "**Les revenus irréguliers** : un budget qui tient même les mauvais mois.",
          "**La famille** : aider les siens sans s'oublier.",
          "**Tontine et Mobile Money** : vos outils, à votre avantage.",
          "**Épargner et investir** : de l'objectif à la BRVM.",
          "**Terrain et immobilier** : les calculs avant la première brique.",
          "**Retraite et protection** : préparer la suite.",
        ],
      },
      { type: "h2", id: "methode", text: "Comment en tirer le maximum" },
      {
        type: "list",
        items: [
          "Regardez la vidéo, puis lisez le résumé.",
          "Faites les simulateurs avec **vos vrais chiffres**.",
          "Répondez au quiz : se tromper fait partie de l'apprentissage.",
          "Appliquez **une seule action** avant la leçon suivante.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Dix minutes par jour",
        text: "Une leçon par jour suffit. En six semaines, vous avez fait le tour, et vous avez un plan.",
      },
    ],
    keyPoints: [
      "L'argent s'apprend, comme tout le reste.",
      "L'épargne est une habitude avant d'être un montant.",
      "Une leçon courte par jour, une action par leçon.",
    ],
    quiz: [
      {
        question: "5 000 F épargnés chaque semaine, cela fait combien en un an ?",
        options: ["60 000 F", "260 000 F", "500 000 F"],
        answer: 1,
        explanation: "52 semaines × 5 000 F = 260 000 F. Les petites sommes régulières font de grands montants.",
      },
      {
        question: "Qu'est-ce qui compte le plus pour commencer à épargner ?",
        options: ["Avoir un gros salaire", "Prendre l'habitude, même avec peu", "Attendre d'avoir remboursé toutes ses dettes"],
        answer: 1,
        explanation: "Le montant viendra. L'habitude, elle, se construit dès maintenant.",
      },
    ],
  },

  "du-cauri-au-franc-cfa": {
    links: [{ label: "BCEAO", href: "https://www.bceao.int", note: "La banque centrale des États de l'Afrique de l'Ouest" }],

    scene: "history",
    subtitle: "Du coquillage au téléphone : ce que l'histoire de notre monnaie nous apprend sur la valeur de l'argent.",
    captions: [
      "Avant les billets, il y avait le cauri.",
      "Puis les monnaies coloniales, puis le franc CFA.",
      "En 1994, il perd la moitié de sa valeur.",
      "Aujourd'hui, l'argent tient dans un téléphone.",
      "Une constante : sa valeur n'est jamais garantie.",
    ],
    blocks: [
      { type: "h2", id: "role", text: "À quoi sert une monnaie ?" },
      {
        type: "p",
        text: "Une monnaie a trois rôles : **échanger** sans troc, **compter** la valeur des choses, et **garder** de la valeur pour plus tard.",
      },
      {
        type: "p",
        text: "Le troisième rôle est le plus fragile. L'histoire de notre monnaie le montre très bien.",
      },
      { type: "check", id: "q1" },
      { type: "h2", id: "histoire", text: "Une histoire en six dates" },
      {
        type: "timeline",
        items: [
          {
            when: "Pendant des siècles",
            title: "Le cauri",
            text: "Ce petit coquillage, venu notamment des Maldives par le commerce, sert de monnaie dans une grande partie de l'Afrique de l'Ouest. Solide, difficile à imiter, facile à compter.",
          },
          {
            when: "XIXᵉ siècle",
            title: "Trop de cauris",
            text: "Des importations massives inondent les marchés. Chaque coquillage vaut de moins en moins : les monnaies coloniales prennent le relais.",
          },
          {
            when: "1945",
            title: "Naissance du franc CFA",
            text: "Il existe aujourd'hui deux francs CFA : celui de l'UEMOA en Afrique de l'Ouest, et celui de la CEMAC en Afrique centrale.",
          },
          {
            when: "1994",
            title: "La dévaluation",
            text: "Du jour au lendemain, le franc CFA perd la moitié de sa valeur face au franc français. Les produits importés deviennent beaucoup plus chers.",
          },
          {
            when: "Depuis 1999",
            title: "L'ancrage à l'euro",
            text: "La parité est fixe : 1 euro = 655,957 FCFA.",
          },
          {
            when: "Aujourd'hui",
            title: "L'argent dans le téléphone",
            text: "Avec le Mobile Money, des millions de personnes envoient, reçoivent et épargnent sans compte bancaire.",
          },
        ],
      },
      { type: "h2", id: "lecon-du-cauri", text: "La leçon du cauri" },
      {
        type: "p",
        text: "Quand trop de cauris sont arrivés, chacun a perdu de la valeur. C'est exactement le mécanisme de l'**inflation** : plus il y a de monnaie pour la même quantité de biens, moins chaque unité vaut.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Ce que ça change pour vous",
        text: "La valeur de l'argent n'est jamais garantie pour toujours. C'est pour ça qu'on ne garde pas toute son épargne en liquide.",
      },
    ],
    keyPoints: [
      "Une monnaie sert à échanger, à compter et à garder de la valeur.",
      "Le franc CFA est lié à l'euro : 1 € = 655,957 FCFA.",
      "Quand la monnaie devient trop abondante, chaque unité vaut moins.",
    ],
    quiz: [
      {
        question: "Combien vaut 1 euro en francs CFA ?",
        options: ["100 FCFA", "655,957 FCFA", "1 000 FCFA"],
        answer: 1,
        explanation: "La parité est fixe depuis 1999 : 1 € = 655,957 FCFA.",
      },
      {
        question: "Pourquoi le cauri a-t-il perdu de sa valeur au XIXᵉ siècle ?",
        options: ["Il a été interdit", "Il y en avait beaucoup trop en circulation", "Il s'abîmait trop vite"],
        answer: 1,
        explanation: "Les importations massives ont multiplié les cauris en circulation : chacun valait moins. C'est l'inflation.",
      },
      {
        question: "En 1994, le franc CFA a…",
        options: ["Doublé de valeur", "Perdu la moitié de sa valeur", "Été remplacé par l'euro"],
        answer: 1,
        explanation: "La dévaluation de 1994 a divisé par deux sa valeur face au franc français.",
      },
    ],
  },

  "l-inflation": {
    links: [{ label: "BCEAO", href: "https://www.bceao.int", note: "Inflation et politique monétaire dans l'UEMOA" }],

    scene: "basket",
    subtitle: "Votre billet ne change pas. Ce qu'il achète, si. Comprendre l'inflation et s'en protéger.",
    captions: [
      "Au marché, le panier coûte 10 000 F.",
      "Un an plus tard : 10 500 F.",
      "Le billet n'a pas changé.",
      "Mais il achète un peu moins.",
      "C'est l'inflation : un impôt que personne ne voit.",
    ],
    blocks: [
      { type: "h2", id: "definition", text: "L'inflation en une phrase" },
      {
        type: "p",
        text: "L'inflation, c'est la **hausse générale des prix**. À 5 %, ce qui coûtait 1 000 F l'an dernier coûte 1 050 F aujourd'hui. Votre billet n'a pas changé, mais il achète moins.",
      },
      {
        type: "example",
        title: "Le panier de Mariam au marché",
        lines: [
          ["Le panier il y a un an", "10 000 F"],
          ["Inflation sur l'année", "5 %"],
          ["Le même panier aujourd'hui", "10 500 F"],
        ],
        result: ["Pouvoir d'achat perdu", "500 F"],
        note: "Si le revenu de Mariam n'a pas bougé, elle doit retirer quelque chose de son panier.",
      },
      { type: "check", id: "q1" },
      { type: "h2", id: "impot-invisible", text: "Un impôt invisible" },
      {
        type: "p",
        text: "Personne ne vous prélève rien, et pourtant vous perdez. 100 000 F gardés 10 ans à la maison, avec 3 % d'inflation par an, n'achèteront plus que ce que **74 000 F** achètent aujourd'hui.",
      },
      { type: "widget", widget: "inflation" },
      { type: "h2", id: "chez-nous", text: "Et chez nous ?" },
      {
        type: "p",
        text: "Dans l'UEMOA, la BCEAO cherche à maintenir l'inflation autour de **2 % par an**. Certaines années, elle monte bien plus haut, surtout sur l'alimentation et le carburant.",
      },
      { type: "h2", id: "se-proteger", text: "Comment se protéger" },
      {
        type: "list",
        items: [
          "**Ne pas tout garder en liquide.** L'argent qui dort perd de la valeur chaque année.",
          "**Épargner rémunéré.** Compte épargne, dépôt à terme : même un petit taux limite la perte.",
          "**Investir sur le long terme.** Sur plusieurs années, les actions peuvent faire mieux que l'inflation, avec plus de risques.",
          "**Revoir ses prix et son salaire.** Un revenu qui ne bouge jamais, c'est une baisse déguisée.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Attention aux promesses",
        text: "Un placement qui promet 10 % par mois « pour battre l'inflation » est presque toujours une arnaque.",
      },
    ],
    keyPoints: [
      "L'inflation fait baisser ce que votre argent peut acheter.",
      "L'argent qui dort perd de la valeur chaque année.",
      "Pour se protéger : épargne rémunérée et investissement à long terme.",
    ],
    quiz: [
      {
        question: "Avec 4 % d'inflation, un sac de riz à 20 000 F coûtera environ… dans un an.",
        options: ["20 400 F", "20 800 F", "24 000 F"],
        answer: 1,
        explanation: "20 000 × 1,04 = 20 800 F.",
      },
      {
        question: "Quel argent souffre le plus de l'inflation ?",
        options: ["L'argent gardé en liquide", "Un terrain", "Des actions détenues 10 ans"],
        answer: 0,
        explanation: "Le liquide ne rapporte rien : il perd tout l'effet de l'inflation, chaque année.",
      },
    ],
  },

  "actifs-et-passifs": {
    scene: "flows",
    subtitle: "Ce qui met de l'argent dans votre poche, et ce qui en retire. Deux mots qui changent vos décisions.",
    captions: [
      "Au centre, votre poche.",
      "Certaines choses y font entrer de l'argent : des actifs.",
      "D'autres en font sortir : des passifs.",
      "Le même objet peut changer de camp.",
      "Le but : plus d'entrées que de sorties.",
    ],
    blocks: [
      { type: "h2", id: "definitions", text: "Deux mots qui changent tout" },
      {
        type: "compare",
        columns: [
          {
            title: "Actif",
            tone: "good",
            items: ["Ce que vous possédez", "Garde de la valeur ou rapporte", "Épargne, terrain, stock, outil de travail"],
          },
          {
            title: "Passif",
            tone: "bad",
            items: ["Ce que vous devez", "Vous coûte chaque mois", "Crédit, dette, achat à crédit"],
          },
        ],
      },
      {
        type: "p",
        text: "Une astuce simple : un **actif** met de l'argent dans votre poche, un **passif** en retire.",
      },
      { type: "check", id: "q1" },
      { type: "h2", id: "usage", text: "Le même objet peut être les deux" },
      {
        type: "p",
        text: "Une moto utilisée comme taxi-moto rapporte chaque jour : c'est un outil, donc un actif. La même moto achetée à crédit pour se promener coûte essence, entretien et mensualités : elle se comporte comme un passif.",
      },
      { type: "h2", id: "exercice", text: "À vous : actif ou passif ?" },
      {
        type: "sort",
        prompt: "Choisissez le bon camp pour chaque élément.",
        bins: ["Actif", "Passif"],
        items: [
          { label: "Stock de la boutique", bin: 0, why: "Il se revend avec une marge : il rapporte." },
          { label: "Téléviseur acheté à crédit", bin: 1, why: "Les mensualités sortent chaque mois, l'objet ne rapporte rien." },
          { label: "Terrain avec titre foncier", bin: 0, why: "Il garde sa valeur, et peut en prendre." },
          { label: "Prêt d'un ami à rembourser", bin: 1, why: "C'est une dette : de l'argent qui devra sortir." },
          { label: "Moto utilisée comme taxi-moto", bin: 0, why: "Elle génère un revenu chaque jour." },
          { label: "Crédit sur mobile pour les fêtes", bin: 1, why: "Une dette chère, pour une dépense qui ne rapporte rien." },
          { label: "Épargne sur un compte", bin: 0, why: "Elle vous appartient et peut rapporter des intérêts." },
          { label: "Smartphone dernier cri à crédit", bin: 1, why: "Il perd vite de la valeur et coûte chaque mois." },
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "La question à se poser",
        text: "Avant un achat important : « Est-ce que ça va mettre de l'argent dans ma poche, ou en retirer chaque mois ? »",
      },
    ],
    keyPoints: [
      "Actif : ce que vous possédez, qui garde de la valeur ou rapporte.",
      "Passif : ce que vous devez, qui vous coûte.",
      "C'est l'usage qui compte : le même objet peut changer de camp.",
    ],
    quiz: [
      {
        question: "Une machine à coudre utilisée dans un atelier est plutôt…",
        options: ["Un actif", "Un passif"],
        answer: 0,
        explanation: "Elle sert à produire et à vendre : elle rapporte de l'argent.",
      },
      {
        question: "Un crédit pris pour une fête de mariage est…",
        options: ["Un actif", "Un passif"],
        answer: 1,
        explanation: "C'est une dette : elle retire de l'argent chaque mois sans en rapporter.",
      },
    ],
  },

  "bilan-personnel": {
    scene: "balance",
    subtitle: "Une photo honnête de votre situation, en dix minutes. Le point de départ de tout le reste.",
    captions: [
      "D'un côté, ce que vous possédez.",
      "De l'autre, ce que vous devez.",
      "La balance penche…",
      "La différence, c'est votre valeur nette.",
      "Votre objectif : la faire monter.",
    ],
    blocks: [
      { type: "h2", id: "photo", text: "Votre photo financière" },
      {
        type: "p",
        text: "Le bilan personnel, c'est tout ce que vous possédez d'un côté, tout ce que vous devez de l'autre. La différence s'appelle votre **valeur nette**.",
      },
      {
        type: "example",
        title: "Le bilan de Koffi",
        lines: [
          ["Épargne et Mobile Money", "180 000 F"],
          ["Moto (valeur de revente)", "450 000 F"],
          ["Prêt à rembourser", "− 250 000 F"],
          ["Crédit téléphone", "− 80 000 F"],
        ],
        result: ["Valeur nette", "300 000 F"],
        note: "Koffi a des dettes, mais sa valeur nette est positive. Son objectif : la faire monter chaque trimestre.",
      },
      { type: "check", id: "q1" },
      { type: "h2", id: "a-vous", text: "À vous de faire votre bilan" },
      { type: "p", text: "Pas besoin d'être exact au franc près. **Une estimation honnête suffit.**" },
      { type: "widget", widget: "bilan" },
      {
        type: "callout",
        tone: "info",
        title: "Négatif ? Pas de panique.",
        text: "Une valeur nette négative est fréquente au début, surtout avec un crédit en cours. Ce qui compte, c'est qu'elle **monte** d'un trimestre à l'autre.",
      },
      { type: "h2", id: "suivi", text: "Refaites-le chaque trimestre" },
      {
        type: "list",
        ordered: true,
        items: [
          "Notez la date et votre valeur nette.",
          "Comparez avec le trimestre précédent.",
          "Une seule question : qu'est-ce qui l'a fait monter ou baisser ?",
        ],
      },
    ],
    keyPoints: [
      "Valeur nette = ce que vous possédez − ce que vous devez.",
      "Une estimation honnête vaut mieux qu'un calcul parfait.",
      "Ce qui compte, c'est la tendance : vers le haut.",
    ],
    quiz: [
      {
        question: "Vous avez 300 000 F d'épargne et 120 000 F de dettes. Votre valeur nette est…",
        options: ["420 000 F", "180 000 F", "300 000 F"],
        answer: 1,
        explanation: "300 000 − 120 000 = 180 000 F.",
      },
      {
        question: "À quelle fréquence refaire son bilan ?",
        options: ["Une fois dans sa vie", "Environ chaque trimestre", "Chaque jour"],
        answer: 1,
        explanation: "Tous les trois mois, c'est assez pour voir la tendance sans y passer sa vie.",
      },
    ],
  },
};
