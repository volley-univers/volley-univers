// ============================================================
// easteregg.js — Système d'easter eggs
// ------------------------------------------------------------
// 1. Konami code : ↑ ↑ ↓ ↓ ← → ← → B A
//    → Débloque la section "Secrets" et l'ajoute au menu.
// 2. Le déblocage est persisté via storage.js
// ============================================================

import { debloquerEasterEgg, estDebloque } from "./storage.js";
import { toast, jouerSonSecret } from "./ui.js";

// Séquence Konami (key codes en valeur "key" du DOM)
const KONAMI = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a"
];

const ID_KONAMI = "konami_secret";

let buffer = []; // Mémorise les dernières touches pressées

// ----------------------------------------------------------------
// Active l'écoute du Konami code sur la page
// ----------------------------------------------------------------
export function initKonami() {
  window.addEventListener("keydown", async (e) => {
    // Ignore si l'utilisateur tape dans un champ
    const tag = (e.target?.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;

    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    buffer.push(key);
    if (buffer.length > KONAMI.length) buffer.shift();

    // Vérification stricte
    if (buffer.length === KONAMI.length &&
        buffer.every((k, i) => k === KONAMI[i])) {
      buffer = [];
      await activerSecret();
    }
  });
}

// ----------------------------------------------------------------
// Active le secret Konami
// ----------------------------------------------------------------
async function activerSecret() {
  const dejaDebloque = await estDebloque(ID_KONAMI);
  const nouvellementDebloque = await debloquerEasterEgg(ID_KONAMI);

  // Animation visuelle : flash doré
  document.body.classList.add("konami-flash");
  setTimeout(() => document.body.classList.remove("konami-flash"), 1500);

  // Son (optionnel, généré via Web Audio API)
  jouerSonSecret();

  if (dejaDebloque) {
    toast("Tu connais déjà ce secret…", "secret");
  } else {
    toast("✦ Secret découvert — section « Les Secrets du Volley » débloquée", "secret", 5000);
  }

  // Met à jour le menu pour faire apparaître le lien Secrets
  rafraichirMenuSecrets();
}

// ----------------------------------------------------------------
// Affiche/cache le lien "Secrets" dans le menu de navigation
// ----------------------------------------------------------------
export async function rafraichirMenuSecrets() {
  const lien = document.querySelector('[data-secret-link]');
  if (!lien) return;
  const debloque = await estDebloque(ID_KONAMI);
  lien.style.display = debloque ? "" : "none";
}

// Export de l'id pour les autres pages
export const ID_SECRET_KONAMI = ID_KONAMI;
