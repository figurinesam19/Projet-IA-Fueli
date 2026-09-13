/**
 * Articles statiques pour la section Apprendre.
 *
 * Catégories alignées sur les filtres UI : bases | nutrition | recettes
 * Chaque article a son emoji (détail article) et une photo miniature
 * thématique affichée sur les cartes (voir ARTICLE_IMAGE / articleThumb).
 * Texte inline : [[texte mis en valeur]] → highlight bleu dans ArticleContent.
 */

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "img"; src: string; alt: string };

export type ArticleCategory = "bases" | "nutrition" | "recettes";

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
  nutrition: "Nutrition",
  recettes:  "Recettes",
};

// Photo miniature par article (affichée sur les cartes Apprendre).
const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=400&h=300&fit=crop&q=80`;

const ARTICLE_IMAGE: Record<string, string> = {
  "dejeuners-equilibres-15-min": unsplash("1512621776951-a57141f2eefd"), // buddha bowl
  "diners-legers-rassasiants":   unsplash("1547592180-85f173990554"),    // soupe
  "batch-cooking-bases":         unsplash("1490645935967-10de6ba17061"), // meal prep
  "petits-dejeuners-proteines":  unsplash("1484723091739-30a097e8f929"), // petit-déj œufs
  "sommeil-et-faim":             unsplash("1541781774459-bb2af2f05b55"), // lit / sommeil
  "tes-besoins-selon-objectif":  unsplash("1498837167922-ddd27525d352"), // table de plats
  "erreurs-sportifs-amateurs":   unsplash("1534438327276-14e5300c3a48"), // salle de sport
  "comprendre-macronutriments":  unsplash("1546069901-ba9599a7e63c"),    // assiette colorée
  "hydratation-bases":           unsplash("1548839140-29a749e1cf4d"),    // verre d'eau
};

// Photo de repli par catégorie si un article n'a pas de miniature dédiée.
const CATEGORY_IMAGE: Record<ArticleCategory, string> = {
  recettes:  unsplash("1512621776951-a57141f2eefd"),
  nutrition: unsplash("1498837167922-ddd27525d352"),
  bases:     unsplash("1546069901-ba9599a7e63c"),
};

/** Miniature thématique d'un article pour les cartes de la page Apprendre. */
export function articleThumb(a: Article): string {
  return ARTICLE_IMAGE[a.slug] ?? CATEGORY_IMAGE[a.category];
}

export const ARTICLES: Article[] = [
  {
    slug: "dejeuners-equilibres-15-min",
    title: "5 déjeuners équilibrés prêts en 15 minutes",
    excerpt:
      "Pas le temps de cuisiner le midi ? Voici 5 assiettes complètes, rapides et rassasiantes.",
    category: "recettes",
    emoji: "🥗",
    readMinutes: 5,
    publishedAt: "2026-09-12",
    body: [
      {
        type: "p",
        text: "Le déjeuner est le repas qu'on bâcle le plus : sandwich pris sur le pouce, restes vite avalés. Pourtant un midi équilibré évite le coup de barre de l'après-midi. Voici 5 idées avec [[une source de protéines, un féculent et des légumes]] — la structure d'une assiette qui tient.",
      },
      { type: "img", src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=220&fit=crop&q=80", alt: "Assiettes équilibrées préparées à l'avance" },
      { type: "h2", text: "1. Bowl poulet, riz complet & légumes" },
      {
        type: "p",
        text: "[[120g de blanc de poulet]] (déjà cuit la veille) + 150g de riz complet + poêlée de légumes surgelés. Prêt en 10 minutes si le poulet est prêt. Environ [[520 kcal et 40g de protéines]].",
      },
      { type: "h2", text: "2. Wrap thon-crudités" },
      {
        type: "p",
        text: "1 boîte de thon au naturel + fromage frais + crudités dans une galette complète. [[30g de protéines]] pour un déjeuner nomade, sans cuisson. Idéal quand tu manges au bureau.",
      },
      { type: "h2", text: "3. Salade lentilles-feta" },
      {
        type: "p",
        text: "Les lentilles cuites en conserve sont [[riches en protéines végétales et en fibres]]. Ajoute 40g de feta, des tomates et un filet d'huile d'olive. Rassasiant, sans viande, prêt en 5 minutes.",
      },
      { type: "h2", text: "4. Omelette express & pain complet" },
      {
        type: "p",
        text: "3 œufs + une poignée d'épinards + une tranche de pain complet. [[20g de protéines]], 8 minutes montre en main. Le repas de secours quand le frigo est vide.",
      },
      { type: "h2", text: "5. Poke bowl saumon maison" },
      {
        type: "p",
        text: "100g de saumon (cru très frais ou fumé) + riz + avocat + edamame + concombre. Plus long à assembler mais [[riche en oméga-3]] et vraiment rassasiant. À préparer la veille au soir.",
      },
      {
        type: "quote",
        text: "Un bon déjeuner, c'est trois cases cochées : protéines, féculent, légumes. Le reste est du détail.",
      },
    ],
  },
  {
    slug: "sommeil-et-faim",
    title: "Pourquoi le manque de sommeil te donne faim",
    excerpt:
      "Mal dormir dérègle deux hormones de la faim. Comprendre le lien change ta journée du lendemain.",
    category: "nutrition",
    emoji: "😴",
    readMinutes: 4,
    publishedAt: "2026-09-11",
    body: [
      {
        type: "p",
        text: "Tu as sûrement remarqué qu'après une mauvaise nuit, tu grignotes plus et tu craques sur le sucre. Ce n'est pas un manque de volonté : c'est [[biologique]]. Le sommeil pilote directement ton appétit.",
      },
      { type: "h2", text: "Deux hormones qui se dérèglent" },
      {
        type: "p",
        text: "La [[ghréline]] déclenche la faim, la [[leptine]] signale la satiété. Une nuit trop courte fait monter la ghréline et chuter la leptine : tu as plus faim et tu es rassasié moins vite. Le combo parfait pour trop manger sans même le décider.",
      },
      { type: "h2", text: "L'attirance vers le sucre et le gras" },
      {
        type: "p",
        text: "Fatigué, ton cerveau cherche de l'énergie rapide et [[une récompense immédiate]]. C'est pour ça qu'on rêve de viennoiseries après une nuit blanche, jamais de brocolis. Le manque de sommeil pousse mécaniquement vers les aliments les plus caloriques.",
      },
      { type: "h2", text: "Ce que tu peux faire" },
      {
        type: "ul",
        items: [
          "Vise 7 à 8 heures : c'est un levier nutrition, pas juste du repos",
          "Un petit-déjeuner protéiné coupe les fringales du lendemain",
          "Après une mauvaise nuit, anticipe : prépare des encas sains à portée",
          "Évite de compenser la fatigue par du café + sucre en continu",
        ],
      },
      {
        type: "quote",
        text: "Bien dormir, c'est déjà bien manger. Ta nuit décide d'une partie de tes choix du lendemain.",
      },
    ],
  },
  {
    slug: "diners-legers-rassasiants",
    title: "5 dîners légers qui rassasient vraiment",
    excerpt:
      "Manger léger le soir ne veut pas dire avoir faim à 22h. 5 dîners malins et complets.",
    category: "recettes",
    emoji: "🍲",
    readMinutes: 5,
    publishedAt: "2026-09-10",
    body: [
      {
        type: "p",
        text: "Le soir, on veut souvent alléger sans se coucher le ventre vide. Le secret : [[beaucoup de volume, des protéines, peu de calories vides]]. Voici 5 dîners qui calent sans peser.",
      },
      { type: "img", src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=220&fit=crop&q=80", alt: "Assiette de légumes colorés et protéines" },
      { type: "h2", text: "1. Soupe de légumes + œuf poché" },
      {
        type: "p",
        text: "Une grande soupe maison (ou surgelée sans crème) + 1 ou 2 œufs pochés dedans. [[Beaucoup de volume, peu de calories]], et l'œuf apporte les protéines qui manquent aux soupes.",
      },
      { type: "h2", text: "2. Poêlée de crevettes & courgettes" },
      {
        type: "p",
        text: "150g de crevettes + courgettes sautées à l'ail. [[Moins de 300 kcal, 25g de protéines]]. Prêt en 10 minutes, ultra léger et savoureux.",
      },
      { type: "h2", text: "3. Cabillaud vapeur & légumes verts" },
      {
        type: "p",
        text: "Le poisson blanc est [[maigre et très protéiné]]. Un filet vapeur + haricots verts + un filet de citron = un dîner de sportif, digeste avant de dormir.",
      },
      { type: "h2", text: "4. Fromage blanc salé & crudités" },
      {
        type: "p",
        text: "Version salée du fromage blanc : herbes, concombre, radis, un peu de sel. [[17g de protéines]] pour très peu de calories. Parfait les soirs sans faim mais où il faut manger quelque chose.",
      },
      { type: "h2", text: "5. Omelette aux champignons & salade" },
      {
        type: "p",
        text: "2 œufs + champignons poêlés + grande salade verte. [[Rassasiant, moins de 350 kcal]]. Le dîner du dimanche soir quand le frigo se vide.",
      },
      {
        type: "quote",
        text: "Léger ne veut pas dire triste ni avoir faim. Ça veut dire du volume et des protéines, moins de gras caché.",
      },
    ],
  },
  {
    slug: "batch-cooking-bases",
    title: "Batch cooking : 3 bases pour toute la semaine",
    excerpt:
      "Cuisine une fois, mange 5 jours. Trois préparations à combiner pour des repas express.",
    category: "recettes",
    emoji: "🍱",
    readMinutes: 5,
    publishedAt: "2026-09-06",
    body: [
      {
        type: "p",
        text: "Le batch cooking, c'est cuisiner [[une seule fois]] des bases neutres, puis les assembler toute la semaine. Pas des plats entiers figés : des briques à combiner. Voici les 3 bases les plus rentables.",
      },
      { type: "img", src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=220&fit=crop&q=80", alt: "Repas préparés en avance dans des boîtes" },
      { type: "h2", text: "Base 1 : une protéine en grande quantité" },
      {
        type: "p",
        text: "Cuis [[600 à 800g de poulet, de bœuf haché maigre ou de pois chiches]] d'un coup. C'est la brique la plus longue à cuire — la faire une fois te débloque tous les repas de la semaine.",
      },
      { type: "h2", text: "Base 2 : un féculent complet" },
      {
        type: "p",
        text: "Un grand volume de [[riz complet, quinoa ou patates douces rôties]]. Se conserve 4-5 jours au frigo et se réchauffe en 2 minutes. Ta source d'énergie prête à l'emploi.",
      },
      { type: "h2", text: "Base 3 : des légumes rôtis" },
      {
        type: "p",
        text: "Une plaque de [[courgettes, poivrons, brocolis rôtis au four]] pendant que le reste cuit. Zéro effort supplémentaire, et tu as ta portion de légumes garantie chaque jour.",
      },
      { type: "h2", text: "Assembler en 3 minutes" },
      {
        type: "ul",
        items: [
          "Bowl : protéine + féculent + légumes + sauce yaourt",
          "Wrap : protéine + légumes dans une galette complète",
          "Salade tiède : légumes + féculent + filet d'huile d'olive",
          "Assiette express : réchauffe les 3 bases et c'est prêt",
        ],
      },
      {
        type: "quote",
        text: "Deux heures le dimanche t'épargnent cinq « je sais pas quoi manger » dans la semaine.",
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
      { type: "img", src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=220&fit=crop&q=80", alt: "Préparation de repas équilibrés" },
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
      { type: "img", src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=220&fit=crop&q=80", alt: "Salle de sport et haltères" },
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
      { type: "img", src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=220&fit=crop&q=80", alt: "Assiette colorée avec protéines, glucides et légumes" },
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
      { type: "img", src: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=220&fit=crop&q=80", alt: "Verre d'eau fraîche" },
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
      { type: "img", src: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&h=220&fit=crop&q=80", alt: "Petit-déjeuner avec œufs et toasts" },
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
