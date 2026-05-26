// ============================================================
// admin.js — Fonctions admin
// ------------------------------------------------------------
// Toutes les actions admin passent par Firestore.
// Les règles Firestore vérifient que l'utilisateur est bien admin
// (champ admin:true dans son propre document) avant d'autoriser
// les opérations sensibles.
// ============================================================

import { auth, db, firebaseConfigured } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  addDoc,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getRang } from "./xp.js";

// ----------------------------------------------------------------
// Vérifie si l'utilisateur courant est admin
// ----------------------------------------------------------------
export async function estAdmin() {
  if (!firebaseConfigured) return false;
  const user = auth.currentUser;
  if (!user) return false;
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    return snap.exists() && snap.data().admin === true;
  } catch (err) {
    console.warn("Vérification admin échouée :", err);
    return false;
  }
}

// ----------------------------------------------------------------
// Liste tous les utilisateurs (admin uniquement)
// ----------------------------------------------------------------
export async function listerUtilisateurs(nb = 200) {
  if (!firebaseConfigured) return [];
  const q = query(collection(db, "users"), limit(nb));
  const snap = await getDocs(q);
  const liste = [];
  snap.forEach((d) => {
    liste.push({ uid: d.id, ...d.data() });
  });
  return liste;
}

// ----------------------------------------------------------------
// Modifier l'XP d'un joueur
// ----------------------------------------------------------------
export async function modifierXp(uid, nouvelXp) {
  if (!firebaseConfigured) throw new Error("Firebase non configuré");
  const xpClean = Math.max(0, Math.round(Number(nouvelXp) || 0));
  const nouveauRang = getRang(xpClean);

  // Mise à jour du document user
  await updateDoc(doc(db, "users", uid), { xp: xpClean });

  // Mise à jour du leaderboard
  try {
    const userSnap = await getDoc(doc(db, "users", uid));
    if (userSnap.exists()) {
      const d = userSnap.data();
      await setDoc(doc(db, "leaderboard", uid), {
        pseudo: d.pseudo || "Joueur",
        xp: xpClean,
        niveau: nouveauRang.niveau,
        rangNom: nouveauRang.nom,
        quizTermines: d.progression?.quizTermines || 0,
        derniereActivite: serverTimestamp()
      }, { merge: true });
    }
  } catch (e) {
    console.warn("MAJ leaderboard impossible :", e);
  }

  await logAction("modifier_xp", { uid, nouvelXp: xpClean });
  return xpClean;
}

// ----------------------------------------------------------------
// Reset complet des stats d'un joueur
// ----------------------------------------------------------------
export async function resetStats(uid) {
  if (!firebaseConfigured) throw new Error("Firebase non configuré");
  await updateDoc(doc(db, "users", uid), {
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
    badges: {}
  });

  // Reset aussi sur le leaderboard
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      await setDoc(doc(db, "leaderboard", uid), {
        pseudo: snap.data().pseudo || "Joueur",
        xp: 0,
        niveau: 1,
        rangNom: "Ramasseur de balles",
        quizTermines: 0,
        derniereActivite: serverTimestamp()
      }, { merge: true });
    }
  } catch (e) {
    console.warn("Reset leaderboard impossible :", e);
  }

  await logAction("reset_stats", { uid });
}

// ----------------------------------------------------------------
// Bannir / débannir un utilisateur
// ----------------------------------------------------------------
export async function bannir(uid, raison = "") {
  if (!firebaseConfigured) throw new Error("Firebase non configuré");
  await updateDoc(doc(db, "users", uid), {
    banni: true,
    raisonBan: raison,
    dateBan: serverTimestamp()
  });
  // Retire du leaderboard
  try { await deleteDoc(doc(db, "leaderboard", uid)); } catch {}
  await logAction("bannir", { uid, raison });
}

export async function debannir(uid) {
  if (!firebaseConfigured) throw new Error("Firebase non configuré");
  await updateDoc(doc(db, "users", uid), {
    banni: false,
    raisonBan: "",
    dateBan: null
  });
  await logAction("debannir", { uid });
}

// ----------------------------------------------------------------
// Supprimer définitivement un utilisateur (du Firestore)
// Note : ne supprime pas le compte Auth (Firebase ne le permet pas
// depuis le front pour des raisons de sécurité). Il faut le faire
// depuis la console Firebase ou via une Cloud Function.
// ----------------------------------------------------------------
export async function supprimerUtilisateur(uid) {
  if (!firebaseConfigured) throw new Error("Firebase non configuré");
  await deleteDoc(doc(db, "users", uid));
  try { await deleteDoc(doc(db, "leaderboard", uid)); } catch {}
  await logAction("supprimer", { uid });
}

// ----------------------------------------------------------------
// Ajouter / retirer un badge
// ----------------------------------------------------------------
export async function ajouterBadge(uid, idBadge) {
  if (!firebaseConfigured) throw new Error("Firebase non configuré");
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) throw new Error("Utilisateur introuvable");
  const badges = snap.data().badges || {};
  badges[idBadge] = new Date().toISOString();
  await updateDoc(doc(db, "users", uid), { badges });
  await logAction("ajouter_badge", { uid, idBadge });
}

