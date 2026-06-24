/**
 * Articles statiques pour la section Apprendre.
 *
 * Format en blocs typés plutôt que markdown brut : rendu typesafe,
 * pas de dépendance markdown, migration facile vers MDX/CMS quand on voudra.
 */

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export type ArticleCategory = "mythes" | "objectifs" | "sport" | "basiques";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  readMinutes: number;
  publishedAt: string;
  body: ArticleBlock[];
};

export const CATEGORY_LABEL: Record<ArticleCategory, string> = {
  mythes: "Mythes alimentaires",
  objectifs: "Objectifs & calculs",
  sport: "Nutrition sportive",
  basiques: "Les basiques",
};

export const ARTICLES: Article[] = [
  {
    slug: "faux-aliments-sains",
    title: "Les 5 faux aliments « sains » qui te trompent",
    excerpt:
      "Granola, jus pressés, yaourts 0%, barres protéinées… ils ont l'air bons pour toi. Pas toujours.",
    category: "mythes",
    readMinutes: 4,
    publishedAt: "2026-06-10",
    body: [
      {
        type: "p",
        text: "Les rayons « bien-être » des supermarchés sont remplis de produits avec un emballage rassurant — couleurs naturelles, mots comme « équilibre », « source de fibres », « 0% ». Le problème : ces signaux marketing ne disent rien sur la composition réelle.",
      },
      { type: "h2", text: "1. Le granola du petit-déjeuner" },
      {
        type: "p",
        text: "Une portion de granola « maison » dépasse souvent 450 kcal pour 80g — autant qu'un repas. C'est surtout du sucre et de l'huile. Le terme « avoine » sur l'emballage ne change pas la densité calorique.",
      },
      { type: "h2", text: "2. Les jus de fruits pressés" },
      {
        type: "p",
        text: "Un jus d'orange contient autant de sucre qu'un soda — mais sans les fibres du fruit entier. Tu absorbes le sucre 5× plus vite, sans le rassasiement de la mastication.",
      },
      { type: "h2", text: "3. Les yaourts 0%" },
      {
        type: "p",
        text: "Souvent compensés en sucre pour garder le goût. Vérifie la ligne « dont sucres » : 12g par pot = trois carrés de sucre.",
      },
      { type: "h2", text: "4. Les barres protéinées" },
      {
        type: "p",
        text: "Beaucoup sont des biscuits chocolatés avec un peu de protéines ajoutées. 250 kcal, 18g de sucre, et un goût qui te pousse à en remanger une. À regarder de près.",
      },
      { type: "h2", text: "5. Le pain « complet » industriel" },
      {
        type: "p",
        text: "Si la farine de blé tendre est avant la farine complète dans la liste des ingrédients, c'est un pain blanc déguisé. Le vrai pain complet a une seule farine.",
      },
      {
        type: "quote",
        text: "Le marketing peint l'emballage. La liste des ingrédients dit la vérité.",
      },
    ],
  },
  {
    slug: "tes-besoins-selon-objectif",
    title: "Combien manger selon ton objectif",
    excerpt:
      "Perte, prise de masse, maintien : ce que le déficit ou surplus calorique veut vraiment dire.",
    category: "objectifs",
    readMinutes: 5,
    publishedAt: "2026-06-08",
    body: [
      {
        type: "p",
        text: "Ton corps brûle un certain nombre de calories par jour, même au repos. C'est ton métabolisme. Pour changer ton poids, tu joues sur l'équilibre entre ce que tu consommes et ce que tu dépenses — pas plus compliqué que ça en surface.",
      },
      { type: "h2", text: "Le déficit calorique pour perdre du poids" },
      {
        type: "p",
        text: "Pour perdre ~0,5 kg par semaine, vise un déficit de 500 kcal/jour. C'est suffisant pour voir des résultats sans s'épuiser. Un déficit trop agressif (-1000 kcal et plus) te fait perdre du muscle et te démotive en une semaine.",
      },
      { type: "h2", text: "Le surplus pour prendre de la masse" },
      {
        type: "p",
        text: "Le mythe du « bulk dirty » (manger tout et n'importe quoi) ne marche pas. Vise +300 à +400 kcal au-dessus de ton TDEE — ça suffit pour construire du muscle, et ça limite la prise de gras.",
      },
      { type: "h2", text: "Le maintien : sous-estimé" },
      {
        type: "p",
        text: "Beaucoup de gens veulent toujours perdre ou gagner. Apprendre à manger à ton niveau d'entretien pendant plusieurs mois est la base de tout — c'est ce qui te permet ensuite de basculer en déficit ou surplus en connaissance de cause.",
      },
      {
        type: "ul",
        items: [
          "Perte modérée : -500 kcal/jour",
          "Maintien : aligné sur ton TDEE",
          "Prise de masse propre : +400 kcal/jour",
        ],
      },
    ],
  },
  {
    slug: "erreurs-sportifs-amateurs",
    title: "Les erreurs nutrition classiques chez les sportifs amateurs",
    excerpt:
      "Trop de protéines, pas assez de glucides, suppléments inutiles : ce qu'on voit le plus souvent.",
    category: "sport",
    readMinutes: 6,
    publishedAt: "2026-06-04",
    body: [
      {
        type: "p",
        text: "Si tu t'entraînes 3-4 fois par semaine, tu fais partie de la majorité des gens qui aiment le sport sans en faire leur métier. Voici les confusions les plus fréquentes — pas pour culpabiliser, pour gagner du temps.",
      },
      { type: "h2", text: "« Plus de protéines = plus de muscle »" },
      {
        type: "p",
        text: "Au-dessus de 2g/kg de poids corporel par jour, l'apport supplémentaire en protéines ne construit pas plus de muscle. Pour 70 kg = 140g/jour suffisent largement. Tout l'excès est utilisé comme énergie ou stocké.",
      },
      { type: "h2", text: "Diaboliser les glucides" },
      {
        type: "p",
        text: "Les glucides sont le carburant principal des entraînements intenses. Les supprimer = baisse de performance, fatigue, et envies de sucre incontrôlables le soir. Garde-les autour de tes séances.",
      },
      { type: "h2", text: "Les pré-workout et BCAA" },
      {
        type: "p",
        text: "Si ton alimentation couvre déjà tes besoins en protéines, les BCAA ne servent à rien. Le pré-workout, c'est essentiellement de la caféine. Un café t'apportera la même chose pour 5x moins cher.",
      },
      { type: "h2", text: "Sauter les repas avant l'entraînement" },
      {
        type: "p",
        text: "« Je m'entraîne à jeun pour brûler plus de gras » — pas pour les amateurs. Tu te sens vide, ta séance est nulle, et tu compenses au repas d'après. Mange un truc léger 1h avant.",
      },
      {
        type: "quote",
        text: "Le supplément le plus efficace c'est ton assiette quotidienne. Le reste est marketing.",
      },
    ],
  },
  {
    slug: "comprendre-macronutriments",
    title: "Comprendre les macros en 5 minutes",
    excerpt:
      "Protéines, glucides, lipides : à quoi ça sert vraiment, et comment lire une étiquette.",
    category: "basiques",
    readMinutes: 4,
    publishedAt: "2026-06-01",
    body: [
      {
        type: "p",
        text: "Macros = macronutriments. Trois familles : protéines, glucides, lipides. Chacune fait un travail différent dans ton corps. Comprendre ça, c'est comprendre pourquoi on parle de « répartition », pas juste de calories.",
      },
      { type: "h2", text: "Protéines (4 kcal/g)" },
      {
        type: "p",
        text: "Briques de construction du muscle, mais aussi de tes cheveux, ta peau, tes enzymes. Très rassasiantes. Sources : viande, poisson, œufs, légumineuses, yaourt grec.",
      },
      { type: "h2", text: "Glucides (4 kcal/g)" },
      {
        type: "p",
        text: "Le carburant rapide. Ton cerveau et tes muscles tournent avec. Les « simples » (sucre, jus) sont absorbés vite, les « complexes » (riz complet, avoine, légumineuses) tiennent plus longtemps.",
      },
      { type: "h2", text: "Lipides (9 kcal/g)" },
      {
        type: "p",
        text: "Plus denses en calories — facile à dépasser sans s'en rendre compte. Mais essentiels : ils servent aux hormones, à l'absorption des vitamines liposolubles, au cerveau. Privilégie les bonnes sources : huile d'olive, avocat, poissons gras, noix.",
      },
      { type: "h2", text: "Lire une étiquette en 10 secondes" },
      {
        type: "ul",
        items: [
          "Regarde toujours pour 100g, pas pour la portion fantôme du fabricant",
          "Ligne « dont sucres » : sous 5g/100g = OK, au-dessus de 15g = produit sucré",
          "Ligne « dont acides gras saturés » : à limiter, c'est le mauvais gras",
          "Liste des ingrédients : si tu ne reconnais pas la moitié, repose le produit",
        ],
      },
    ],
  },
];

export function findArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
