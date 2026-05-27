// ============================================================
// firebase.js — Initialisation de Firebase (Auth + Firestore)
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// === Configuration Firebase ===
const firebaseConfig = {
  apiKey: "AIzaSyC6czcRjGgU4Tg-QKnkTAd4VjghJgHSDV0",
  authDomain: "volley-quizz.firebaseapp.com",
  projectId: "volley-quizz",
  storageBucket: "volley-quizz.firebasestorage.app",
  messagingSenderId: "185677799344",
  appId: "1:185677799344:web:8aed5219af2231fb4f4075",
  measurementId: "G-HGYYKS05DM"
};

// Initialisation
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Persistance : l'utilisateur reste connecté entre les visites
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn("Persistance auth non activée :", err);
});

// Drapeau pour vérifier la config
export const firebaseConfigured = true;
