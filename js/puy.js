// ============================================================
// puy.js — Univers caché Puy du Fou
// ------------------------------------------------------------
// Section accessible uniquement après le Konami code.
// Univers parallèle : XP, grades et classement séparés du volley.
// ============================================================

// ----------------------------------------------------------------
// LES 20 GRADES PUY DU FOU
// ----------------------------------------------------------------
export const GRADES_PUY = [
  { min: 0,     name: "Manant",                 icon: "🌾", desc: "Vous franchissez les portes du parc" },
  { min: 100,   name: "Pèlerin",                icon: "🚶", desc: "En quête des secrets du Puy du Fou" },
  { min: 250,   name: "Apprenti",               icon: "🥉", desc: "Vous découvrez l'univers du Puy du Fou" },
  { min: 500,   name: "Page",                   icon: "📜", desc: "Au service des grands chevaliers" },
  { min: 850,   name: "Écuyer",                 icon: "⚔️", desc: "Vos premières armes dans l'arène" },
  { min: 1300,  name: "Sergent d'Armes",        icon: "🗡️", desc: "Vous maniez l'épée avec aisance" },
  { min: 1900,  name: "Chevalier",              icon: "🛡️", desc: "Un vrai connaisseur du parc" },
  { min: 2700,  name: "Chevalier Banneret",     icon: "🚩", desc: "Vous menez vos propres troupes" },
  { min: 3700,  name: "Mousquetaire",           icon: "🎭", desc: "Maître des secrets du Puy du Fou" },
  { min: 5000,  name: "Capitaine des Gardes",   icon: "🎖️", desc: "Vous commandez aux portes du château" },
  { min: 6500,  name: "Chevalier d'Honneur",    icon: "⭐", desc: "Expert reconnu et respecté" },
  { min: 8500,  name: "Maître d'Armes",         icon: "👑", desc: "Vous régnez sur les arènes" },
  { min: 11000, name: "Sénéchal",               icon: "🏰", desc: "Intendant des terres royales" },
  { min: 14000, name: "Connétable",             icon: "⚜️", desc: "Chef suprême des armées du Roi" },
  { min: 18000, name: "Duc du Puy du Fou",      icon: "💠", desc: "Souverain de votre propre duché" },
  { min: 23000, name: "Prince du Royaume",      icon: "🤴", desc: "Héritier des plus grandes lignées" },
  { min: 30000, name: "Roi des Arènes",         icon: "👑", desc: "Nul ne vous égale dans l'arène" },
  { min: 40000, name: "Empereur du Spectacle",  icon: "🏛️", desc: "Votre nom traverse les âges" },
  { min: 55000, name: "Légende du Puy du Fou",  icon: "🌟", desc: "Votre nom entre dans la légende !" },
  { min: 75000, name: "Mythe Vivant",           icon: "☀️", desc: "Vous êtes désormais un mythe éternel" }
];

// Trouve le grade actuel selon l'XP
export function getGradePuy(xp) {
  let grade = GRADES_PUY[0];
  for (const g of GRADES_PUY) {
    if (xp >= g.min) grade = g;
    else break;
  }
  return grade;
}

// Progression vers le grade suivant
export function getProgressionPuy(xp) {
  const grade = getGradePuy(xp);
  const idx = GRADES_PUY.indexOf(grade);
  const prochain = GRADES_PUY[idx + 1];
  if (!prochain) {
    return { grade, prochain: null, xpDansNiveau: 0, xpTotalNiveau: 0, pourcentage: 100 };
  }
  const xpDansNiveau = xp - grade.min;
  const xpTotalNiveau = prochain.min - grade.min;
  const pourcentage = Math.min(100, Math.round((xpDansNiveau / xpTotalNiveau) * 100));
  return { grade, prochain, xpDansNiveau, xpTotalNiveau, pourcentage };
}

// Messages de fin de quiz Puy du Fou
export const MSGS_PUY = {
  legende: ["Légendaire ! Votre nom restera gravé.", "Une performance digne des plus grands.", "Magistral !"],
  excellent: ["Excellent ! Une véritable maîtrise.", "Bravo, vous avez tout d'un Mousquetaire !", "Performance remarquable."],
  bien: ["Bonne performance, continuez ainsi.", "Vous progressez bien, Chevalier !", "Très honorable."],
  moyen: ["Honorable, mais peut mieux faire.", "Encore un peu d'entraînement.", "La voie de la sagesse est longue..."],
  faible: ["Le chemin sera long, mais ne baissez pas les bras.", "Le Puy du Fou se mérite, persévérez.", "Retournez aux livres, Apprenti !"]
};

export function getMessagePuy(pct) {
  if (pct >= 90) return MSGS_PUY.legende[Math.floor(Math.random() * 3)];
  if (pct >= 70) return MSGS_PUY.excellent[Math.floor(Math.random() * 3)];
  if (pct >= 50) return MSGS_PUY.bien[Math.floor(Math.random() * 3)];
  if (pct >= 30) return MSGS_PUY.moyen[Math.floor(Math.random() * 3)];
  return MSGS_PUY.faible[Math.floor(Math.random() * 3)];
}

