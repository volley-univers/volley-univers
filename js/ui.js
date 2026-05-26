// ============================================================
// ui.js — Composants d'interface partagés
// ------------------------------------------------------------
// - Notifications toast
// - Gestion thème clair/sombre (sauvegardé en localStorage)
// - Mise à jour du header en fonction de l'auth
// - Effets : reveal au scroll, son secret
// ============================================================

import { observerAuth, deconnecter } from "./auth.js";
import { rafraichirMenuSecrets } from "./easteregg.js";

// ----------------------------------------------------------------
// TOAST : affiche une notification temporaire
// types : "info" | "success" | "error" | "secret"
// ----------------------------------------------------------------
export function toast(message, type = "info", duree = 3500) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => el.remove(), duree + 200);
}

// ----------------------------------------------------------------
// GESTION DU THÈME
// ----------------------------------------------------------------
const THEME_KEY = "volley_theme";

export function initTheme() {
  const sauvegarde = localStorage.getItem(THEME_KEY);
  const prefereDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = sauvegarde || (prefereDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);

  // Met à jour l'icône du bouton si présent
  const btn = document.querySelector("[data-toggle-theme]");
  if (btn) btn.textContent = theme === "dark" ? "☀" : "☾";
}

export function basculerTheme() {
  const actuel = document.documentElement.getAttribute("data-theme") || "light";
  const nouveau = actuel === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", nouveau);
  localStorage.setItem(THEME_KEY, nouveau);
  const btn = document.querySelector("[data-toggle-theme]");
  if (btn) btn.textContent = nouveau === "dark" ? "☀" : "☾";
}

// ----------------------------------------------------------------
// HEADER : met à jour la zone utilisateur (pseudo / login / logout)
// ----------------------------------------------------------------
export function initHeader() {
  // Bouton thème
  const btnTheme = document.querySelector("[data-toggle-theme]");
  if (btnTheme) btnTheme.addEventListener("click", basculerTheme);

  // Observation de l'état de connexion
  observerAuth(async (user) => {
    const zone = document.querySelector("[data-user-zone]");
    if (!zone) return;

    if (user) {
      zone.innerHTML = `
        <span class="user-pseudo">${escapeHtml(user.displayName || "Joueur")}</span>
        <button class="btn btn-ghost btn-sm" data-logout>Déconnexion</button>
      `;
      zone.querySelector("[data-logout]").addEventListener("click", async () => {
        await deconnecter();
        toast("À bientôt !", "info");
        // Recharge la page d'accueil après déconnexion
        setTimeout(() => location.reload(), 600);
      });
    } else {
      zone.innerHTML = `
        <a href="login.html" class="btn btn-accent btn-sm">Connexion</a>
      `;
    }

    // Rafraîchir aussi le lien "Secrets" (visible ou non)
    rafraichirMenuSecrets();
  });
}

// ----------------------------------------------------------------
// Reveal au scroll (pour donner du rythme aux pages)
// ----------------------------------------------------------------
export function initReveal() {
  const cibles = document.querySelectorAll(".reveal");
  if (!cibles.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  cibles.forEach((c) => obs.observe(c));
}

// ----------------------------------------------------------------
// Son du secret (généré via Web Audio API → pas de fichier audio nécessaire)
// ----------------------------------------------------------------
export function jouerSonSecret() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // do, mi, sol, do (octave)
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = "triangle";
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + i * 0.15 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.15 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.3);
    });
  } catch (e) {
    // Audio bloqué (autoplay policy) ou non supporté : on ignore silencieusement
  }
}

// ----------------------------------------------------------------
// Petite fonction d'échappement HTML pour éviter l'injection
// ----------------------------------------------------------------
export function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}
