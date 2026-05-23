/* ==========================================================
   VOLLEY UNIVERS — Script principal (ES Modules)
   - Firebase Authentication (email/password)
   - Firestore (anecdotes + profils utilisateurs)
   - Storage (images des anecdotes)
   - Premier inscrit = administrateur automatique
   - Sauvegarde des easter eggs débloqués sur le compte
   ========================================================== */

// ============================================================
// 0. IMPORTS FIREBASE (CDN — modules ES officiels)
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth, onAuthStateChanged,
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    getFirestore, doc, setDoc, getDoc, updateDoc,
    collection, addDoc, deleteDoc, query, orderBy, onSnapshot,
    runTransaction, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
    getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// ============================================================
// 1. CONFIGURATION FIREBASE
// ============================================================
// ⚠️ REMPLACE CES VALEURS PAR CELLES DE TON PROJET FIREBASE
// (Project settings > Your apps > icône </> > firebaseConfig)
const firebaseConfig = {
    apiKey: "TA_API_KEY_ICI",
    authDomain: "ton-projet.firebaseapp.com",
    projectId: "ton-projet",
    storageBucket: "ton-projet.appspot.com",
    messagingSenderId: "0000000000",
    appId: "1:0000000000:web:xxxxxxxxxxxxxxxx"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ============================================================
// 2. ÉTAT GLOBAL
// ============================================================
let currentUser = null;        // Objet Firebase Auth
let currentProfile = null;     // Document Firestore (pseudo, isAdmin, unlocks)
let editingAnecdoteId = null;  // ID en cours d'édition dans le panel admin

// ============================================================
// 3. UTILITAIRES
// ============================================================
const $ = (id) => document.getElementById(id);

const toast = $('toast');
function showToast(message, variant = '') {
    toast.textContent = message;
    toast.className = 'toast show';
    if (variant) toast.classList.add(variant);
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// ============================================================
// 4. MENU BURGER (mobile)
// ============================================================
$('burger').addEventListener('click', () => $('nav-links').classList.toggle('open'));
$('nav-links').querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => $('nav-links').classList.remove('open'));
});

// ============================================================
// 5. MODALS (auth + profil)
// ============================================================
const authModal = $('auth-modal');
const profileModal = $('profile-modal');

$('account-link').addEventListener('click', (e) => {
    e.preventDefault();
    // Si connecté → modal profil, sinon → modal auth
    if (currentUser) {
        openProfileModal();
    } else {
        openAuthModal('login');
    }
});

$('auth-close').addEventListener('click', () => authModal.classList.add('hidden'));
$('profile-close').addEventListener('click', () => profileModal.classList.add('hidden'));

// Fermer en cliquant sur l'overlay
[authModal, profileModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });
});

// Onglets login / register
document.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        $('tab-login').classList.toggle('hidden', target !== 'login');
        $('tab-register').classList.toggle('hidden', target !== 'register');
    });
});

function openAuthModal(tab = 'login') {
    authModal.classList.remove('hidden');
    document.querySelector(`.modal-tab[data-tab="${tab}"]`).click();
}

function openProfileModal() {
    if (!currentProfile) return;
    $('profile-avatar').textContent = (currentProfile.name || '?')[0];
    $('profile-name').textContent = currentProfile.name || 'Anonyme';
    $('profile-email').textContent = currentUser.email;

    const roleEl = $('profile-role');
    if (currentProfile.isAdmin) {
        roleEl.textContent = '👑 ADMINISTRATEUR';
        roleEl.classList.remove('user');
    } else {
        roleEl.textContent = 'MEMBRE';
        roleEl.classList.add('user');
    }

    // Affiche l'état des easter eggs débloqués
    $('stat-konami').textContent = currentProfile.unlocks?.konami ? '✅' : '❌';
    $('stat-code').textContent = currentProfile.unlocks?.secretCode ? '✅' : '❌';

    profileModal.classList.remove('hidden');
}