// ----------------------------------------------------------------
// BANQUE DE QUESTIONS PUY DU FOU (260 questions)
// ----------------------------------------------------------------
// Chaque question : { text, answers, correct, difficulty, points }
// Difficulté : facile (60pts) / moyen (100pts) / dur (150pts) / extreme (200pts)
// ----------------------------------------------------------------
export const QUESTIONS_PUY = [
  { text: "Dans quel spectacle peut-on voir le personnage d'Aliénor ?", answers: ["Les vikings", "Le mime et l'étoile", "Le bal des oiseaux fantôme", "Le secret de la lance"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Combien y a-t-il d'oiseaux lors du spectacle Le bal des oiseaux fantôme ?", answers: ["200", "521", "150", "330"], correct: 3, difficulty: "extreme", points: 200 },
  { text: "Quelle est la particularité du spectacle « Le Secret de la Lance » ?", answers: ["La muraille tombe", "Le sol commence à s'élever", "La scène prend feu", "Les tribunes tournent"], correct: 0, difficulty: "facile", points: 60 },
  { text: "Quelle est la devise du Puy du Fou ?", answers: ["Le respect est notre force", "Le secret règnera", "C'est à jamais", "L'irréel devient réel"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Dans quel spectacle peut-on voir un carrosse tiré par des cygnes ?", answers: ["Les grandes eaux", "Les mousquetaires de Richelieu", "Les vikings", "Les noces de feu"], correct: 3, difficulty: "facile", points: 60 },
  { text: "Dans quel spectacle peut-on apercevoir une personne se faire attaquer par un rapace ?", answers: ["Les vikings", "Le bal des oiseaux fantômes", "Le café madelon", "Le dernier panache"], correct: 0, difficulty: "facile", points: 60 },
  { text: "En quelle année a eu lieu la première représentation de La Cinéscénie ?", answers: ["1975", "1978", "1982", "1989"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Combien d'hectares mesure la scène de la Cinéscénie ?", answers: ["10 hectares", "23 hectares", "50 hectares", "5 hectares"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "Combien de bénévoles participent à la Cinéscénie ?", answers: ["1 200", "2 400", "4 000", "6 000"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Quel spectacle met en scène une course de chars dans un stadium gallo-romain ?", answers: ["Le Secret de la Lance", "Les vikings", "Le Signe du Triomphe", "Le Dernier Panache"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Combien de places compte le stadium du Signe du Triomphe ?", answers: ["3 000", "5 000", "7 000", "10 000"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Quelle époque est représentée dans Le Mime et l'Étoile ?", answers: ["Le Moyen Âge", "La Révolution française", "La Belle Époque et les débuts du cinéma", "La Seconde Guerre mondiale"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Dans quel spectacle les tribunes tournent-elles à 360° autour de la scène ?", answers: ["Le Signe du Triomphe", "Le Bal des Oiseaux Fantôme", "Le Dernier Panache", "Les Mousquetaires de Richelieu"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Quel héros vendéen est au cœur du spectacle Le Dernier Panache ?", answers: ["Jean Chouan", "La Rochejaquelein", "François Athanase Charette", "Henri de la Roche"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Quelle est la capacité d'accueil de La Cinéscénie ?", answers: ["7 000 places", "10 000 places", "13 000 places", "20 000 places"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Combien de visiteurs le Puy du Fou a-t-il accueillis en France en 2024 (année record) ?", answers: ["1,8 million", "2,6 millions", "2,8 millions", "3,5 millions"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Combien de spectacles le Puy du Fou a-t-il joués dans le monde en 2024 ?", answers: ["4 200", "7 500", "11 828", "15 000"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Quel est le nom du village d'époque gallo-romain du Puy du Fou ?", answers: ["Chasseloup", "Bourg Bérard", "Font-Rognou", "Saint Philbert le Vieil"], correct: 3, difficulty: "extreme", points: 200 },
  { text: "Dans quel spectacle surgit un drakkar viking parmi les flammes sur un lac ?", answers: ["Le Secret de la Lance", "Les Noces de Feu", "Les Vikings", "Le Signe du Triomphe"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Combien d'espèces d'oiseaux la fauconnerie du Puy du Fou élève-t-elle ?", answers: ["12 espèces", "40 espèces", "73 espèces", "150 espèces"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Quel spectacle nocturne se déroule sur le lac avec des cascadeurs subaquatiques ?", answers: ["La Cinéscénie", "Les Vikings", "Les Noces de Feu", "Le Bal des Oiseaux Fantôme"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Quel spectacle a remplacé Les Chevaliers de la Table Ronde en 2025 ?", answers: ["Le Mystère de Merlin", "L'Épée du Roi Arthur", "La Quête du Graal", "Le Retour d'Arthur"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Combien de places a Les Noces de Feu, le plus grand spectacle du Grand Parc ?", answers: ["7 000 places", "10 000 places", "13 000 places", "15 000 places"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "Combien de chevaux sont entrainés toute l'année dans les coulisses du Puy du Fou ?", answers: ["50 chevaux", "100 chevaux", "200 chevaux", "400 chevaux"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Combien de minutes dure Le Bal des Oiseaux Fantôme ?", answers: ["15 min", "20 min", "33 min", "45 min"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "À quelle hauteur les oiseaux lâchés depuis une montgolfière peuvent-ils s'envoler lors du Bal des Oiseaux Fantôme ?", answers: ["50 mètres", "100 mètres", "200 mètres", "500 mètres"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Dans quel département français se situe le Puy du Fou ?", answers: ["Loire-Atlantique", "Maine-et-Loire", "Vendée", "Deux-Sèvres"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Quel roi franc est évoqué dans le spectacle Le Premier Royaume ?", answers: ["Charlemagne", "Dagobert", "Clovis", "Louis le Pieux"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Combien d'acteurs bénévoles participent au spectacle de La Cinéscénie ?", answers: ["800 acteurs", "1 200 acteurs", "2 400 acteurs", "5 000 acteurs"], correct: 2, difficulty: "dur", points: 150 },
  { text: "En quelle année le Grand Parc du Puy du Fou a-t-il ouvert ses portes ?", answers: ["1978", "1983", "1989", "1995"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Dans quel pays le Puy du Fou a-t-il ouvert un deuxième parc en 2021 ?", answers: ["Italie", "Portugal", "Espagne", "Belgique"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Dans quel spectacle peut-on entendre : « Si il faut brûler avec eux... Nous brûlerons » ?", answers: ["Le dernier panache", "Le signe du triomphe", "Les vikings", "Les noces de feu"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "Combien y a-t-il de drakkars dans le spectacle Les Vikings ?", answers: ["1", "2", "3", "4"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Depuis quelle année le Grand Parc du Puy du Fou n'avait-il pas rouvert pour Noël avant 2026 ?", answers: ["2010", "2014", "2018", "2020"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Combien de chevaux de spectacle le Puy du Fou possède-t-il ?", answers: ["80 chevaux", "150 chevaux", "230 chevaux", "400 chevaux"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Quel est le spectacle du Puy du Fou qui dure le plus longtemps (hors Cinéscénie) ?", answers: ["Le Bal des Oiseaux Fantôme (33 min)", "Le Dernier Panache (40 min)", "Le Signe du Triomphe (35 min)", "Les Noces de Feu (45 min)"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "Combien d'animaux vivent dans le parc naturel du Puy du Fou ?", answers: ["500 animaux", "1 000 animaux", "1 500 animaux", "3 000 animaux"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Quel est le nom du spectacle qui met en scène des gladiateurs romains au Puy du Fou ?", answers: ["Les Légions de Rome", "Le Signe du Triomphe", "La Bataille des Arènes", "Ave Caesar"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Combien de places de tribune dispose L'Épée du Roi Arthur ?", answers: ["500 places", "1 500 places", "2 000 places", "4 000 places"], correct: 1, difficulty: "dur", points: 150 },
  { text: "En quelle année Le Mime et l'Étoile a-t-il ouvert ses portes ?", answers: ["2021", "2022", "2023", "2024"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Quel roi préside la fête de la Frairie de la Toussaint au Puy du Fou ?", answers: ["Louis XIV", "Henri IV", "François 1er", "Charles IX"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Combien d'artistes participent à la Frairie de la Toussaint ?", answers: ["50 artistes", "100 artistes", "150 artistes", "300 artistes"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Quel type de combat peut-on voir dans le spectacle Le Secret de la Lance ?", answers: ["Des combats de gladiateurs", "Des duels à l'épée", "Des cascades de cavaliers voltigeurs", "Des batailles navales"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Quelle est la longueur du rideau de scène du Grand Carrousel des Mousquetaires de Richelieu ?", answers: ["30 mètres", "50 mètres", "80 mètres", "120 mètres"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Qui a fondé le Puy du Fou ?", answers: ["Nicolas de Villiers", "Philippe de Villiers", "Jean de Villiers", "François de Villiers"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Qui est aujourd'hui président du Puy du Fou ?", answers: ["Philippe de Villiers", "Nicolas de Villiers", "Jean-Pierre de Villiers", "Marc de Villiers"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Dans quel village d'époque se trouve le spectacle de fauconnerie Le Bal des Oiseaux Fantôme ?", answers: ["Saint Philbert le Vieil", "Le Bourg Bérard", "Font-Rognou", "Chasseloup"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Quel spectacle raconte l'histoire d'amour d'une muse violoniste et d'un pianiste ?", answers: ["Le Mime et l'Étoile", "Les Noces de Feu", "Le Bal des Oiseaux Fantôme", "La Cinéscénie"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Quelle est la durée du spectacle Le Mime et l'Étoile ?", answers: ["15 minutes", "27 minutes", "45 minutes", "1 heure"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Combien de places a la salle du Mime et l'Étoile ?", answers: ["800 places", "1 200 places", "2 000 places", "4 000 places"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Quel est le nom du réalisateur fictif que l'on suit dans Le Mime et l'Étoile ?", answers: ["Georges", "Félix", "Louis", "Marcel"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "En quelle année Les Mousquetaires de Richelieu ont-ils ouvert leurs portes ?", answers: ["2001", "2004", "2006", "2009"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Quel spectacle du Puy du Fou se déroule dans une tranchée reconstituée de la Première Guerre mondiale ?", answers: ["Le Secret de la Lance", "Le Dernier Panache", "Les Amoureux de Verdun", "Le Premier Royaume"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Quel est le nom du premier spectacle jamais joué au Puy du Fou (1978) ?", answers: ["Les Vikings", "Le Bal des Oiseaux Fantôme", "La Cinéscénie", "Le Signe du Triomphe"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Quelle période historique le village de Chasseloup représente-t-il ?", answers: ["L'Antiquité", "Le Moyen Âge", "Le XVIIIe siècle (époque de Charette)", "Le début du XXe siècle"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Que représente le village Saint Philbert le Vieil au Puy du Fou ?", answers: ["La Gaule romaine", "L'an mil (Moyen Âge)", "La Renaissance", "Le XVIIIe siècle"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "Combien de saisons (années) le spectacle Les Chevaliers de la Table Ronde a-t-il été joué avant d'être remplacé ?", answers: ["5 ans", "8 ans", "12 ans", "20 ans"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Combien le Puy du Fou a-t-il accueilli de visiteurs en 2025 ?", answers: ["1,5 million", "2 millions", "3 millions", "5 millions"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Quelle saison fait son grand retour au Puy du Fou en décembre 2026 ?", answers: ["Halloween", "Noël", "Pâques", "Le carnaval"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Comment s'appelle le nouveau spectacle de Noël prévu en décembre 2026 ?", answers: ["L'Étoile de Noël", "Le Mystère de Noël", "La Magie de Noël", "Le Conte de Noël"], correct: 1, difficulty: "facile", points: 60 },
  { text: "En quelle année L'Épée du Roi Arthur a-t-il ouvert ?", answers: ["2023", "2024", "2025", "2026"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Comment s'appelle le héros principal du spectacle L'Épée du Roi Arthur ?", answers: ["Lancelot", "Tristan", "Perceval", "Galaad"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Quel personnage maléfique s'oppose à Tristan dans L'Épée du Roi Arthur ?", answers: ["Mordred", "Morgane", "Méléagant", "Méliane"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Quel spectacle fête ses 20 ans au Puy du Fou en 2026 ?", answers: ["La Cinéscénie", "Les Vikings", "Les Mousquetaires de Richelieu", "Le Bal des Oiseaux Fantôme"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Quel hôtel du Puy du Fou s'agrandit de 100 chambres en 2026 ?", answers: ["La Citadelle", "Le Grand Siècle", "La Villa Gallo-Romaine", "Les Iles de Clovis"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Quel chef étoilé signe la nouvelle carte du restaurant L'Auberge en 2026 ?", answers: ["Alain Ducasse", "Alexandre Couillon", "Anne-Sophie Pic", "Yannick Alléno"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Combien d'hôtels historiques compte le Puy du Fou ?", answers: ["3", "4", "6", "10"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Quel élément naturel domine le spectacle Les Noces de Feu ?", answers: ["La terre", "L'air", "L'eau et le feu", "La pierre"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Le Puy du Fou a-t-il déjà été élu « Meilleur Parc du Monde » ?", answers: ["Non", "Une fois", "Plusieurs fois", "Jamais en compétition"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Combien de villages d'époque peut-on visiter au Puy du Fou ?", answers: ["2", "4", "6", "8"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Quel spectacle nocturne célèbre fête de l'union d'une muse et d'un pianiste ?", answers: ["La Cinéscénie", "Les Noces de Feu", "Le Mystère de la Pérouse", "Le Premier Royaume"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Quel spectacle relate l'histoire d'un navigateur et explorateur français ?", answers: ["Le Premier Royaume", "Le Mystère de la Pérouse", "Le Dernier Panache", "Les Vikings"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Dans quelle région française se trouve le Puy du Fou ?", answers: ["Bretagne", "Pays de la Loire", "Nouvelle-Aquitaine", "Centre-Val de Loire"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Quelle est la commune où se trouve le Puy du Fou ?", answers: ["Cholet", "Les Herbiers", "Les Epesses", "La Roche-sur-Yon"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Quel pré-show accueille les visiteurs avant Le Bal des Oiseaux Fantôme ?", answers: ["La fauconnerie", "La Volerie", "Aliénor et le château médiéval", "Le tournoi de chevaliers"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Pendant la saison de Noël 2026, combien de sapins illuminent le parc selon les annonces ?", answers: ["Moins de 100", "Environ 500", "Plus de 1 000", "Plus de 5 000"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Combien d'étoiles a l'hôtel Le Grand Siècle ?", answers: ["3 étoiles", "4 étoiles", "5 étoiles", "Sans étoile"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Comment s'appelle le café du Bourg Bérard, nouveauté 2025 ?", answers: ["Chez Mado", "Chez Josette", "Chez Marcelle", "Chez Suzanne"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Le Puy du Fou est-il ouvert toute l'année ?", answers: ["Oui, toute l'année", "Non, uniquement d'avril à novembre + Noël 2026", "Uniquement l'été", "Uniquement le week-end"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Comment se nomment les bénévoles de la Cinéscénie ?", answers: ["Les Vendéens", "Les Puyfolais", "Les Mousquetaires", "Les Compagnons"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Quel spectacle nocturne du Puy du Fou est le plus ancien ?", answers: ["Les Noces de Feu", "La Cinéscénie", "Le Premier Royaume", "La Renaissance du Château"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Combien de visiteurs Puy du Fou España (Tolède) a-t-il accueillis en 2025 ?", answers: ["500 000", "1,2 million", "1,7 million", "3 millions"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Dans quelle ville se trouve le Puy du Fou España ?", answers: ["Madrid", "Tolède", "Séville", "Valence"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Dans quelle ville chinoise le Puy du Fou présente-t-il des spectacles ?", answers: ["Pékin", "Shanghai", "Shenzhen", "Hong Kong"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Que peut-on déguster désormais à L'Atrium, restaurant de la Villa Gallo-Romaine ?", answers: ["Des sushis", "Des pizzas napolitaines", "Des burgers", "De la cuisine vendéenne"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Quel acteur célèbre joue le rôle de Charette dans Le Dernier Panache ?", answers: ["Un acteur connu", "Un acteur du Puy du Fou", "Personne, c'est de la projection", "Un cascadeur uniquement"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Le Puy du Fou possède-t-il une école pour former ses jeunes acteurs ?", answers: ["Oui, la Puy du Fou Académie", "Non", "Oui, mais seulement pour les chevaux", "Oui, mais pour les artisans uniquement"], correct: 0, difficulty: "facile", points: 60 },
  { text: "Combien d'artisans d'art peut-on observer dans les villages d'époque ?", answers: ["5", "18", "30", "50"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Le tarif d'entrée d'une journée comprend-il l'accès à tous les spectacles du parc ?", answers: ["Oui, sauf la Cinéscénie", "Non, chaque spectacle a un supplément", "Oui, tous sans exception", "Non, seulement 3 spectacles inclus"], correct: 0, difficulty: "facile", points: 60 },
  { text: "Comment s'appelle le pass premium qui offre un placement préférentiel ?", answers: ["Pass VIP", "Pass Émotion", "Pass Royal", "Pass Légende"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Combien de temps avant son ouverture peut-on réserver les billets 2026 du Puy du Fou ?", answers: ["2 semaines avant", "1 mois avant", "Plusieurs mois avant", "Le jour même seulement"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Le Puy du Fou prépare-t-il une tournée de spectacles dans les Zénith ?", answers: ["Non, jamais", "Oui, en 2027", "Oui, déjà en cours", "Uniquement en Vendée"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Quel pays accueille un projet futur du Puy du Fou ?", answers: ["L'Allemagne", "Le Royaume-Uni", "La Russie", "L'Australie"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Quelle saison ouvre traditionnellement le Puy du Fou chaque année ?", answers: ["Janvier", "Avril", "Juin", "Septembre"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Quel mois marque traditionnellement la fin de la saison classique du Puy du Fou ?", answers: ["Septembre", "Octobre", "Novembre", "Décembre"], correct: 2, difficulty: "facile", points: 60 },
  { text: "En 2027, le Puy du Fou fêtera son anniversaire. Combien d'années aura-t-il ?", answers: ["25 ans", "40 ans", "50 ans", "60 ans"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Comment se nomme la course nocturne organisée chaque saison au Puy du Fou ?", answers: ["Le Marathon de Vendée", "La Foulée des Géants", "La Course des Mousquetaires", "Le Trail du Roi Arthur"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Combien de représentations quotidiennes maximum L'Épée du Roi Arthur peut-il assurer ?", answers: ["3", "5", "8", "12"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Quelle est la durée du spectacle L'Épée du Roi Arthur ?", answers: ["15 min", "25 min", "40 min", "1 heure"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Quelle est la superficie de la scène de L'Épée du Roi Arthur ?", answers: ["1 000 m²", "1 800 m²", "2 500 m²", "4 000 m²"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Quel compositeur a créé la musique de plusieurs grands spectacles du Puy du Fou comme Le Mime et l'Étoile ?", answers: ["Alexandre Desplat", "Nathan Stornetta", "Maurice Jarre", "Vladimir Cosma"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Quel spectacle a reçu le prix « Meilleure Création Européenne » aux Parksmania Awards 2025 ?", answers: ["Le Mime et l'Étoile", "Les Noces de Feu", "L'Épée du Roi Arthur", "Le Mystère de la Pérouse"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Quel spectacle se déroule sur les ruines du premier château du Puy du Fou ?", answers: ["La Cinéscénie", "Le Bal des Oiseaux Fantôme", "Le Premier Royaume", "Le Dernier Panache"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Combien de temps faut-il généralement pour entraîner un cheval avant qu'il monte sur scène au Puy du Fou ?", answers: ["Quelques mois", "1 an", "2 à 4 ans", "Plus de 10 ans"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Combien de jeunes acteurs forment chaque année la troupe de la Puy du Fou Académie ?", answers: ["10 à 20", "30 à 40", "Près de 100", "Plus de 300"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Le spectacle Les Vikings dure environ combien de minutes ?", answers: ["15 min", "20 min", "30 min", "45 min"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Combien de places offre l'arène de Le Signe du Triomphe ?", answers: ["3 500", "5 500", "7 000", "10 000"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Le spectacle Les Noces de Feu se déroule sur quel élément ?", answers: ["Le sol", "Sur scène intérieure", "Sur un lac", "Dans une arène"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Quelle saison le Puy du Fou propose-t-il du nouveau spectacle « La Frairie de la Toussaint » ?", answers: ["Été", "Automne", "Printemps", "Hiver"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Quel hôtel du Puy du Fou est inspiré de la Renaissance italienne ?", answers: ["La Villa Gallo-Romaine", "Le Camp du Drap d'Or", "La Citadelle", "Les Iles de Clovis"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Quel hôtel évoque l'époque mérovingienne et Clovis ?", answers: ["Les Iles de Clovis", "Le Logis de Lescure", "La Villa Gallo-Romaine", "La Citadelle"], correct: 0, difficulty: "moyen", points: 100 },
  { text: "À quelle époque historique est consacré l'hôtel La Citadelle ?", answers: ["L'Antiquité", "Le Moyen Âge", "La Renaissance", "La Belle Époque"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Combien de spectacles sont joués lors de la saison de Noël 2026 ?", answers: ["Aucun", "Un seul nouveau", "Le nouveau spectacle + des spectacles emblématiques", "Tous les spectacles habituels"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Quel spectacle évoque les guerres de religion sous Henri IV ?", answers: ["Le Bal des Oiseaux Fantôme", "Le Secret de la Lance", "Le Premier Royaume", "Aucun directement"], correct: 3, difficulty: "moyen", points: 100 },
  { text: "Combien de spectateurs peuvent assister chaque jour au Puy du Fou en cumulé sur tous les spectacles ?", answers: ["10 000", "30 000", "Plus de 60 000", "Plus de 200 000"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Quelle est la durée approximative de la Cinéscénie ?", answers: ["1 heure", "1h30", "Près de 2 heures", "3 heures"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Quel spectacle utilise une véritable galère romaine flottante ?", answers: ["Le Premier Royaume", "Le Signe du Triomphe", "Les Vikings", "Le Mystère de la Pérouse"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "En quelle année le spectacle Les Vikings a-t-il été créé ?", answers: ["2001", "2003", "2007", "2011"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Combien d'acteurs jouent dans Le Mystère de Noël (Noël 2026) ?", answers: ["50", "80", "120", "250"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Quel spectacle nocturne fut le tout premier créé après la Cinéscénie ?", answers: ["Les Noces de Feu", "Les Orgues de Feu", "Le Premier Royaume", "La Renaissance du Château"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Quel investissement a fait le Puy du Fou en 2020 pour Les Noces de Feu, Le Grand Siècle et Le Théâtre Molière ?", answers: ["12 millions €", "30 millions €", "52 millions €", "100 millions €"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Le Théâtre Molière du Puy du Fou est utilisé pour quoi en dehors des spectacles ?", answers: ["Cours de théâtre", "Palais des Congrès", "Cinéma", "Boîte de nuit"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Quelle attraction nature reprend les fables avec un thème littéraire ?", answers: ["Le Monde Imaginaire de La Fontaine", "La Vallée Fleurie", "Les Fées de la Forêt", "La Roseraie Royale"], correct: 0, difficulty: "moyen", points: 100 },
  { text: "En quelle année Le Premier Royaume a-t-il été créé ?", answers: ["2015", "2017", "2019", "2021"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "En quelle année Le Mystère de la Pérouse a-t-il ouvert ?", answers: ["2015", "2018", "2020", "2022"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Quelle attraction immersive plonge le visiteur dans le Verdun de 1916 ?", answers: ["Le Premier Royaume", "Le Mystère de la Pérouse", "Les Amoureux de Verdun", "Le Bal des Oiseaux Fantôme"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "De quel type est la nouvelle bande son des Mousquetaires de Richelieu en 2026 ?", answers: ["Une compilation", "Une nouvelle composition originale", "Une reprise classique", "Aucun changement"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Le Pass Émotion est-il toujours obligatoire pour entrer dans le parc ?", answers: ["Oui", "Non, c'est un supplément", "Uniquement le week-end", "Uniquement pendant Noël"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Combien de m² fait l'espace scénique total du Mime et l'Étoile (salle + coulisses) ?", answers: ["2 000 m²", "4 000 m²", "Plus de 6 000 m²", "Plus de 10 000 m²"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Quel spectacle est sorti gagnant du concours « Meilleur Spectacle du Monde » selon le parc ?", answers: ["La Cinéscénie", "Les Vikings", "Le Mime et l'Étoile", "Le Dernier Panache"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Quel spectacle thématique fait sortir des chevaliers en armure dans une plaine ?", answers: ["Le Bal des Oiseaux Fantôme", "Le Secret de la Lance", "Le Dernier Panache", "La Cinéscénie"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Quelle invention a permis aux tribunes du Théâtre des Géants (Dernier Panache) de tourner ?", answers: ["Des moteurs hydrauliques", "Une rotation des sièges", "Une plate-forme tournante", "Des rails circulaires"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Combien de fois par jour Le Mime et l'Étoile peut-il être joué ?", answers: ["3 fois", "5 fois", "Jusqu'à 8 fois", "Plus de 12 fois"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Avec son extension 2026, combien de chambres aura environ Le Grand Siècle au total ?", answers: ["50", "100", "Plus de 150", "Plus de 300"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Le Puy du Fou produit-il en interne ses costumes et ses décors ?", answers: ["Non, tout est sous-traité", "Oui, en interne", "Uniquement les costumes", "Uniquement les décors"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Quelle expression Nicolas de Villiers utilise-t-il pour décrire le rythme des nouveautés ?", answers: ["« Une routine annuelle »", "« Une urgence créatrice »", "« Un calendrier strict »", "« Une pause artistique »"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Quelle catégorie de prix le Puy du Fou a-t-il remportée plusieurs fois aux Thea Awards ?", answers: ["Plus belle billetterie", "Meilleur spectacle live", "Meilleur restaurant", "Meilleur site internet"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Quel est le budget annoncé pour la création de L'Épée du Roi Arthur ?", answers: ["3 millions €", "6 millions €", "10 millions €", "20 millions €"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Quelle est la masse de la machinerie en mouvement dans L'Épée du Roi Arthur ?", answers: ["10 tonnes", "25 tonnes", "Plus de 40 tonnes", "Plus de 100 tonnes"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Sur combien de m² s'étend le parc naturel du Puy du Fou ?", answers: ["20 hectares", "40 hectares", "60 hectares", "100 hectares"], correct: 2, difficulty: "dur", points: 150 },
  { text: "En quelle année le Puy du Fou a-t-il franchi pour la première fois la barre des 2 millions de visiteurs ?", answers: ["2015", "2017", "2019", "2022"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Combien d'années séparent la création de la Cinéscénie de l'ouverture du Grand Parc ?", answers: ["5 ans", "8 ans", "11 ans", "20 ans"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Quel spectacle représente le baptême de Clovis ?", answers: ["Le Premier Royaume", "Le Mystère de la Pérouse", "Le Signe du Triomphe", "Le Bal des Oiseaux Fantôme"], correct: 0, difficulty: "dur", points: 150 },
  { text: "Combien de techniciens accompagnent en permanence La Cinéscénie ?", answers: ["Une cinquantaine", "Une centaine", "Plus de 200", "Plus de 500"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Combien de cavaliers participent à la Cinéscénie ?", answers: ["50", "80", "120", "200"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Combien de personnes assurent l'accueil et la sécurité de la Cinéscénie ?", answers: ["100", "200", "300", "500"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Combien de minutes dure environ Le Signe du Triomphe ?", answers: ["20 min", "35 min", "50 min", "1 heure"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Quel élément spectaculaire surgit du sol dans Le Secret de la Lance ?", answers: ["Une muraille", "Un château", "Une cathédrale", "Un drakkar"], correct: 0, difficulty: "dur", points: 150 },
  { text: "Quelle distance parcourt Tristan dans la quête principale de L'Épée du Roi Arthur ?", answers: ["Le château uniquement", "Plusieurs salles successives", "Une grande forêt", "Une cathédrale"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Combien de jours consécutifs maximum la Cinéscénie est-elle jouée chaque saison ?", answers: ["10 jours", "20 jours", "Une trentaine", "Plus de 50"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Quelle distinction Le Mime et l'Étoile a-t-il reçue lors de sa première saison ?", answers: ["Aucune", "Plusieurs récompenses internationales", "Le César du meilleur spectacle", "Le prix Molière"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Quel hôtel du Puy du Fou s'inspire d'une cité gallo-romaine ?", answers: ["La Citadelle", "Le Logis de Lescure", "La Villa Gallo-Romaine", "Le Camp du Drap d'Or"], correct: 2, difficulty: "dur", points: 150 },
  { text: "En quelle année La Villa Gallo-Romaine a-t-elle été agrandie de 100 chambres ?", answers: ["2022", "2023", "2025", "2026"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Quel ancien spectacle nocturne se jouait sur le pont du Bourg Bérard ?", answers: ["Le Bal des Sapeurs", "Le Ballet des Sapeurs", "La Parade des Pompiers", "La Marche des Pompiers"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Comment s'appelle le grand carillon situé près du restaurant L'Auberge ?", answers: ["Le Carillon des Rois", "Le Grand Carillon", "Le Carillon de Saint-Hugues", "Le Carillon des Cloches"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Quelle a été la nouveauté principale du Grand Parc en 2017 ?", answers: ["Le Bal des Oiseaux Fantôme", "Le Grand Carillon et Le Ballet des Sapeurs", "Les Noces de Feu", "Le Mime et l'Étoile"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Quel spectacle a inauguré la saison 2018 ?", answers: ["Le Premier Royaume", "Le Mystère de la Pérouse", "Le Mime et l'Étoile", "Les Amoureux de Verdun"], correct: 1, difficulty: "dur", points: 150 },
  { text: "En quelle année Les Amoureux de Verdun ont-ils été inaugurés ?", answers: ["2014", "2016", "2018", "2022"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Combien de personnes la troupe permanente du Puy du Fou compte-t-elle approximativement ?", answers: ["Quelques dizaines", "Quelques centaines", "Plus de 1 000", "Plus de 5 000"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Combien de mètres carrés couvre le Grand Carrousel des Mousquetaires de Richelieu ?", answers: ["1 500 m²", "3 000 m²", "6 000 m²", "10 000 m²"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Quelle hauteur peut atteindre le rideau de scène du Grand Carrousel ?", answers: ["6 m", "8 m", "13 m", "20 m"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Combien de chevaux sont mobilisés au plus fort des Mousquetaires de Richelieu ?", answers: ["10", "20", "Plus de 30", "Plus de 60"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Quels sont les deux nouveaux points de vente souvenirs annoncés en 2026 ?", answers: ["La Boutique du Roi et le Magasin", "La Chaumine de Maupillier et la Salle des Gardes", "Le Cellier du Cardinal et la Forge", "Le Bourg Marchand et le Comptoir"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Quel spectacle a été refondu en 2024 avec de nouveaux mappings vidéo ?", answers: ["Les Vikings", "Le Dernier Panache", "Le Bal des Oiseaux Fantôme", "Le Signe du Triomphe"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Combien de visiteurs ont vu Le Dernier Panache depuis 2016 ?", answers: ["3 millions", "8 millions", "Plus de 14 millions", "Plus de 30 millions"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Quel élément historique est mis en avant dans la Cinéscénie depuis 2024 ?", answers: ["La libération de la France en 1944", "La bataille d'Azincourt", "Les croisades", "Le débarquement de 1944 (Provence)"], correct: 3, difficulty: "dur", points: 150 },
  { text: "Le maréchal de Lattre de Tassigny est-il évoqué dans la Cinéscénie ?", answers: ["Non, jamais", "Oui, depuis 2024", "Oui, depuis l'origine", "Uniquement de manière symbolique"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Quel spectacle inclut une scène avec Aurélien, jeune élève de la Puy du Fou Académie ?", answers: ["Le Bal des Oiseaux Fantôme", "Le Signe du Triomphe", "Les Noces de Feu", "Le Premier Royaume"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Quel élément spectaculaire est revenu dans Les Noces de Feu en 2026 ?", answers: ["Le carrousel", "Le kiosque émergeant de l'eau", "Le pont mobile", "Le château"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Combien de feux d'artifice composent le final des Noces de Feu ?", answers: ["Une dizaine", "Une centaine", "Plusieurs centaines", "Plusieurs milliers"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Combien d'acteurs et de cascadeurs subaquatiques participent aux Noces de Feu ?", answers: ["10", "20", "30", "60"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Quel mot finit la devise du Puy du Fou « L'irréel devient... » ?", answers: ["Réel", "Vivant", "Légende", "Immortel"], correct: 0, difficulty: "dur", points: 150 },
  { text: "Combien de fois la Cinéscénie a-t-elle été modernisée depuis 1978 ?", answers: ["Jamais", "Une fois", "Régulièrement", "Une dizaine de fois"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Quel hôtel du Puy du Fou évoque la Vendée du XVIIIe siècle ?", answers: ["Le Logis de Lescure", "La Citadelle", "Les Iles de Clovis", "La Villa Gallo-Romaine"], correct: 0, difficulty: "dur", points: 150 },
  { text: "Quel chef étoilé installé à Noirmoutier rejoint le Puy du Fou en 2026 ?", answers: ["Anne-Sophie Pic", "Pierre Hermé", "Alexandre Couillon", "Yannick Alléno"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Combien d'étoiles Michelin Alexandre Couillon a-t-il obtenues à Noirmoutier ?", answers: ["1 étoile", "2 étoiles", "3 étoiles", "Aucune"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Quelle particularité technologique distingue L'Épée du Roi Arthur des autres spectacles ?", answers: ["Une scène à 360°", "Une machinerie de 40+ tonnes en mouvement", "Des hologrammes uniquement", "Une scène aquatique"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Combien de représentations de la Cinéscénie ont été données depuis 1978 (ordre de grandeur) ?", answers: ["Quelques centaines", "Plus de 1 500", "Plus de 3 000", "Plus de 10 000"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "Combien de spectateurs cumulés ont vu la Cinéscénie depuis 1978 ?", answers: ["1 million", "3 millions", "Plus de 12 millions", "Plus de 30 millions"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Combien de costumes différents la Cinéscénie utilise-t-elle ?", answers: ["1 000", "8 000", "20 000", "30 000"], correct: 3, difficulty: "extreme", points: 200 },
  { text: "En quelle année exacte la dernière saison de Noël avant 2026 a-t-elle été jouée au Puy du Fou ?", answers: ["2014", "2015", "2017", "2018"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Combien de tonnes pèse au total la machinerie active de L'Épée du Roi Arthur ?", answers: ["20 tonnes", "30 tonnes", "Plus de 40 tonnes", "Plus de 100 tonnes"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Quel record mondial le rideau de scène des Mousquetaires de Richelieu détenait-il à sa création en 2006 ?", answers: ["Le plus rapide", "Le plus large", "L'un des plus grands rideaux de scène", "Le plus lourd"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Combien de fontaines actives compte le grand bassin des Noces de Feu ?", answers: ["20", "50", "Plus de 100", "Plus de 500"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Combien de mètres de hauteur peut atteindre la principale fontaine des Noces de Feu ?", answers: ["5 m", "15 m", "Plus de 30 m", "Plus de 100 m"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Combien d'oiseaux participent aux différents spectacles du Puy du Fou (toutes représentations confondues) ?", answers: ["100", "250", "Plus de 500", "Plus de 2 000"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Combien de fauconniers travaillent au Puy du Fou ?", answers: ["3", "Une dizaine", "Une vingtaine", "Plus de 50"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Combien de représentations cumulées le Puy du Fou a-t-il joué depuis sa création (ordre de grandeur) ?", answers: ["Plus de 50 000", "Plus de 250 000", "Plus de 500 000", "Plus de 1 million"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "Quel est le plus grand budget jamais investi par le Puy du Fou en une seule saison ?", answers: ["20 millions €", "52 millions €", "100 millions €", "Plus de 200 millions €"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "Combien de personnes ont visité Puy du Fou España depuis son ouverture en 2021 ?", answers: ["1 million", "Plus de 3 millions", "Plus de 5 millions", "Plus de 10 millions"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Combien de jours par an le Puy du Fou est-il ouvert en moyenne (saison classique) ?", answers: ["80 jours", "120 jours", "150 jours", "Plus de 200 jours"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Combien de salariés permanents le Puy du Fou emploie-t-il toute l'année (hors saisonniers) ?", answers: ["Une centaine", "Plus de 400", "Plus de 800", "Plus de 2 000"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "Combien d'écuries différentes compte le Puy du Fou ?", answers: ["1 grande écurie", "2 écuries", "Plusieurs écuries thématiques", "Pas d'écurie sur place"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Combien de mètres de tissu sont nécessaires pour fabriquer le rideau du Grand Carrousel ?", answers: ["Quelques dizaines", "Plus de 100 m", "Plus de 1 000 m", "Plus de 5 000 m"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "Combien d'effets spéciaux pyrotechniques sont déclenchés en moyenne lors d'une Cinéscénie ?", answers: ["Quelques dizaines", "Plus de 100", "Plus de 1 000", "Plus de 10 000"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Combien de personnages historiques sont incarnés dans la Cinéscénie ?", answers: ["Quelques-uns", "Une dizaine", "Des dizaines", "Plus de 200"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Quel est le plus ancien grand spectacle encore joué (hors Cinéscénie) du Grand Parc ?", answers: ["Les Mousquetaires de Richelieu", "Le Bal des Oiseaux Fantôme", "Le Signe du Triomphe", "Les Vikings"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "Combien d'années séparent la création du Bal des Oiseaux Fantôme et celle des Vikings ?", answers: ["3 ans", "7 ans", "12 ans", "20 ans"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Combien de mètres de profondeur a la fosse aux lions du Signe du Triomphe ?", answers: ["1 m", "2 m", "Plus de 3 m", "Plus de 10 m"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Combien de représentations annuelles du Signe du Triomphe sont prévues durant la saison 2026 ?", answers: ["Moins de 100", "Environ 200", "Plus de 300", "Plus de 1 000"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Quelle invention a réintégré la mise en scène des Mousquetaires de Richelieu en 2026 ?", answers: ["Une nouvelle bande son originale", "Un nouveau cheval", "Un nouveau costume du cardinal", "Un nouvel acteur"], correct: 0, difficulty: "extreme", points: 200 },
  { text: "Combien de fois la Cinéscénie a-t-elle interrompu sa programmation depuis 1978 ?", answers: ["Jamais", "Une fois", "Lors de la pandémie 2020", "Plusieurs fois"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Quel est le coût annoncé pour le pavillon ajouté à L'Auberge en 2026 ?", answers: ["Non communiqué", "100 000 €", "500 000 €", "Plus d'un million €"], correct: 0, difficulty: "extreme", points: 200 },
  { text: "Combien de scénaristes le Puy du Fou emploie-t-il pour ses créations ?", answers: ["Aucun, Nicolas de Villiers écrit tout", "Une équipe interne dédiée", "Des prestataires externes", "Une seule personne"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "Quel record le Puy du Fou détient-il en France pour la fréquentation cumulée d'un spectacle nocturne ?", answers: ["Aucun record", "Plus grand spectacle nocturne au monde", "Plus ancien parc à thème", "Plus grande aire de jeux"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "Quel a été le record d'affluence enregistré sur une seule journée au Puy du Fou ?", answers: ["10 000", "25 000", "Plus de 40 000", "Plus de 100 000"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Quelle est la principale source d'inspiration des spectacles du Puy du Fou ?", answers: ["L'imagination de Nicolas de Villiers", "L'Histoire de France et ses légendes", "La littérature contemporaine", "Les comics américains"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "En quelle année Philippe de Villiers a-t-il découvert les ruines du château du Puy du Fou ?", answers: ["1975", "1976", "1977", "1978"], correct: 2, difficulty: "facile", points: 60 },
  { text: "En quelle année a eu lieu la toute première représentation de la Cinéscénie ?", answers: ["1977", "1978", "1979", "1980"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Qui est le créateur du Puy du Fou ?", answers: ["Nicolas de Villiers", "Philippe de Villiers", "Jacques de Villiers", "Bertrand de Villiers"], correct: 1, difficulty: "facile", points: 60 },
  { text: "Quel était le titre original de la Cinéscénie avant qu'elle ne reçoive son nom définitif ?", answers: ["La Vendée triomphante", "Ce soir, la Vendée", "La nuit des Maupillier", "L'âme de la Vendée"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Combien de bénévoles ont participé à la toute première représentation de la Cinéscénie en 1978 ?", answers: ["Environ 100", "Environ 300", "Environ 600", "Environ 1000"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "En quelle année le « Grand Parc » du Puy du Fou a-t-il officiellement ouvert ses portes ?", answers: ["1985", "1989", "1991", "1995"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Quel était le statut professionnel de Philippe de Villiers lorsqu'il a créé la Cinéscénie ?", answers: ["Avocat", "Sous-préfet", "Médecin", "Journaliste"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Quel principe fondamental Philippe de Villiers a-t-il imposé dès la création de la Cinéscénie ?", answers: ["L'utilisation exclusive du français", "Pas de droits d'auteur pour le scénariste", "La gratuité totale", "Une seule représentation par an"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "En quelle année le Fort de l'An Mil (futur spectacle Les Vikings) a-t-il pris vie ?", answers: ["1989", "1991", "1994", "1997"], correct: 2, difficulty: "dur", points: 150 },
  { text: "En quelle année l'Académie Junior, école de formation du Puy du Fou, a-t-elle été créée ?", answers: ["1995", "1998", "2001", "2003"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "En quelle année le Stadium Gallo-Romain a-t-il été inauguré ?", answers: ["1993", "1995", "1998", "2001"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "Quel acteur célèbre a parrainé le spectacle « La Bataille du Donjon » en 1995 ?", answers: ["Jean Reno", "Gérard Depardieu", "Alain Delon", "Jean-Paul Belmondo"], correct: 2, difficulty: "dur", points: 150 },
  { text: "En quelle année le spectacle « Le Bal des Oiseaux Fantômes » a-t-il été créé ?", answers: ["1992", "1995", "2000", "2003"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Quel artiste de renom a composé une bande originale pour la Cinéscénie dans ses premières années ?", answers: ["Ennio Morricone", "Georges Delerue", "Vladimir Cosma", "Michel Legrand"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "En quelle année Nicolas de Villiers est-il devenu président du Puy du Fou ?", answers: ["1999", "2004", "2008", "2012"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Quel est le premier hôtel thématique du Puy du Fou, ouvert en 2007 ?", answers: ["Le Grand Siècle", "La Villa Gallo-Romaine", "La Citadelle", "Les Îles de Clovis"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "En quelle année le spectacle « Mousquetaire de Richelieu » dans le Grand Carrousel a-t-il été créé ?", answers: ["2002", "2006", "2010", "2013"], correct: 1, difficulty: "dur", points: 150 },
  { text: "En quelle année le Bourg 1900 a-t-il été inauguré à l'entrée du Grand Parc ?", answers: ["2001", "2003", "2006", "2009"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Qui a composé la bande originale de la nouvelle Cinéscénie révélée à la fin des années 2000 ?", answers: ["Hans Zimmer", "Nick Glennie-Smith", "John Williams", "Howard Shore"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "En quelle année le Puy du Fou a-t-il reçu le « Thea Classic Award » du Meilleur Parc du Monde ?", answers: ["2010", "2012", "2014", "2016"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Quel spectacle créé en 2016 a remporté le titre de « Meilleure Création Mondiale » ?", answers: ["Les Amoureux de Verdun", "Le Dernier Panache", "Le Premier Royaume", "Le Mime et l'Étoile"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "En quelle année le spectacle « Les Amoureux de Verdun » a-t-il été créé ?", answers: ["2013", "2015", "2017", "2019"], correct: 1, difficulty: "dur", points: 150 },
  { text: "En quelle année le spectacle « Le Mystère de La Pérouse » a-t-il été inauguré ?", answers: ["2016", "2018", "2020", "2022"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Quel est le sujet historique du spectacle « Le Premier Royaume » créé en 2019 ?", answers: ["Charlemagne", "Clovis", "Hugues Capet", "Saint-Louis"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Sur quelle expédition historique est basé le spectacle « Le Mystère de La Pérouse » ?", answers: ["L'expédition de James Cook", "L'expédition de La Pérouse autour du monde", "L'expédition de Bougainville", "L'expédition de Magellan"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Quels étaient les noms des deux frégates de l'expédition de La Pérouse ?", answers: ["La Belle et La Bonne", "La Boussole et L'Astrolabe", "L'Hermione et La Renommée", "La Méduse et La Sirène"], correct: 1, difficulty: "dur", points: 150 },
  { text: "Quel montant le Puy du Fou a-t-il investi en 2020 dans ses nouveautés malgré la pandémie ?", answers: ["15 millions €", "32 millions €", "52 millions €", "75 millions €"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "En quelle année le spectacle nocturne « Les Noces de Feu » a-t-il été créé ?", answers: ["2018", "2019", "2020", "2022"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "En quelle année « Le Monde Imaginaire de La Fontaine » a-t-il été revisité avec de nouvelles fables ?", answers: ["2019", "2020", "2021", "2023"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "En quelle année le spectacle « Le Signe du Triomphe » a-t-il reçu un nouveau final ?", answers: ["2020", "2022", "2024", "2025"], correct: 1, difficulty: "dur", points: 150 },
  { text: "En quelle année le spectacle « Le Mime et l'Étoile » a-t-il été lancé ?", answers: ["2021", "2022", "2023", "2024"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Quel est le budget de production du spectacle « Le Mime et l'Étoile » ?", answers: ["Plus de 5 millions €", "Plus de 10 millions €", "Plus de 20 millions €", "Plus de 50 millions €"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Combien de tonnes pèse la machinerie spectaculaire du « Mime et l'Étoile » ?", answers: ["20 tonnes", "50 tonnes", "80 tonnes", "Plus de 140 tonnes"], correct: 3, difficulty: "extreme", points: 200 },
  { text: "En 2024, quel titre prestigieux « Le Mime et l'Étoile » a-t-il reçu à Los Angeles ?", answers: ["Spectacle de l'année", "Meilleur Spectacle du Monde", "Innovation technologique", "Prix du public"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "À quelle époque historique se déroule l'action du « Mime et l'Étoile » ?", answers: ["Années 1880", "Années 1910-1920", "Années 1930-1940", "Années 1950"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Quel spectacle a remplacé « Les Chevaliers de la Table Ronde » en 2025 ?", answers: ["Le Roi du Monde", "Excalibur", "L'Épée du Roi Arthur", "Camelot"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Quel est le nom du jeune héros du spectacle « L'Épée du Roi Arthur » ?", answers: ["Lancelot", "Galahad", "Tristan", "Perceval"], correct: 2, difficulty: "moyen", points: 100 },
  { text: "Quelle est la superficie de l'espace scénique du spectacle « L'Épée du Roi Arthur » ?", answers: ["500 m²", "1500 m²", "2500 m²", "5000 m²"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Quel est le nom de la famille de paysans dont l'histoire est racontée dans la Cinéscénie ?", answers: ["Les Maupillier", "Les Charette", "Les Cathelineau", "Les La Rochejaquelein"], correct: 0, difficulty: "facile", points: 60 },
  { text: "Quel est le prénom du héros principal de la Cinéscénie ?", answers: ["Jean-Baptiste", "Jacques-Louis", "Pierre-Marie", "François-Henri"], correct: 1, difficulty: "dur", points: 150 },
  { text: "De quelle période à quelle période s'étend l'histoire racontée par la Cinéscénie ?", answers: ["Antiquité au XVIIIe siècle", "Moyen Âge à la Seconde Guerre mondiale", "Préhistoire à la Renaissance", "Moyen Âge au XIXe siècle"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Combien de visiteurs annuels le Puy du Fou accueille-t-il aujourd'hui environ ?", answers: ["500 000", "1 million", "Plus de 2,5 millions", "Plus de 5 millions"], correct: 2, difficulty: "facile", points: 60 },
  { text: "Selon le site officiel, en quelle ville la première Cinéscénie a-t-elle été représentée ?", answers: ["Cholet", "Les Sables-d'Olonne", "Les Epesses", "La Roche-sur-Yon"], correct: 2, difficulty: "dur", points: 150 },
  { text: "En quelle année le Puy du Fou a-t-il reçu un Hall of Fame Award à Orlando ?", answers: ["2014", "2015", "2017", "2019"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Combien d'élèves environ accueille l'Académie Junior du Puy du Fou ?", answers: ["100", "300", "600", "1000"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Comment surnomme-t-on les bénévoles qui participent à la Cinéscénie ?", answers: ["Les Puyfolais", "Les Vendéens", "Les Maupilliers", "Les Templiers"], correct: 0, difficulty: "facile", points: 60 },
  { text: "Aujourd'hui, combien de Puyfolais bénévoles participent à la Cinéscénie ?", answers: ["Environ 500", "Environ 1500", "Environ 2 550", "Environ 5000"], correct: 2, difficulty: "dur", points: 150 },
  { text: "Quelle est la superficie totale du parc du Puy du Fou ?", answers: ["100 hectares", "250 hectares", "Environ 500 hectares", "Plus de 1000 hectares"], correct: 2, difficulty: "extreme", points: 200 },
  { text: "Quel système le Puy du Fou propose-t-il pour aider les visiteurs à organiser leur journée ?", answers: ["Un guide papier", "Un moteur de visite", "Des conseillers à l'entrée", "Rien de spécifique"], correct: 1, difficulty: "dur", points: 150 },
  { text: "En moyenne, combien de jours les familles passent-elles au Puy du Fou ?", answers: ["1 jour", "1,7 jour", "2,5 jours", "Plus de 3 jours"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "Quel principe économique le Grand Parc a-t-il adopté dès 1989 ?", answers: ["Subventions publiques", "Indépendance économique (aucune aide extérieure)", "Crowdfunding", "Sponsoring exclusif"], correct: 1, difficulty: "extreme", points: 200 },
  { text: "À quelle fréquence le Puy du Fou lance-t-il généralement un nouveau spectacle majeur ?", answers: ["Tous les ans", "Tous les 2 ans", "Tous les 5 ans", "Tous les 10 ans"], correct: 1, difficulty: "moyen", points: 100 },
  { text: "Quel pourcentage des visiteurs reviennent au Puy du Fou dans un délai maximum de 5 ans ?", answers: ["25 %", "50 %", "74 %", "Plus de 90 %"], correct: 2, difficulty: "extreme", points: 200 },
];

// ----------------------------------------------------------------
// Tirage de quiz Puy du Fou (15 questions par défaut)
// ----------------------------------------------------------------
export function tirerQuizPuy(nb = 15, difficulteFiltre = null) {
  let banque = QUESTIONS_PUY;
  if (difficulteFiltre) {
    banque = banque.filter(q => q.difficulty === difficulteFiltre);
  }
  const copie = [...banque];
  // Fisher-Yates
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie.slice(0, Math.min(nb, copie.length));
}

// Format temps
export function formatTempsPuy(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
