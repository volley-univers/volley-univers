// ============================================================
// animations.js — Animations de progression (level-up, badges)
// ------------------------------------------------------------
// Toutes les animations spectaculaires sont ici pour
// éviter de polluer les pages.
// ============================================================

import { jouerSonSecret } from "./ui.js";

// ----------------------------------------------------------------
// Animation LEVEL UP plein écran
// ----------------------------------------------------------------
export function animerLevelUp(ancienRang, nouveauRang) {
  // Construit l'overlay
  const overlay = document.createElement("div");
  overlay.className = "levelup-overlay";
  overlay.innerHTML = `
    <div class="lvl-label">Niveau supérieur</div>
    <div class="lvl-emoji">${nouveauRang.emoji}</div>
    <div class="lvl-niveau">Niveau ${nouveauRang.niveau}</div>
    <div class="lvl-nom">${nouveauRang.nom}</div>
    <div class="lvl-hint">Clique pour continuer</div>
  `;
  document.body.appendChild(overlay);

  // Particules dorées qui jaillissent du centre
  for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.className = "lvl-particle";
    const angle = (Math.PI * 2 * i) / 40;
    const dist = 200 + Math.random() * 300;
    p.style.left = "50%";
    p.style.top = "50%";
    p.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    p.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    p.style.animationDelay = `${0.4 + Math.random() * 0.3}s`;
    overlay.appendChild(p);
  }

  // Son
  jouerLevelUpSound();

  // Fermeture au clic ou après 4s
  const fermer = () => {
    overlay.classList.add("out");
    setTimeout(() => overlay.remove(), 400);
  };
  overlay.addEventListener("click", fermer);
  setTimeout(fermer, 4500);
}

// Son du level up (Web Audio, pas de fichier)
function jouerLevelUpSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Mélodie triomphante : do, mi, sol, do (octave), mi (octave)
    const notes = [
      { f: 523.25, t: 0 },
      { f: 659.25, t: 0.12 },
      { f: 783.99, t: 0.24 },
      { f: 1046.50, t: 0.36 },
      { f: 1318.51, t: 0.48 }
    ];
    notes.forEach(({ f, t }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = f;
      osc.type = "triangle";
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.55);
    });
  } catch (e) { /* ignore */ }
}

// ----------------------------------------------------------------
// Notifications de badges débloqués
// ----------------------------------------------------------------
export function notifierBadge(badge, delaiMs = 0) {
  setTimeout(() => {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }
    const el = document.createElement("div");
    el.className = "toast badge-toast";
    el.innerHTML = `
      <div class="badge-emoji">${badge.emoji}</div>
      <div>
        <div class="small">Badge débloqué</div>
        <div class="bnom">${badge.nom}</div>
      </div>
    `;
    container.appendChild(el);
    jouerSonSecret(); // petit son cristallin
    setTimeout(() => el.remove(), 4400);
  }, delaiMs);
}

// ----------------------------------------------------------------
// Animation d'XP qui monte (compteur)
// ----------------------------------------------------------------
export function animerCompteur(el, depart, arrivee, dureeMs = 1200) {
  const debut = performance.now();
  function frame(t) {
    const progress = Math.min((t - debut) / dureeMs, 1);
    // Easing out
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(depart + (arrivee - depart) * eased);
    el.textContent = val.toLocaleString("fr-FR");
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
