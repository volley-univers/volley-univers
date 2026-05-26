// ============================================================
// auth.js — Inscription, connexion, déconnexion, observation
// ------------------------------------------------------------
// Toutes les fonctions renvoient des Promises pour permettre
// un async/await propre depuis les pages.
// ============================================================

import { auth, db, firebaseConfigured } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// -- Traduction des erreurs Firebase en messages clairs (FR) --
function traduireErreur(code) {
  const messages = {
    "auth/email-already-in-use": "Cet email est déjà utilisé.",
    "auth/invalid-email": "Email invalide.",
    "auth/weak-password": "Mot de passe trop court (6 caractères minimum).",
    "auth/user-not-found": "Aucun compte trouvé avec cet email.",
    "auth/wrong-password": "Mot de passe incorrect.",
    "auth/invalid-credential": "Email ou mot de passe incorrect.",
    "auth/too-many-requests": "Trop de tentatives. Réessaie plus tard.",
    "auth/network-request-failed": "Problème de connexion réseau."
  };
  return messages[code] || "Une erreur est survenue. Réessaie.";
}

// -- Validation des champs côté client --
export function validerInscription({ email, motDePasse, pseudo }) {
  if (!pseudo || pseudo.trim().length < 3)
    return "Le pseudo doit faire au moins 3 caractères.";
  if (pseudo.length > 20)
    return "Le pseudo ne doit pas dépasser 20 caractères.";
  if (!/^[\w\-_. ]+$/.test(pseudo))
    return "Caractères interdits dans le pseudo.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Email invalide.";
  if (!motDePasse || motDePasse.length < 6)
    return "Mot de passe trop court (6 caractères minimum).";
  return null; // ok
}

export function validerConnexion({ email, motDePasse }) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Email invalide.";
  if (!motDePasse || motDePasse.length < 1)
    return "Mot de passe requis.";
  return null;
}

// -- Inscription : crée le compte ET le document utilisateur dans Firestore --
export async function inscrire({ email, motDePasse, pseudo }) {
  if (!firebaseConfigured)
    throw new Error("Firebase n'est pas configuré (édite js/firebase.js).");

  const cred = await createUserWithEmailAndPassword(auth, email, motDePasse).catch(
    (err) => {
      throw new Error(traduireErreur(err.code));
    }
  );
  // Mise à jour du displayName (utile pour l'affichage instantané)
  await updateProfile(cred.user, { displayName: pseudo });

  // Création du document utilisateur dans Firestore
  await setDoc(doc(db, "users", cred.user.uid), {
    pseudo,
    email,
    dateInscription: serverTimestamp(),
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
  });

  return cred.user;
}

// -- Connexion --
export async function connecter({ email, motDePasse }) {
  if (!firebaseConfigured)
    throw new Error("Firebase n'est pas configuré (édite js/firebase.js).");
  try {
    const cred = await signInWithEmailAndPassword(auth, email, motDePasse);
    return cred.user;
  } catch (err) {
    throw new Error(traduireErreur(err.code));
  }
}

// -- Déconnexion --
export async function deconnecter() {
  await signOut(auth);
}

// -- Observation de l'état d'authentification (callback appelé à chaque
// changement, y compris au chargement de la page) --
export function observerAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// -- Récupère le document Firestore complet de l'utilisateur courant --
export async function getDonneesUtilisateur(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}
