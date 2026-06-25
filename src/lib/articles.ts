/**
 * Articles statiques pour la section Apprendre.
 *
 * Catégories alignées sur les filtres UI : bases | mindset | nutrition | recettes
 * Chaque article a son propre emoji (pas juste hérité de la catégorie).
 * Texte inline : [[texte mis en valeur]] → highlight bleu dans ArticleContent.
 */

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export type ArticleCategory = "bases" | "mindset" | "nutrition" | "recettes";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  emoji: string;
  readMinutes: number;
  publishedAt: string;
  body: ArticleBlock[];
};

export const CATEGORY_LABEL: Record<ArticleCategory, string> = {
  bases:     "Basiques",
  mindset:   "Mindset",
  nutrition: "Nutrition",
  recettes:  "Recettes",
};

export const ARTICLES: Article[] = [
  {
    slug: "faux-aliments-sains",
    title: "Les 5 faux aliments « sains » qui te trompent",
    excerpt:
      "Granola, jus pressés, yaourts 0%, barres protéinées… ils ont l'air bons pour toi. Pas toujours.",
    category: "mindset",
    emoji: "🧠",
    readMinutes: 4,
    publishedAt: "2026-06-10",
    body: [
      {
        type: "p",
        text: "Les rayons « bien-être » sont remplis de produits avec un emballage rassurant. Le problème : ces signaux marketing ne disent rien sur la composition réelle.",
      },
      { type: "h2", text: "1. Le granola du petit-déjeuner" },
      {
        type: "p",
        text: "Une portion dépasse souvent [[450 kcal pour 80g]] — autant qu'un repas. C'est surtout du sucre et de l'huile. L'avoine sur l'emballage ne change pas la densité calorique.",
      },
      { type: "h2", text: "2. Les jus de fruits pressés" },
      {
        type: "p",
        text: "Un jus d'orange contient [[autant de sucre qu'un soda]] — mais sans les fibres du fruit entier. Tu absorbes le sucre 5× plus vite, sans le rassasiement de la mastication.",
      },
      { type: "h2", text: "3. Les yaourts 0%" },
      {
        type: "p",
        text: "Souvent compensés en sucre pour garder le goût. Vérifie la ligne « dont sucres » : [[12g par pot = trois carrés de sucre]].",
      },
      { type: "h2", text: "4. Les barres protéinées" },
      {
        type: "p",
        text: "Beaucoup sont des biscuits chocolatés avec quelques protéines ajoutées. [[250 kcal, 18g de sucre]] — à regarder de près avant d'acheter.",
      },
      { type: "h2", text: "5. Le pain « complet » industriel" },
      {
        type: "p",
        text: "Si la farine de blé tendre est en première position dans la liste des ingrédients, [[c'est un pain blanc déguisé]]. Le vrai pain complet n'a qu'une seule farine.",
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
    category: "nutrition",
    emoji: "⚖️",
    readMinutes: 5,
    publishedAt: "2026-06-08",
    body: [
      {
        type: "p",
        text: "Ton corps brûle un certain nombre de calories par jour, même au repos. Pour changer ton poids, tu joues sur l'équilibre entre ce que tu consommes et ce que tu dépenses.",
      },
      { type: "h2", text: "Le déficit calorique pour perdre du poids" },
      {
        type: "p",
        text: "Pour perdre [[~0,5 kg par semaine]], vise un déficit de [[500 kcal/jour]]. C'est suffisant pour voir des résultats sans s'épuiser. Un déficit trop agressif (-1 000 kcal) te fait perdre du muscle.",
      },
      { type: "h2", text: "Le surplus pour prendre de la masse" },
      {
        type: "p",
        text: "Vise [[+300 à +400 kcal]] au-dessus de ton TDEE. C'est suffisant pour construire du muscle tout en limitant la prise de gras. Le « bulk dirty » ne marche pas.",
      },
      { type: "h2", text: "Le maintien : sous-estimé" },
      {
        type: "p",
        text: "Apprendre à manger à ton niveau d'entretien pendant plusieurs mois est la base de tout — c'est ce qui te permet ensuite de basculer en déficit ou surplus en connaissance de cause.",
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
    category: "nutrition",
    emoji: "🏋️",
    readMinutes: 6,
    publishedAt: "2026-06-04",
    body: [
      {
        type: "p",
        text: "Si tu t'entraînes 3-4 fois par semaine, voici les confusions les plus fréquentes — pas pour culpabiliser, pour gagner du temps.",
      },
      { type: "h2", text: "« Plus de protéines = plus de muscle »" },
      {
        type: "p",
        text: "Au-dessus de [[2g/kg de poids corporel par jour]], l'apport supplémentaire ne construit pas plus de muscle. Pour 70 kg = [[140g/jour suffisent]]. Tout l'excès est utilisé comme énergie.",
      },
      { type: "h2", text: "Diaboliser les glucides" },
      {
        type: "p",
        text: "Les glucides sont [[le carburant principal des entraînements intenses]]. Les supprimer = baisse de performance, fatigue, et envies de sucre le soir. Garde-les autour de tes séances.",
      },
      { type: "h2", text: "Les pré-workout et BCAA" },
      {
        type: "p",
        text: "Si ton alimentation couvre tes besoins en protéines, les BCAA ne servent à rien. Le pré-workout c'est essentiellement de la caféine — [[un café donne le même résultat à 5× moins cher]].",
      },
      { type: "h2", text: "Sauter les repas avant l'entraînement" },
      {
        type: "p",
        text: "S'entraîner à jeun pour « brûler plus de gras » ne fonctionne pas pour les amateurs. Ta séance est nulle et tu compenses au repas d'après. [[Mange quelque chose de léger 1h avant]].",
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
    category: "bases",
    emoji: "📊",
    readMinutes: 4,
    publishedAt: "2026-06-01",
    body: [
      {
        type: "p",
        text: "Macros = macronutriments. Trois familles : protéines, glucides, lipides. Chacune fait un travail différent. Comprendre ça, c'est comprendre pourquoi on parle de « répartition », pas juste de calories.",
      },
      { type: "h2", text: "Protéines — 4 kcal/g" },
      {
        type: "p",
        text: "Briques de construction du muscle, mais aussi de ta peau, tes enzymes. [[Très rassasiantes]]. Sources : viande, poisson, œufs, légumineuses, yaourt grec.",
      },
      { type: "h2", text: "Glucides — 4 kcal/g" },
      {
        type: "p",
        text: "[[Le carburant rapide]] de ton cerveau et tes muscles. Les « simples » (sucre, jus) sont absorbés vite, les « complexes » (riz complet, avoine) tiennent plus longtemps.",
      },
      { type: "h2", text: "Lipides — 9 kcal/g" },
      {
        type: "p",
        text: "[[Plus denses en calories]] — facile à dépasser sans s'en rendre compte. Mais essentiels pour les hormones, les vitamines et le cerveau. Préfère : huile d'olive, avocat, noix, poissons gras.",
      },
      { type: "h2", text: "Lire une étiquette en 10 secondes" },
      {
        type: "ul",
        items: [
          "Regarde toujours pour 100g, pas pour la portion du fabricant",
          "« dont sucres » : sous 5g/100g = OK, au-dessus de 15g = produit sucré",
          "« dont acides gras saturés » : à limiter",
          "Liste des ingrédients : si tu ne reconnais pas la moitié, repose le produit",
        ],
      },
    ],
  },
  {
    slug: "hydratation-bases",
    title: "Hydratation : combien d'eau boire vraiment",
    excerpt:
      "La soif n'est pas un bon indicateur. Ce que l'eau fait dans ton corps et comment couvrir tes besoins.",
    category: "bases",
    emoji: "💧",
    readMinutes: 3,
    publishedAt: "2026-06-20",
    body: [
      {
        type: "p",
        text: "On parle tout le temps de calories, jamais d'eau. Pourtant l'hydratation influence directement l'énergie, la faim et les performances — que tu fasses du sport ou non.",
      },
      { type: "h2", text: "Combien d'eau boire ?" },
      {
        type: "p",
        text: "La règle de base : [[35 ml par kg de poids corporel par jour]]. Pour 70 kg = environ 2,5 litres. Mais c'est un point de départ — la chaleur, le sport et l'alimentation font varier ce chiffre.",
      },
      { type: "h2", text: "La soif te ment" },
      {
        type: "p",
        text: "Quand tu ressens la soif, ton corps est [[déjà légèrement déshydraté]]. En pratique : bois régulièrement sans attendre. Une urine jaune foncé = tu bois trop peu. Claire comme de l'eau = tu es bien hydraté.",
      },
      { type: "h2", text: "L'eau cachée dans les aliments" },
      {
        type: "p",
        text: "[[20 à 30% de tes apports en eau]] viennent des aliments. Fruits et légumes en contiennent 80 à 95%. Manger peu de végétaux = compenser avec encore plus d'eau à boire.",
      },
      { type: "h2", text: "Faim ou soif ?" },
      {
        type: "p",
        text: "La déshydratation légère se confond souvent avec la faim. [[Boire un grand verre d'eau avant de manger]] peut réduire les portions naturellement — simple et gratuit.",
      },
      {
        type: "quote",
        text: "La soif n'est pas un bon indicateur — à ce stade tu es déjà légèrement déshydraté.",
      },
    ],
  },
  {
    slug: "petits-dejeuners-proteines",
    title: "5 petits-déjeuners riches en protéines (prêts en 10 min)",
    excerpt:
      "Démarrer la journée avec des protéines réduit les fringales. Voici 5 idées rapides et concrètes.",
    category: "recettes",
    emoji: "🍳",
    readMinutes: 4,
    publishedAt: "2026-06-22",
    body: [
      {
        type: "p",
        text: "Un petit-déjeuner riche en protéines réduit les fringales de milieu de matinée et stabilise la glycémie. Objectif : [[au moins 20g de protéines]] au réveil. Voici 5 options rapides.",
      },
      { type: "h2", text: "1. Bowl yaourt grec & fruits" },
      {
        type: "p",
        text: "[[170g de yaourt grec nature]] (17g de protéines) + une poignée de fruits rouges + granola maison ou noix. 3 minutes, pas de cuisson. Ajoute une cuillère de graines de chia pour +3g de protéines.",
      },
      { type: "h2", text: "2. Œufs brouillés sur pain complet" },
      {
        type: "p",
        text: "[[2 œufs brouillés = 12g de protéines]], prêts en 3 minutes. Sur une tranche de pain complet + une tranche de jambon blanc = [[+22g au total]]. Simple, rassasiant, peu cher.",
      },
      { type: "h2", text: "3. Fromage blanc & miel" },
      {
        type: "p",
        text: "150g de fromage blanc à 20% = [[17g de protéines]] pour environ 130 kcal. Ajoute une cuillère de miel et des noix concassées. Se prépare en 1 minute.",
      },
      { type: "h2", text: "4. Smoothie protéiné express" },
      {
        type: "p",
        text: "200ml de lait demi-écrémé + 1 banane + 150g de yaourt grec = [[environ 18g de protéines]]. Mixe et c'est prêt. Tu peux ajouter une cuillère de beurre de cacahuète pour de la saveur et des lipides sains.",
      },
      { type: "h2", text: "5. Pain complet, avocat & œuf poché" },
      {
        type: "p",
        text: "½ avocat + 1 œuf poché (7 min) sur pain complet = [[~16g de protéines]] + bonnes graisses mono-insaturées. Le plus long des 5, mais le plus rassasiant sur la durée.",
      },
      {
        type: "quote",
        text: "Un petit-déjeuner protéiné ne demande pas plus de 10 minutes. C'est une habitude, pas une contrainte.",
      },
    ],
  },
];

export function findArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