// ============================================================
// 6. AUTHENTIFICATION : INSCRIPTION
// ============================================================
$('btn-register').addEventListener('click', async () => {
    const name = $('register-name').value.trim();
    const email = $('register-email').value.trim();
    const password = $('register-password').value;
    const errEl = $('register-error');

    errEl.classList.add('hidden');

    if (!name || !email || !password) {
        errEl.textContent = 'Tous les champs sont obligatoires';
        errEl.classList.remove('hidden');
        return;
    }
    if (password.length < 6) {
        errEl.textContent = 'Le mot de passe doit faire au moins 6 caractères';
        errEl.classList.remove('hidden');
        return;
    }

    const btn = $('btn-register');
    btn.disabled = true;
    btn.textContent = 'Création...';

    try {
        // 1. Crée le compte Firebase Auth
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });

        // 2. Détermine si c'est le premier utilisateur via une transaction atomique
        //    sur le document meta/userCount. Le premier devient admin.
        const isFirstUser = await runTransaction(db, async (transaction) => {
            const metaRef = doc(db, 'meta', 'userCount');
            const metaSnap = await transaction.get(metaRef);
            if (!metaSnap.exists()) {
                // Aucun utilisateur encore → on est le premier
                transaction.set(metaRef, { count: 1 });
                return true;
            }
            const current = metaSnap.data().count || 0;
            transaction.update(metaRef, { count: current + 1 });
            return false;
        });

        // 3. Crée le profil utilisateur dans Firestore
        await setDoc(doc(db, 'users', cred.user.uid), {
            name,
            email,
            isAdmin: isFirstUser,
            unlocks: { konami: false, secretCode: false },
            createdAt: serverTimestamp()
        });

        authModal.classList.add('hidden');
        if (isFirstUser) {
            showToast('👑 Bienvenue ! Tu es l\'administrateur du site', 'admin');
        } else {
            showToast(`Bienvenue ${name} !`);
        }

        // Reset des champs
        $('register-name').value = '';
        $('register-email').value = '';
        $('register-password').value = '';

    } catch (e) {
        errEl.textContent = traduireErreur(e.code) || e.message;
        errEl.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Créer le compte';
    }
});

// ============================================================
// 7. AUTHENTIFICATION : CONNEXION
// ============================================================
$('btn-login').addEventListener('click', async () => {
    const email = $('login-email').value.trim();
    const password = $('login-password').value;
    const errEl = $('login-error');

    errEl.classList.add('hidden');

    if (!email || !password) {
        errEl.textContent = 'Email et mot de passe requis';
        errEl.classList.remove('hidden');
        return;
    }

    const btn = $('btn-login');
    btn.disabled = true;
    btn.textContent = 'Connexion...';

    try {
        await signInWithEmailAndPassword(auth, email, password);
        authModal.classList.add('hidden');
        $('login-email').value = '';
        $('login-password').value = '';
    } catch (e) {
        errEl.textContent = traduireErreur(e.code) || e.message;
        errEl.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Se connecter';
    }
});

// Déconnexion
$('btn-logout').addEventListener('click', async () => {
    await signOut(auth);
    profileModal.classList.add('hidden');
    showToast('Déconnecté');
});

// Traduction des codes d'erreur Firebase en français
function traduireErreur(code) {
    const map = {
        'auth/email-already-in-use': 'Cet email est déjà utilisé',
        'auth/invalid-email': 'Email invalide',
        'auth/weak-password': 'Mot de passe trop faible (6 caractères min.)',
        'auth/user-not-found': 'Aucun compte avec cet email',
        'auth/wrong-password': 'Mot de passe incorrect',
        'auth/invalid-credential': 'Email ou mot de passe incorrect',
        'auth/too-many-requests': 'Trop de tentatives. Réessaie plus tard.',
        'auth/network-request-failed': 'Pas de connexion réseau'
    };
    return map[code];
}

// ============================================================
// 8. SURVEILLANCE DE L'ÉTAT DE CONNEXION
// ============================================================
let unsubAnecdotes = null; // pour pouvoir désabonner

