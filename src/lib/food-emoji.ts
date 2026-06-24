export function getFoodEmoji(name: string): string {
  const n = name.toLowerCase();

  // Fruits
  if (n.includes('pomme') && !n.includes('pomme de terre')) return '🍎';
  if (n.includes('banane')) return '🍌';
  if (n.includes('pastèque')) return '🍉';
  if (n.includes('melon')) return '🍈';
  if (n.includes('orange') || n.includes('clémentine') || n.includes('mandarine') || n.includes('pamplemousse')) return '🍊';
  if (n.includes('citron')) return '🍋';
  if (n.includes('fraise')) return '🍓';
  if (n.includes('framboise') || n.includes('myrtille')) return '🫐';
  if (n.includes('raisin sec') || n.includes('raisin')) return '🍇';
  if (n.includes('pêche') || n.includes('nectarine') || n.includes('abricot')) return '🍑';
  if (n.includes('poire')) return '🍐';
  if (n.includes('kiwi')) return '🥝';
  if (n.includes('mangue')) return '🥭';
  if (n.includes('ananas')) return '🍍';
  if (n.includes('cerise')) return '🍒';
  if (n.includes('avocat')) return '🥑';
  if (n.includes('noix de coco')) return '🥥';
  if (n.includes('figue') || n.includes('datte') || n.includes('pruneau') || n.includes('prune') || n.includes('coing')) return '🍑';
  if (n.includes('kaki') || n.includes('papaye') || n.includes('litchi') || n.includes('physalis') || n.includes('fruit de la passion') || n.includes('grenade')) return '🍈';

  // Légumes
  if (n.includes('carotte')) return '🥕';
  if (n.includes('tomate')) return '🍅';
  if (n.includes('brocoli')) return '🥦';
  if (n.includes('poivron')) return '🫑';
  if (n.includes('concombre') || n.includes('cornichon')) return '🥒';
  if (n.includes('aubergine')) return '🍆';
  if (n.includes('maïs')) return '🌽';
  if (n.includes('oignon')) return '🧅';
  if (n.includes('ail')) return '🧄';
  if (n.includes('champignon')) return '🍄';
  if (n.includes('pomme de terre') || n.includes('patate douce')) return '🥔';
  if (n.includes('haricot vert') || n.includes('petit pois') || n.includes('pois') || n.includes('edamame')) return '🫛';
  if (n.includes('olive')) return '🫒';
  if (n.includes('épinard') || n.includes('courgette') || n.includes('courge') || n.includes('potiron') || n.includes('chou') || n.includes('kale') || n.includes('salade') || n.includes('laitue') || n.includes('mâche') || n.includes('roquette') || n.includes('cresson') || n.includes('iceberg') || n.includes('endive') || n.includes('bette') || n.includes('poireau') || n.includes('céleri') || n.includes('fenouil') || n.includes('asperge') || n.includes('artichaut') || n.includes('navet') || n.includes('rutabaga') || n.includes('panais') || n.includes('topinambour') || n.includes('betterave') || n.includes('radis') || n.includes('cœur de palmier')) return '🥬';

  // Viandes & volailles
  if (n.includes('poulet') || n.includes('dinde') || n.includes('volaille')) return '🍗';
  if (n.includes('bacon') || n.includes('lardons') || n.includes('saucisse')) return '🥓';
  if (n.includes('jambon') || n.includes('porc')) return '🍖';
  if (n.includes('bœuf') || n.includes('steak') || n.includes('entrecôte') || n.includes('rôti') || n.includes('filet de') || n.includes('agneau') || n.includes('lapin') || n.includes('foie')) return '🥩';

  // Protéines végétales
  if (n.includes('tofu') || n.includes('tempeh') || n.includes('seitan') || n.includes('soja texturées')) return '🌱';

  // Poissons & fruits de mer
  if (n.includes('crevettes') || n.includes('surimi') || n.includes('tarama')) return '🍤';
  if (n.includes('moule') || n.includes('saint-jacques') || n.includes('calamar') || n.includes('poulpe')) return '🦑';
  if (n.includes('saumon') || n.includes('thon') || n.includes('sardine') || n.includes('anchois') || n.includes('maquereau') || n.includes('cabillaud') || n.includes('lieu') || n.includes('colin') || n.includes('merlu') || n.includes('sole') || n.includes('dorade') || n.includes('truite')) return '🐟';

  // Œufs
  if (n.includes('œuf') || n.includes('omelette')) return '🥚';

  // Fromages
  if (n.includes('fromage') || n.includes('emmental') || n.includes('gruyère') || n.includes('camembert') || n.includes('brie') || n.includes('comté') || n.includes('mozzarella') || n.includes('parmesan') || n.includes('gouda') || n.includes('feta') || n.includes('burrata') || n.includes('ricotta') || n.includes('chèvre')) return '🧀';

  // Produits laitiers
  if (n.includes('beurre') && !n.includes('cacahuète') && !n.includes('amande')) return '🧈';
  if (n.includes('crème')) return '🥛';
  if (n.includes('lait') || n.includes('yaourt') || n.includes('skyr') || n.includes('fromage blanc') || n.includes('faisselle') || n.includes('petit-suisse') || n.includes('babeurre') || n.includes('fromage cottage')) return '🥛';

  // Féculents
  if (n.includes('riz')) return '🍚';
  if (n.includes('pâtes') || n.includes('vermicelle') || n.includes('spaghetti')) return '🍝';
  if (n.includes('pain')) return '🍞';
  if (n.includes('galette') || n.includes('pita') || n.includes('suédois')) return '🫓';
  if (n.includes('flocons') || n.includes('avoine') || n.includes('muesli')) return '🥣';
  if (n.includes('pop-corn')) return '🍿';
  if (n.includes('biscotte')) return '🍪';
  if (n.includes('quinoa') || n.includes('boulgour') || n.includes('sarrasin') || n.includes('semoule') || n.includes('farine') || n.includes('maïzena') || n.includes('polenta')) return '🌾';

  // Légumineuses
  if (n.includes('lentille') || n.includes('pois chiche') || n.includes('haricot rouge') || n.includes('haricot blanc') || n.includes('haricot noir') || n.includes('flageolet') || n.includes('fève') || n.includes('soja jaune') || n.includes('pois cassé')) return '🫘';

  // Noix & graines
  if (n.includes('amande') || n.includes('noisette') || n.includes('cajou') || n.includes('pistache') || n.includes('cacahuète') || n.includes('pécan') || n.includes('brésil') || n.includes('beurre de') || n.includes('purée d\'amande')) return '🥜';
  if (n.includes('noix')) return '🌰';
  if (n.includes('graine') || n.includes('chia') || n.includes('lin') || n.includes('sésame') || n.includes('tournesol') || n.includes('courge') || n.includes('tahini')) return '🌻';

  // Huiles & matières grasses
  if (n.includes('huile') || n.includes('margarine')) return '🫙';

  // Sauces & condiments
  if (n.includes('ketchup') || n.includes('coulis de tomate')) return '🍅';
  if (n.includes('sel')) return '🧂';
  if (n.includes('moutarde') || n.includes('mayonnaise') || n.includes('vinaigrette') || n.includes('vinaigre') || n.includes('sauce') || n.includes('pesto') || n.includes('nuoc') || n.includes('sriracha') || n.includes('tabasco') || n.includes('worcestershire') || n.includes('barbecue') || n.includes('satay') || n.includes('teriyaki')) return '🫙';
  if (n.includes('tzatziki') || n.includes('hummus')) return '🥙';

  // Épices & aromates
  if (n.includes('piment') || n.includes('sriracha')) return '🌶️';
  if (n.includes('persil') || n.includes('coriandre') || n.includes('basilic') || n.includes('thym') || n.includes('origan')) return '🌿';
  if (n.includes('gingembre') || n.includes('curry') || n.includes('paprika') || n.includes('cumin') || n.includes('curcuma') || n.includes('cannelle') || n.includes('poivre') || n.includes('ail en poudre')) return '🧄';

  // Sucres & chocolat
  if (n.includes('chocolat') || n.includes('cacao')) return '🍫';
  if (n.includes('miel') || n.includes('sirop')) return '🍯';
  if (n.includes('sucre') || n.includes('confiture')) return '🍬';

  // Boissons
  if (n.includes('jus')) return '🥤';
  if (n.includes('lait d\'amande') || n.includes('lait de soja') || n.includes('lait de coco')) return '🥛';

  // Plats préparés
  if (n.includes('pizza')) return '🍕';
  if (n.includes('crêpe')) return '🥞';
  if (n.includes('quiche') || n.includes('omelette')) return '🍳';
  if (n.includes('soupe')) return '🍲';
  if (n.includes('purée')) return '🥔';
  if (n.includes('taboulé')) return '🥙';

  return '🍽️';
}
