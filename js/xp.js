// ============================================================
// xp.js — Système d'XP, rangs, badges, streak
// ------------------------------------------------------------
// Tout ce qui touche à la progression du joueur est ici.
// Les autres modules importent juste les fonctions dont ils
// ont besoin.
// ============================================================

// ----------------------------------------------------------------
// CALCUL DE L'XP GAGNÉE PENDANT UN QUIZ
// ----------------------------------------------------------------
//
// Formule :
//   XP totale = (10 XP × bonnes réponses × multiplicateur difficulté)
//              + bonus temps (si rapide)
//              + bonus de fin (selon le pourcentage)
//
// Exemples :
//   - Quiz expert (×2), 8/10 bonnes, temps rapide → 8*10*2 + 30 + 50 = 240 XP
//   - Quiz débutant (×1), 5/10, temps moyen      → 5*10*1 + 0 + 0  = 50 XP
//
export const MULT_DIFFICULTE = {
  debutant: 1,
  intermediaire: 1.5,
  expert: 2
};

export function calculerXp({ niveau, score, total, tempsSec }) {
  const mult = MULT_DIFFICULTE[niveau] || 1;
  const baseXp = Math.round(10 * score * mult);

  // Bonus temps : si le joueur fait moins de 8 secondes par question
  // en moyenne, il gagne un bonus rapidité
  const tempsParQuestion = tempsSec / total;
  let bonusTemps = 0;
  if (tempsParQuestion < 5) bonusTemps = 50;        // Très rapide
  else if (tempsParQuestion < 8) bonusTemps = 30;   // Rapide
  else if (tempsParQuestion < 12) bonusTemps = 10;  // Correct

  // Bonus de fin selon le pourcentage de réussite
  const pct = (score / total) * 100;
  let bonusFin = 0;
  if (pct === 100) bonusFin = 100;       // Sans-faute
  else if (pct >= 80) bonusFin = 50;     // Excellent
  else if (pct >= 60) bonusFin = 20;     // Bien

  return {
    base: baseXp,
    bonusTemps,
    bonusFin,
    total: baseXp + bonusTemps + bonusFin
  };
}