export async function retirerBadge(uid, idBadge) {
  if (!firebaseConfigured) throw new Error("Firebase non configuré");
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) throw new Error("Utilisateur introuvable");
  const badges = snap.data().badges || {};
  delete badges[idBadge];
  await updateDoc(doc(db, "users", uid), { badges });
  await logAction("retirer_badge", { uid, idBadge });
}

// ----------------------------------------------------------------
// Promouvoir/rétrograder admin
// ----------------------------------------------------------------
export async function setAdmin(uid, estAdmin) {
  if (!firebaseConfigured) throw new Error("Firebase non configuré");
  await updateDoc(doc(db, "users", uid), { admin: !!estAdmin });
  await logAction(estAdmin ? "promouvoir_admin" : "retrograder_admin", { uid });
}

// ----------------------------------------------------------------
// Statistiques globales du site
// ----------------------------------------------------------------
export async function getStatsGlobales() {
  if (!firebaseConfigured) return null;
  const snap = await getDocs(collection(db, "users"));
  let totalUsers = 0;
  let totalQuiz = 0;
  let totalXp = 0;
  let totalBonnes = 0;
  let totalQuestions = 0;
  let bannis = 0;
  let admins = 0;
  let joueursActifs = 0; // Quiz terminés > 0
  const repartitionNiveau = {};

  const dateLimite = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 jours

  snap.forEach((d) => {
    const data = d.data();
    totalUsers++;
    const p = data.progression || {};
    totalQuiz += p.quizTermines || 0;
    totalXp += data.xp || 0;
    totalBonnes += p.bonnesReponsesTotal || 0;
    totalQuestions += p.questionsRepondues || 0;
    if (data.banni) bannis++;
    if (data.admin) admins++;
    if ((p.quizTermines || 0) > 0) joueursActifs++;

    const rang = getRang(data.xp || 0);
    repartitionNiveau[rang.niveau] = (repartitionNiveau[rang.niveau] || 0) + 1;
  });

  return {
    totalUsers,
    totalQuiz,
    totalXp,
    totalBonnes,
    totalQuestions,
    bannis,
    admins,
    joueursActifs,
    pourcentageReussite: totalQuestions > 0
      ? Math.round((totalBonnes / totalQuestions) * 100)
      : 0,
    xpMoyen: totalUsers > 0 ? Math.round(totalXp / totalUsers) : 0,
    repartitionNiveau
  };
}

// ----------------------------------------------------------------
// Questions custom (stockées dans Firestore en plus des questions
// du fichier quiz.js)
// ----------------------------------------------------------------
export async function listerQuestionsCustom() {
  if (!firebaseConfigured) return [];
  try {
    const snap = await getDocs(collection(db, "questions"));
    const liste = [];
    snap.forEach((d) => liste.push({ id: d.id, ...d.data() }));
    return liste;
  } catch (e) {
    console.warn("Impossible de lire questions custom :", e);
    return [];
  }
}

export async function ajouterQuestion({ niveau, q, choix, bonne, explication }) {
  if (!firebaseConfigured) throw new Error("Firebase non configuré");
  if (!q || !Array.isArray(choix) || choix.length !== 4)
    throw new Error("Format invalide");
  if (bonne < 0 || bonne > 3) throw new Error("Réponse correcte invalide");
  if (!["debutant", "intermediaire", "expert"].includes(niveau))
    throw new Error("Niveau invalide");

  const ref = await addDoc(collection(db, "questions"), {
    niveau,
    q: q.trim(),
    choix: choix.map(c => String(c).trim()),
    bonne: Number(bonne),
    explication: (explication || "").trim(),
    createur: auth.currentUser?.uid || null,
    date: serverTimestamp()
  });
  await logAction("ajouter_question", { id: ref.id, niveau });
  return ref.id;
}

export async function modifierQuestion(id, donnees) {
  if (!firebaseConfigured) throw new Error("Firebase non configuré");
  await updateDoc(doc(db, "questions", id), donnees);
  await logAction("modifier_question", { id });
}

export async function supprimerQuestion(id) {
  if (!firebaseConfigured) throw new Error("Firebase non configuré");
  await deleteDoc(doc(db, "questions", id));
  await logAction("supprimer_question", { id });
}

// ----------------------------------------------------------------
// LOGS — Trace des actions admin
// ----------------------------------------------------------------
export async function logAction(action, details = {}) {
  if (!firebaseConfigured) return;
  try {
    await addDoc(collection(db, "logs"), {
      action,
      details,
      auteur: auth.currentUser?.uid || null,
      pseudoAuteur: auth.currentUser?.displayName || "?",
      date: serverTimestamp()
    });
  } catch (e) {
    // Pas critique si ça échoue
    console.warn("Log non enregistré :", e);
  }
}

export async function listerLogs(nb = 50) {
  if (!firebaseConfigured) return [];
  try {
    const q = query(collection(db, "logs"), orderBy("date", "desc"), limit(nb));
    const snap = await getDocs(q);
    const liste = [];
    snap.forEach((d) => liste.push({ id: d.id, ...d.data() }));
    return liste;
  } catch (e) {
    return [];
  }
}
