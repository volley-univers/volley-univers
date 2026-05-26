// ============================================================
// storage.js — Lecture / écriture des données utilisateur
// ------------------------------------------------------------
// Tout passe par le document /users/{uid} dans Firestore.
// Si l'utilisateur n'est pas connecté, on retombe sur localStorage
// pour ne pas perdre la progression invité.
// ============================================================

import { auth, db, firebaseConfigured } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  calculerXp,
  detecterNouveauxBadges,
  calculerNouveauStreak,
  getRang
} from "./xp.js";

const LS_KEY = "volley_invite_v1";

// --- Helpers localStorage (mode invité) ---
function lireInvite() {
  try {
    const data = JSON.parse(localStorage.getItem(LS_KEY));
    if (!data) return defautInvite();
    // Compatibilité ascendante : ajoute les nouveaux champs s'ils manquent
    return {
      ...defautInvite(),
      ...data,
      progression: { ...defautInvite().progression, ...(data.progression || {}) },
      badges: data.badges || {},
      streak: data.streak || 0,
      xp: data.xp || 0
    };
  } catch {
    return defautInvite();
  }
}
function ecrireInvite(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}
function defautInvite() {
  return {
    pseudo: "Invité",
    xp: 0,
    streak: 0,
    derniereDateJeu: null,
    progression: {
      scoreMax: 0,
      quizTermines: 0,
      tempsMoyenSec: 0,
      bonnesReponsesTotal: 0,
      questionsRepondues: 0
    },
    badges: {},
    easterEggs: {}
  };
}

// --- Récupère les données du joueur (connecté ou invité) ---
export async function getDonnees() {
  const user = auth.currentUser;
  if (!firebaseConfigured || !user) return lireInvite();

  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) return defautInvite();
  const data = snap.data();
  return {
    pseudo: data.pseudo || "Joueur",
    email: data.email || "",
    xp: data.xp || 0,
    streak: data.streak || 0,
    derniereDateJeu: data.derniereDateJeu || null,
    progression: { ...defautInvite().progression, ...(data.progression || {}) },
    badges: data.badges || {},
    easterEggs: data.easterEggs || {}
  };
}

// --- Met à jour la progression après un quiz ---
// Renvoie un objet riche pour que l'UI puisse afficher toutes les animations
export async function enregistrerResultatQuiz(scoreObj) {
  const { score, total, tempsSec, niveau } = scoreObj;
  const user = auth.currentUser;

  // === Récupération des données actuelles ===
  const data = await getDonnees();
  const p = data.progression;
  const ancienXp = data.xp || 0;
  const ancienRang = getRang(ancienXp);

  // === Calcul de l'XP gagnée ===
  const xpDetail = calculerXp({ niveau, score, total, tempsSec });
  const nouvelXp = ancienXp + xpDetail.total;
  const nouveauRang = getRang(nouvelXp);
  const niveauUp = nouveauRang.niveau > ancienRang.niveau;

  // === Mise à jour de la progression ===
  const nouvNb = p.quizTermines + 1;
  const nouvTempsMoyen = Math.round(
    (p.tempsMoyenSec * p.quizTermines + tempsSec) / nouvNb
  );
  const nouvelleProgression = {
    scoreMax: Math.max(p.scoreMax, Math.round((score / total) * 100)),
    quizTermines: nouvNb,
    tempsMoyenSec: nouvTempsMoyen,
    bonnesReponsesTotal: p.bonnesReponsesTotal + score,
    questionsRepondues: p.questionsRepondues + total
  };

  // === Mise à jour du streak ===
  const streakInfo = calculerNouveauStreak(data.streak, data.derniereDateJeu);

  // === Détection des nouveaux badges ===
  const dataProjettee = {
    ...data,
    xp: nouvelXp,
    streak: streakInfo.nouveauStreak,
    progression: nouvelleProgression,
    badges: data.badges
  };
  const nouveauxBadges = detecterNouveauxBadges(dataProjettee, {
    niveau, score, total, tempsSec
  });

  const dateIso = new Date().toISOString();
  const badgesFinaux = { ...(data.badges || {}) };
  for (const b of nouveauxBadges) badgesFinaux[b.id] = dateIso;

  // === Sauvegarde ===
  const updateData = {
    xp: nouvelXp,
    streak: streakInfo.nouveauStreak,
    derniereDateJeu: streakInfo.nouvelleDate,
    progression: nouvelleProgression,
    badges: badgesFinaux
  };

  if (!firebaseConfigured || !user) {
    ecrireInvite({ ...data, ...updateData });
  } else {
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, updateData);

    // Document leaderboard (lisible par tous, modifiable que par soi)
    try {
      await setDoc(doc(db, "leaderboard", user.uid), {
        pseudo: data.pseudo || user.displayName || "Joueur",
        xp: nouvelXp,
        niveau: nouveauRang.niveau,
        rangNom: nouveauRang.nom,
        quizTermines: nouvNb,
        derniereActivite: serverTimestamp()
      });
    } catch (err) {
      console.warn("Leaderboard non mis à jour :", err);
    }
  }

  return {
    progression: nouvelleProgression,
    xp: nouvelXp,
    xpGagnee: xpDetail,
    ancienRang,
    nouveauRang,
    niveauUp,
    streak: streakInfo.nouveauStreak,
    streakChange: streakInfo.change,
    nouveauxBadges
  };
}

// --- Débloque un easter egg ---
export async function debloquerEasterEgg(idSecret) {
  const user = auth.currentUser;
  const dateIso = new Date().toISOString();

  if (!firebaseConfigured || !user) {
    const data = lireInvite();
    if (data.easterEggs[idSecret]) return false;
    data.easterEggs[idSecret] = dateIso;
    ecrireInvite(data);
    return true;
  }

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const eggs = snap.data()?.easterEggs || {};
  if (eggs[idSecret]) return false;
  eggs[idSecret] = dateIso;
  await updateDoc(ref, { easterEggs: eggs });
  return true;
}

export async function estDebloque(idSecret) {
  const data = await getDonnees();
  return Boolean(data.easterEggs?.[idSecret]);
}

export async function listerEasterEggs() {
  const data = await getDonnees();
  return data.easterEggs || {};
}

// ----------------------------------------------------------------
// LEADERBOARD : récupère le top N des joueurs par XP
// ----------------------------------------------------------------
export async function getLeaderboard(nb = 50) {
  if (!firebaseConfigured) return [];
  try {
    const q = query(
      collection(db, "leaderboard"),
      orderBy("xp", "desc"),
      limit(nb)
    );
    const snap = await getDocs(q);
    const liste = [];
    snap.forEach((d) => {
      liste.push({ uid: d.id, ...d.data() });
    });
    return liste;
  } catch (err) {
    console.warn("Leaderboard inaccessible :", err);
    return [];
  }
}