// ----------------------------------------------------------------
// LES 30 RANGS — du débutant à la légende
// ----------------------------------------------------------------
// Chaque rang : { niveau, nom, xpRequis, emoji, couleur }
// xpRequis = XP cumulée pour atteindre ce niveau
//
// Courbe : on commence facile (100 XP/niveau), ça monte progressivement
// pour que les hauts niveaux soient un vrai accomplissement.
//
export const RANGS = [
  { niveau: 1,  nom: "Ramasseur de balles",     xpRequis: 0,     emoji: "🧒", couleur: "#94a3b8" },
  { niveau: 2,  nom: "Apprenti",                xpRequis: 100,   emoji: "👶", couleur: "#94a3b8" },
  { niveau: 3,  nom: "Débutant motivé",         xpRequis: 250,   emoji: "🌱", couleur: "#86efac" },
  { niveau: 4,  nom: "Joueur du dimanche",      xpRequis: 450,   emoji: "🏐", couleur: "#86efac" },
  { niveau: 5,  nom: "Régulier du club",        xpRequis: 700,   emoji: "👕", couleur: "#86efac" },
  { niveau: 6,  nom: "Réceptionneur",           xpRequis: 1000,  emoji: "🙌", couleur: "#60a5fa" },
  { niveau: 7,  nom: "Passeur en herbe",        xpRequis: 1350,  emoji: "🤲", couleur: "#60a5fa" },
  { niveau: 8,  nom: "Libéro confirmé",         xpRequis: 1750,  emoji: "🛡️", couleur: "#60a5fa" },
  { niveau: 9,  nom: "Central solide",          xpRequis: 2200,  emoji: "💪", couleur: "#60a5fa" },
  { niveau: 10, nom: "Attaquant régional",      xpRequis: 2700,  emoji: "🔥", couleur: "#fb923c" },
  { niveau: 11, nom: "Smasheur",                xpRequis: 3250,  emoji: "💥", couleur: "#fb923c" },
  { niveau: 12, nom: "Capitaine d'équipe",      xpRequis: 3850,  emoji: "©", couleur: "#fb923c" },
  { niveau: 13, nom: "Stratège",                xpRequis: 4500,  emoji: "🧠", couleur: "#fb923c" },
  { niveau: 14, nom: "Tueur du filet",          xpRequis: 5200,  emoji: "🎯", couleur: "#fb923c" },
  { niveau: 15, nom: "Pointu redoutable",       xpRequis: 5950,  emoji: "⚡", couleur: "#f97316" },
  { niveau: 16, nom: "Champion départemental",  xpRequis: 6750,  emoji: "🥉", couleur: "#f97316" },
  { niveau: 17, nom: "Champion régional",       xpRequis: 7600,  emoji: "🥈", couleur: "#f97316" },
  { niveau: 18, nom: "Joueur Pro B",            xpRequis: 8500,  emoji: "🏅", couleur: "#f97316" },
  { niveau: 19, nom: "Joueur Pro A",            xpRequis: 9450,  emoji: "🏆", couleur: "#facc15" },
  { niveau: 20, nom: "International Espoir",    xpRequis: 10500, emoji: "🌟", couleur: "#facc15" },
  { niveau: 21, nom: "Maître du contre",        xpRequis: 11700, emoji: "🚫", couleur: "#facc15" },
  { niveau: 22, nom: "Maître du service",       xpRequis: 13000, emoji: "🎾", couleur: "#facc15" },
  { niveau: 23, nom: "Vétéran du parquet",      xpRequis: 14400, emoji: "🎖️", couleur: "#facc15" },
  { niveau: 24, nom: "International A",         xpRequis: 15900, emoji: "🇫🇷", couleur: "#a78bfa" },
  { niveau: 25, nom: "Médaillé olympique",      xpRequis: 17500, emoji: "🥇", couleur: "#a78bfa" },
  { niveau: 26, nom: "Champion du monde",       xpRequis: 19300, emoji: "🌍", couleur: "#a78bfa" },
  { niveau: 27, nom: "Star de la VNL",          xpRequis: 21300, emoji: "✨", couleur: "#c084fc" },
  { niveau: 28, nom: "MVP de finale",           xpRequis: 23500, emoji: "👑", couleur: "#c084fc" },
  { niveau: 29, nom: "Hall of Fame",            xpRequis: 26000, emoji: "🏛️", couleur: "#e879f9" },
  { niveau: 30, nom: "Légende du volley",       xpRequis: 30000, emoji: "🐐", couleur: "#ec4899" }
];

// XP_MAX correspond au plafond du niveau 30
export const XP_MAX = RANGS[RANGS.length - 1].xpRequis;

// Trouve le rang correspondant à une XP donnée
export function getRang(xp) {
  for (let i = RANGS.length - 1; i >= 0; i--) {
    if (xp >= RANGS[i].xpRequis) return RANGS[i];
  }
  return RANGS[0];
}

// Calcule la progression vers le niveau suivant : { rang, prochain, xpDansNiveau, xpTotalNiveau, pourcentage }
export function getProgression(xp) {
  const rang = getRang(xp);
  const prochain = RANGS.find((r) => r.niveau === rang.niveau + 1);
  if (!prochain) {
    // Niveau max atteint
    return { rang, prochain: null, xpDansNiveau: 0, xpTotalNiveau: 0, pourcentage: 100 };
  }
  const xpDansNiveau = xp - rang.xpRequis;
  const xpTotalNiveau = prochain.xpRequis - rang.xpRequis;
  const pourcentage = Math.min(100, Math.round((xpDansNiveau / xpTotalNiveau) * 100));
  return { rang, prochain, xpDansNiveau, xpTotalNiveau, pourcentage };
}