onAuthStateChanged(auth, async (user) => {
    currentUser = user;

    if (user) {
        // Récupère le profil depuis Firestore
        const profileSnap = await getDoc(doc(db, 'users', user.uid));
        currentProfile = profileSnap.exists() ? profileSnap.data() : null;

        // Met à jour la nav (avatar + libellé)
        $('account-link').innerHTML = `
            <span class="nav-avatar">${(currentProfile?.name || '?')[0].toUpperCase()}</span>
            ${currentProfile?.name || 'Compte'}
        `;

        // Indice contextuel sur le hero
        $('hero-hint').textContent = currentProfile?.isAdmin
            ? '👑 Tu es admin — l\'onglet Admin est dans la navigation'
            : '💡 Tes découvertes secrètes sont sauvegardées sur ton compte';

        // Affiche le panel admin si applicable
        if (currentProfile?.isAdmin) {
            $('nav-admin').classList.remove('hidden-section');
            $('admin').classList.remove('hidden-section');
        } else {
            $('nav-admin').classList.add('hidden-section');
            $('admin').classList.add('hidden-section');
        }

        // Restaure les easter eggs débloqués sur le compte
        if (currentProfile?.unlocks?.konami) {
            unlockPuyDuFou(false);  // false = pas de notification (déjà débloqué)
        }
        if (currentProfile?.unlocks?.secretCode) {
            unlockAnecdotes(false);
        }

        // S'abonne aux anecdotes en temps réel
        subscribeAnecdotes();

    } else {
        // Pas connecté : reset complet
        currentProfile = null;
        $('account-link').textContent = 'Se connecter';
        $('hero-hint').textContent = '💡 Connecte-toi pour sauvegarder tes découvertes...';

        // Cache toutes les sections sécurisées
        $('nav-admin').classList.add('hidden-section');
        $('admin').classList.add('hidden-section');
        $('nav-puydufou').classList.add('hidden-section');
        $('puydufou').classList.add('hidden-section');
        $('nav-anecdotes').classList.add('hidden-section');
        $('anecdotes').classList.add('hidden-section');

        if (unsubAnecdotes) { unsubAnecdotes(); unsubAnecdotes = null; }
    }
});

// ============================================================
// 9. CHARGEMENT DES ANECDOTES (temps réel)
// ============================================================
let allAnecdotes = []; // cache local

function subscribeAnecdotes() {
    if (unsubAnecdotes) unsubAnecdotes();

    const q = query(collection(db, 'anecdotes'), orderBy('createdAt', 'asc'));
    unsubAnecdotes = onSnapshot(q, (snapshot) => {
        allAnecdotes = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        renderPuyDuFou();
        renderAnecdotes();
        if (currentProfile?.isAdmin) renderAdminList();
    });
}

// Rendu de la section Puy du Fou (cartes en grille)
function renderPuyDuFou() {
    const grid = $('puydufou-grid');
    const items = allAnecdotes.filter(a => a.category === 'puydufou');

    if (items.length === 0) {
        grid.innerHTML = '<p class="loading-msg">Aucune anecdote Puy du Fou pour le moment.</p>';
        return;
    }

    grid.innerHTML = items.map(item => `
        <article class="card">
            ${item.imageUrl ? `<img class="card-image" src="${item.imageUrl}" alt="${escapeHtml(item.title)}">` : ''}
            ${item.icon && !item.imageUrl ? `<div class="card-icon">${escapeHtml(item.icon)}</div>` : ''}
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.text)}</p>
        </article>
    `).join('');
}

