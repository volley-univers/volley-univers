// ============================================================
// firebase.js — Initialisation de Firebase (Auth + Firestore)
// ------------------------------------------------------------
// COMMENT CONFIGURER :
// 1. Va sur https://console.firebase.google.com/
// 2. Crée un nouveau projet (gratuit)
// 3. Active "Authentication" → méthode "Email/Password"
// 4. Active "Firestore Database" en mode test (ou avec règles ci-dessous)
// 5. Dans "Paramètres du projet" → "Tes applications" → ajoute une app Web
// 6. Copie la configuration ci-dessous et remplace les valeurs
//
// RÈGLES FIRESTORE RECOMMANDÉES (à coller dans l'onglet "Règles") :
//   rules_version = '2';
//   service cloud.firestore {
//     match /databases/{database}/documents {
//       match /users/{userId} {
//         allow read, write: if request.auth != null && request.auth.uid == userId;
//       }
//     }
//   }
// ============================================================

// On utilise les modules ES de Firebase v10 via CDN (pas besoin de build tool)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// === REMPLACE CES VALEURS PAR TA PROPRE CONFIG FIREBASE ===
const firebaseConfig = {
  apiKey: "REMPLACE_PAR_TA_CLE_API",
  authDomain: "REMPLACE.firebaseapp.com",
  projectId: "REMPLACE_PAR_TON_PROJECT_ID",
  storageBucket: "REMPLACE.appspot.com",
  messagingSenderId: "REMPLACE_PAR_TON_SENDER_ID",
  appId: "REMPLACE_PAR_TON_APP_ID"
};
// ==========================================================

// Initialisation
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Persistance : l'utilisateur reste connecté entre les visites
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn("Persistance auth non activée :", err);
});

// Petit drapeau pratique pour vérifier la config
export const firebaseConfigured =
  !firebaseConfig.apiKey.startsWith("REMPLACE");

if (!firebaseConfigured) {
  console.warn(
    "%c⚠ Firebase non configuré",
    "color: orange; font-weight: bold;",
    "→ Édite /js/firebase.js avec ta config pour activer les comptes."
  );
}