// ----------------------------------------------------------------
// BADGES — succès débloquables
// ----------------------------------------------------------------
// Chaque badge a une condition vérifiée après chaque quiz.
// Le badge est validé une seule fois (puis stocké dans Firestore).
//
export const BADGES = [
  {
    id: "premier_pas",
    nom: "Premier pas",
    desc: "Terminer ton premier quiz",
    emoji: "🎯",
    test: (stats) => stats.quizTermines >= 1
  },
  {
    id: "serial_quizzer",
    nom: "Serial quizzer",
    desc: "Terminer 10 quiz",
    emoji: "📚",
    test: (stats) => stats.quizTermines >= 10
  },
  {
    id: "marathonien",
    nom: "Marathonien",
    desc: "Terminer 50 quiz",
    emoji: "🏃",
    test: (stats) => stats.quizTermines >= 50
  },
  {
    id: "sans_faute",
    nom: "Sans-faute",
    desc: "Obtenir 100% à un quiz",
    emoji: "💯",
    test: (stats, last) => last && last.score === last.total
  },
  {
    id: "expert_parfait",
    nom: "Expert parfait",
    desc: "100% au niveau Expert",
    emoji: "🏆",
    test: (stats, last) => last && last.niveau === "expert" && last.score === last.total
  },
  {
    id: "rapide_eclair",
    nom: "Éclair",
    desc: "Finir un quiz en moins d'une minute",
    emoji: "⚡",
    test: (stats, last) => last && last.tempsSec < 60 && last.score >= 7
  },
  {
    id: "centurion",
    nom: "Centurion",
    desc: "Cumuler 100 bonnes réponses",
    emoji: "💯",
    test: (stats) => stats.bonnesReponsesTotal >= 100
  },
  {
    id: "millionnaire",
    nom: "Mille bornes",
    desc: "Cumuler 1000 bonnes réponses",
    emoji: "🎖️",
    test: (stats) => stats.bonnesReponsesTotal >= 1000
  },
  {
    id: "niveau_10",
    nom: "Pied dans la cour des grands",
    desc: "Atteindre le niveau 10",
    emoji: "🔟",
    test: (stats) => stats.xp >= 2700
  },
  {
    id: "niveau_20",
    nom: "Joueur d'élite",
    desc: "Atteindre le niveau 20",
    emoji: "⭐",
    test: (stats) => stats.xp >= 10500
  },
  {
    id: "legende",
    nom: "Légende",
    desc: "Atteindre le niveau 30",
    emoji: "🐐",
    test: (stats) => stats.xp >= 30000
  },
  {
    id: "explorer",
    nom: "Explorateur",
    desc: "Découvrir un secret caché",
    emoji: "🔍",
    test: (stats) => Object.keys(stats.easterEggs || {}).length >= 1
  },
  {
    id: "streak_3",
    nom: "Régulier",
    desc: "3 jours consécutifs de jeu",
    emoji: "🔥",
    test: (stats) => (stats.streak || 0) >= 3
  },
  {
    id: "streak_7",
    nom: "Sur la lancée",
    desc: "7 jours consécutifs de jeu",
    emoji: "🔥🔥",
    test: (stats) => (stats.streak || 0) >= 7
  },
  {
    id: "streak_30",
    nom: "Inarrêtable",
    desc: "30 jours consécutifs de jeu",
    emoji: "🔥🔥🔥",
    test: (stats) => (stats.streak || 0) >= 30
  }
];

// Renvoie les nouveaux badges débloqués (pas encore présents dans stats.badges)
export function detecterNouveauxBadges(stats, dernierQuiz) {
  const dejaObtenus = new Set(Object.keys(stats.badges || {}));
  return BADGES.filter((b) => !dejaObtenus.has(b.id) && b.test(stats, dernierQuiz));
}

// ----------------------------------------------------------------
// STREAK — Gestion des jours consécutifs
// ----------------------------------------------------------------
//
// On stocke `derniereDateJeu` (au format "YYYY-MM-DD" UTC) et `streak`.
// Règles :
//   - Même jour : pas de changement
//   - Jour suivant : streak +1
//   - Plus de 1 jour de différence : streak revient à 1
//
export function calculerNouveauStreak(streakActuel, derniereDate) {
  const aujourdHui = new Date().toISOString().slice(0, 10);
  if (!derniereDate) {
    // Première partie de la vie du compte
    return { nouveauStreak: 1, nouvelleDate: aujourdHui, change: true };
  }
  if (derniereDate === aujourdHui) {
    // Déjà joué aujourd'hui : on garde
    return { nouveauStreak: streakActuel || 1, nouvelleDate: derniereDate, change: false };
  }
  // Comparaison des jours
  const hier = new Date();
  hier.setDate(hier.getDate() - 1);
  const hierStr = hier.toISOString().slice(0, 10);
  if (derniereDate === hierStr) {
    return { nouveauStreak: (streakActuel || 0) + 1, nouvelleDate: aujourdHui, change: true };
  }
  // Trop de jours d'écart : reset
  return { nouveauStreak: 1, nouvelleDate: aujourdHui, change: true };
}