// Rendu de la section Anecdotes (liste numérotée)
function renderAnecdotes() {
    const list = $('anecdotes-list');
    const items = allAnecdotes.filter(a => a.category === 'anecdote');

    if (items.length === 0) {
        list.innerHTML = '<p class="loading-msg">Aucune anecdote secrète pour le moment.</p>';
        return;
    }

    list.innerHTML = items.map((item, i) => `
        <div class="anecdote">
            <span class="anecdote-num">${String(i + 1).padStart(2, '0')}</span>
            <div class="anecdote-body">
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.text)}</p>
                ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${escapeHtml(item.title)}">` : ''}
            </div>
        </div>
    `).join('');
}

// Échappe les caractères HTML pour éviter les injections via le contenu admin
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

// ============================================================
// 10. PANEL ADMIN — Ajout / Modification / Suppression
// ============================================================
$('btn-add-anecdote').addEventListener('click', async () => {
    if (!currentProfile?.isAdmin) return;

    const category = $('admin-category').value;
    const title = $('admin-title').value.trim();
    const text = $('admin-text').value.trim();
    const icon = $('admin-icon').value.trim();
    const file = $('admin-image').files[0];
    const fbEl = $('admin-feedback');
    const btn = $('btn-add-anecdote');

    fbEl.classList.add('hidden');

    if (!title || !text) {
        showAdminFeedback('Titre et texte requis', 'error');
        return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
        showAdminFeedback('Image trop lourde (max 5 Mo)', 'error');
        return;
    }

    btn.disabled = true;
    btn.textContent = editingAnecdoteId ? 'Mise à jour...' : 'Ajout...';

    try {
        let imageUrl = null;
        let imagePath = null;

        // Upload de l'image dans Storage si présente
        if (file) {
            imagePath = `anecdotes/${Date.now()}_${file.name}`;
            const fileRef = storageRef(storage, imagePath);
            await uploadBytes(fileRef, file);
            imageUrl = await getDownloadURL(fileRef);
        }

        if (editingAnecdoteId) {
            // ----- Mode édition -----
            const updateData = { category, title, text, icon: icon || null };
            if (imageUrl) {
                updateData.imageUrl = imageUrl;
                updateData.imagePath = imagePath;
            }
            await updateDoc(doc(db, 'anecdotes', editingAnecdoteId), updateData);
            showAdminFeedback('Anecdote mise à jour ✅', 'success');
            cancelEdit();
        } else {
            // ----- Mode ajout -----
            await addDoc(collection(db, 'anecdotes'), {
                category, title, text,
                icon: icon || null,
                imageUrl, imagePath,
                createdAt: serverTimestamp(),
                createdBy: currentUser.uid
            });
            showAdminFeedback('Anecdote ajoutée ✅', 'success');
        }

        // Reset du formulaire
        $('admin-title').value = '';
        $('admin-text').value = '';
        $('admin-icon').value = '';
        $('admin-image').value = '';

    } catch (e) {
        showAdminFeedback('Erreur : ' + e.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = editingAnecdoteId ? 'Mettre à jour' : 'Ajouter';
    }
});

function showAdminFeedback(message, type) {
    const el = $('admin-feedback');
    el.textContent = message;
    el.className = 'admin-feedback ' + type;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 4000);
}

// Liste des anecdotes existantes (vue admin)
function renderAdminList() {
    const list = $('admin-list');
    if (allAnecdotes.length === 0) {
        list.innerHTML = '<p class="loading-msg">Aucune anecdote pour le moment.</p>';
        return;
    }

    list.innerHTML = allAnecdotes.map(item => `
        <div class="admin-item" data-id="${item.id}">
            <div class="admin-item-thumb">
                ${item.imageUrl
                    ? `<img src="${item.imageUrl}" alt="">`
                    : (item.icon ? escapeHtml(item.icon) : '📝')}
            </div>
            <div class="admin-item-info">
                <h4>
                    <span class="admin-item-tag">${item.category === 'puydufou' ? '🎭' : '✨'}</span>
                    ${escapeHtml(item.title)}
                </h4>
                <p>${escapeHtml(item.text)}</p>
            </div>
            <div class="admin-item-actions">
                <button class="btn btn-edit" data-action="edit">Modifier</button>
                <button class="btn btn-danger" data-action="delete">Supprimer</button>
            </div>
        </div>
    `).join('');

    // Branche les boutons (délégation simple)
    list.querySelectorAll('.admin-item').forEach(el => {
        const id = el.dataset.id;
        el.querySelector('[data-action="edit"]').addEventListener('click', () => startEdit(id));
        el.querySelector('[data-action="delete"]').addEventListener('click', () => deleteAnecdote(id));
    });
}

function startEdit(id) {
    const item = allAnecdotes.find(a => a.id === id);
    if (!item) return;

    editingAnecdoteId = id;
    $('admin-category').value = item.category;
    $('admin-title').value = item.title;
    $('admin-text').value = item.text;
    $('admin-icon').value = item.icon || '';
    $('admin-image').value = '';   // on ne pré-remplit pas un input file

    $('btn-add-anecdote').textContent = 'Mettre à jour';
    $('btn-cancel-edit').classList.remove('hidden');

    // Scroll fluide vers le formulaire
    $('admin').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
    editingAnecdoteId = null;
    $('btn-add-anecdote').textContent = 'Ajouter';
    $('btn-cancel-edit').classList.add('hidden');
    $('admin-title').value = '';
    $('admin-text').value = '';
    $('admin-icon').value = '';
    $('admin-image').value = '';
}

$('btn-cancel-edit').addEventListener('click', cancelEdit);

async function deleteAnecdote(id) {
    if (!confirm('Supprimer cette anecdote ?')) return;
    const item = allAnecdotes.find(a => a.id === id);

    try {
        // Supprime l'image associée du Storage si elle existe
        if (item?.imagePath) {
            try {
                await deleteObject(storageRef(storage, item.imagePath));
            } catch (_) { /* ignore : image peut-être déjà supprimée */ }
        }
        await deleteDoc(doc(db, 'anecdotes', id));
        showToast('Anecdote supprimée');
    } catch (e) {
        showToast('Erreur : ' + e.message, 'error');
    }
}

// ============================================================
// 11. QUIZ
// ============================================================
const questions = [
    {
        text: "En quelle année le volleyball a-t-il été inventé ?",
        type: "choice",
        answers: ["1885", "1895", "1905", "1920"],
        correct: 1
    },
    { text: "Combien de joueurs y a-t-il par équipe sur le terrain ?", type: "numeric", correct: "6" },
    {
        text: "Qui a inventé le volleyball ?",
        type: "choice",
        answers: ["James Naismith", "William G. Morgan", "Pierre de Coubertin", "Walter Camp"],
        correct: 1
    },
    { text: "Combien de points faut-il marquer pour gagner un set (en règle générale) ?", type: "numeric", correct: "25" },
    {
        text: "Quel est le nom du joueur spécialisé en défense, portant un maillot différent ?",
        type: "choice",
        answers: ["Le passeur", "Le libéro", "L'attaquant", "Le central"],
        correct: 1
    },
    { text: "Combien de touches maximum une équipe peut-elle faire avant de renvoyer le ballon ?", type: "numeric", correct: "3" },
    {
        text: "Depuis quelle année le beach-volley est-il discipline olympique ?",
        type: "choice",
        answers: ["1988", "1992", "1996", "2000"],
        correct: 2
    },
    { text: "Quelle est la hauteur réglementaire du filet en volley masculin senior, en centimètres ?", type: "numeric", correct: "243" }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

$('btn-start-quiz').addEventListener('click', () => {
    currentQuestion = 0; score = 0;
    $('quiz-start').classList.add('hidden');
    $('quiz-result').classList.add('hidden');
    $('quiz-question').classList.remove('hidden');
    loadQuestion();
});

$('btn-restart').addEventListener('click', () => {
    currentQuestion = 0; score = 0;
    $('quiz-result').classList.add('hidden');
    $('quiz-question').classList.remove('hidden');
    loadQuestion();
});

$('btn-next').addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < questions.length) loadQuestion();
    else showResult();
});

$('btn-submit-numeric').addEventListener('click', submitNumeric);
$('numeric-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitNumeric();
});

function loadQuestion() {
    answered = false;
    const q = questions[currentQuestion];

    $('question-counter').textContent = `Question ${currentQuestion + 1} / ${questions.length}`;
    $('progress-bar').style.width = `${(currentQuestion / questions.length) * 100}%`;
    $('question-text').textContent = q.text;
    $('feedback').classList.add('hidden');
    $('btn-next').classList.add('hidden');
    $('answers-container').innerHTML = '';
    $('numeric-input').value = '';

    if (q.type === 'choice') {
        $('numeric-container').classList.add('hidden');
        $('answers-container').classList.remove('hidden');
        q.answers.forEach((answer, index) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = answer;
            btn.addEventListener('click', () => handleChoiceAnswer(btn, index, q.correct));
            $('answers-container').appendChild(btn);
        });
    } else {
        $('answers-container').classList.add('hidden');
        $('numeric-container').classList.remove('hidden');
        $('numeric-input').focus();
    }
}

function handleChoiceAnswer(btn, selected, correct) {
    if (answered) return;
    answered = true;

    $('answers-container').querySelectorAll('button').forEach(b => b.disabled = true);

    if (selected === correct) {
        btn.classList.add('correct');
        showFeedback(true, "Bonne réponse 🎉");
        score++;
    } else {
        btn.classList.add('wrong');
        $('answers-container').children[correct].classList.add('correct');
        showFeedback(false, `Mauvaise réponse. La bonne était : ${questions[currentQuestion].answers[correct]}`);
    }
    $('btn-next').classList.remove('hidden');
}

function submitNumeric() {
    if (answered) return;
    const value = $('numeric-input').value.trim();
    if (value === '') return;

    // ===== EASTER EGG n°2 : code secret =====
    if (value === '19997246545537') {
        unlockAnecdotes(true);
        $('numeric-input').value = '';
        $('numeric-input').focus();
        return;
    }

    answered = true;
    const q = questions[currentQuestion];
    if (value === q.correct) {
        showFeedback(true, "Bonne réponse 🎉");
        score++;
    } else {
        showFeedback(false, `Mauvaise réponse. La bonne était : ${q.correct}`);
    }
    $('btn-next').classList.remove('hidden');
}

function showFeedback(isCorrect, message) {
    const fb = $('feedback');
    fb.textContent = message;
    fb.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'wrong');
}

function showResult() {
    $('quiz-question').classList.add('hidden');
    $('quiz-result').classList.remove('hidden');
    $('progress-bar').style.width = '100%';
    $('final-score').textContent = score;

    let msg;
    if (score === questions.length) msg = "Score parfait ! Tu es un vrai pro du volley 🏐";
    else if (score >= 6) msg = "Excellent ! Tu maîtrises bien le sujet.";
    else if (score >= 4) msg = "Pas mal ! Tu connais les bases.";
    else msg = "À retravailler... mais l'essentiel c'est de jouer !";
    $('score-message').textContent = msg;
}

// ============================================================
// 12. EASTER EGGS — Déblocage + sauvegarde compte
// ============================================================

// --- Easter Egg n°1 : Code Konami ↑↑↓↓←→←→BA ---
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    // Ignore les frappes dans les champs (sinon impossible de taper "b" dans un input)
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const expected = konamiCode[konamiIndex];

    if (key === expected) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            unlockPuyDuFou(true);
            konamiIndex = 0;
        }
    } else {
        konamiIndex = (key === konamiCode[0]) ? 1 : 0;
    }
});

/**
 * Débloque la section Puy du Fou.
 * @param {boolean} notify  true = afficher toast + scroll + sauvegarder en base
 *                          false = restauration silencieuse au login
 */
async function unlockPuyDuFou(notify = true) {
    if (!currentUser) {
        if (notify) {
            showToast('🔒 Connecte-toi pour débloquer cette section', 'error');
            openAuthModal('login');
        }
        return;
    }

    const section = $('puydufou');
    const navItem = $('nav-puydufou');
    const wasHidden = section.classList.contains('hidden-section');

    section.classList.remove('hidden-section');
    navItem.classList.remove('hidden-section');

    if (notify && wasHidden) {
        section.classList.add('just-unlocked');
        showToast('🎭 Section secrète Puy du Fou débloquée !', 'secret-puydufou');
        setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 600);
        setTimeout(() => section.classList.remove('just-unlocked'), 1000);

        // Sauvegarde dans Firestore si pas déjà fait
        if (!currentProfile.unlocks?.konami) {
            try {
                await updateDoc(doc(db, 'users', currentUser.uid), {
                    'unlocks.konami': true
                });
                currentProfile.unlocks = { ...currentProfile.unlocks, konami: true };
            } catch (e) {
                console.error('Sauvegarde unlock konami échouée:', e);
            }
        }
    } else if (notify && !wasHidden) {
        showToast('🎭 Section déjà débloquée !', 'secret-puydufou');
    }
}

/**
 * Débloque la section Anecdotes.
 */
async function unlockAnecdotes(notify = true) {
    if (!currentUser) {
        if (notify) {
            showToast('🔒 Connecte-toi pour débloquer cette section', 'error');
            openAuthModal('login');
        }
        return;
    }

    const section = $('anecdotes');
    const navItem = $('nav-anecdotes');
    const wasHidden = section.classList.contains('hidden-section');

    section.classList.remove('hidden-section');
    navItem.classList.remove('hidden-section');

    if (notify && wasHidden) {
        section.classList.add('just-unlocked');
        showToast('✨ Code secret trouvé ! Section Anecdotes débloquée !', 'secret-anecdotes');
        setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 600);
        setTimeout(() => section.classList.remove('just-unlocked'), 1000);

        if (!currentProfile.unlocks?.secretCode) {
            try {
                await updateDoc(doc(db, 'users', currentUser.uid), {
                    'unlocks.secretCode': true
                });
                currentProfile.unlocks = { ...currentProfile.unlocks, secretCode: true };
            } catch (e) {
                console.error('Sauvegarde unlock secretCode échouée:', e);
            }
        }
    } else if (notify && !wasHidden) {
        showToast('✨ Anecdotes déjà débloquées !', 'secret-anecdotes');
    }
}

// ============================================================
// 13. MESSAGE CONSOLE — pour les curieux
// ============================================================
console.log('%c🏐 VOLLEY UNIVERS', 'font-size: 24px; font-weight: bold; color: #ff5a1f;');
console.log('%cIndice : essaie le code Konami sur cette page (↑↑↓↓←→←→BA)', 'color: #4a5568; font-style: italic;');
console.log('%cEt il y a un autre secret caché dans le quiz... 🤫', 'color: #4a5568; font-style: italic;');
