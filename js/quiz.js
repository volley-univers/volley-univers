// ============================================================
// quiz.js — Banque de questions + logique du quiz
// ------------------------------------------------------------
// Questions classées par niveau (debutant, intermediaire, expert).
// Chaque question : { q, choix[4], bonne (index 0-3), explication }
//
// Pour ajouter des questions : il suffit de pousser un objet
// dans le tableau correspondant. Aucun autre fichier à modifier.
// ============================================================

export const QUESTIONS = {
  // ----------------------- DÉBUTANT -----------------------
  debutant: [
    {
      q: "Combien de joueurs composent une équipe de volley-ball sur le terrain ?",
      choix: ["4", "5", "6", "7"],
      bonne: 2,
      explication: "Une équipe aligne 6 joueurs : 3 à l'avant et 3 à l'arrière."
    },
    {
      q: "Combien de touches de balle maximum sont autorisées par équipe avant de renvoyer la balle ?",
      choix: ["2", "3", "4", "Pas de limite"],
      bonne: 1,
      explication: "Une équipe a droit à 3 touches : réception, passe, attaque (classiquement)."
    },
    {
      q: "Comment s'appelle le joueur défensif spécialisé portant un maillot différent ?",
      choix: ["Pointu", "Passeur", "Libéro", "Central"],
      bonne: 2,
      explication: "Le libéro est un joueur défensif qui ne peut ni attaquer ni servir, reconnaissable à son maillot de couleur différente."
    },
    {
      q: "À combien de points se gagne un set en volley-ball classique ?",
      choix: ["15 points", "21 points", "25 points", "30 points"],
      bonne: 2,
      explication: "Un set se joue en 25 points (avec 2 points d'écart). Le tie-break se joue en 15 points."
    },
    {
      q: "Combien de sets faut-il gagner pour remporter un match ?",
      choix: ["2", "3", "4", "5"],
      bonne: 1,
      explication: "Il faut remporter 3 sets sur 5 maximum."
    },
    {
      q: "Comment s'appelle l'action de frapper la balle au-dessus du filet pour marquer ?",
      choix: ["Le service", "Le smash", "La passe", "Le bloc"],
      bonne: 1,
      explication: "Le smash (ou attaque) est la frappe puissante effectuée au-dessus du filet."
    },
    {
      q: "Quelle est la hauteur du filet en volley masculin senior ?",
      choix: ["2,24 m", "2,35 m", "2,43 m", "2,50 m"],
      bonne: 2,
      explication: "Le filet mesure 2,43 m chez les hommes seniors, et 2,24 m chez les femmes."
    },
    {
      q: "Quelle action consiste à sauter pour empêcher l'attaque adverse ?",
      choix: ["La passe", "Le service", "Le contre", "Le smash"],
      bonne: 2,
      explication: "Le contre (ou bloc) sert à intercepter l'attaque adverse au-dessus du filet."
    },
    {
      q: "Qui sert en premier dans un set ?",
      choix: [
        "L'équipe qui a gagné le set précédent",
        "L'équipe choisie par tirage au sort",
        "L'équipe qui reçoit",
        "Toujours l'équipe locale"
      ],
      bonne: 0,
      explication: "L'équipe gagnante du set précédent sert au début du set suivant. Pour le 1er set, c'est un tirage au sort."
    },
    {
      q: "Combien d'arbitres officient sur un match officiel ?",
      choix: ["1", "2", "4", "Plus de 4"],
      bonne: 3,
      explication: "Un match officiel implique souvent 2 arbitres principaux, un marqueur et plusieurs juges de ligne."
    }
  ],

  // ----------------------- INTERMÉDIAIRE -----------------------
  intermediaire: [
    {
      q: "Quel poste a pour rôle principal de distribuer le jeu en faisant la 2ème touche ?",
      choix: ["Le central", "Le passeur", "Le réceptionneur-attaquant", "Le pointu"],
      bonne: 1,
      explication: "Le passeur est le distributeur de l'équipe, l'équivalent du meneur au basket."
    },
    {
      q: "Que signifie l'expression \"faire un ace\" ?",
      choix: [
        "Marquer un point directement sur le service",
        "Réaliser 3 smashs consécutifs",
        "Bloquer trois balles d'affilée",
        "Recevoir parfaitement"
      ],
      bonne: 0,
      explication: "Un ace est un service direct qui n'est ni touché correctement ni renvoyé par l'adversaire."
    },
    {
      q: "Quel pays a remporté la médaille d'or olympique de volley masculin à Paris 2024 ?",
      choix: ["Pologne", "États-Unis", "France", "Brésil"],
      bonne: 2,
      explication: "La France a conservé son titre olympique conquis à Tokyo 2020 en battant la Pologne en finale à Paris 2024."
    },
    {
      q: "Combien de remplacements une équipe peut-elle effectuer par set en règles FIVB ?",
      choix: ["3", "6", "8", "Illimité"],
      bonne: 1,
      explication: "Une équipe a droit à 6 remplacements par set (hors libéro)."
    },
    {
      q: "Quelle est la longueur d'un terrain de volley-ball ?",
      choix: ["16 m", "18 m", "20 m", "22 m"],
      bonne: 1,
      explication: "Le terrain mesure 18 m de long sur 9 m de large."
    },
    {
      q: "Que signifie la \"ligne d'attaque\" sur un terrain de volley ?",
      choix: [
        "La limite arrière du terrain",
        "Une ligne située à 3 m du filet",
        "La zone de service",
        "La ligne médiane"
      ],
      bonne: 1,
      explication: "La ligne d'attaque, à 3 m du filet, délimite la zone avant. Les arrières ne peuvent pas attaquer en sautant devant cette ligne."
    },
    {
      q: "Quelle action est appelée \"manchette\" en volley-ball ?",
      choix: [
        "Une touche de balle avec les avant-bras",
        "Une frappe à une main",
        "Un service flottant",
        "Un type de feinte"
      ],
      bonne: 0,
      explication: "La manchette consiste à frapper la balle avec les avant-bras serrés, surtout pour la réception."
    },
    {
      q: "À quel poste joue généralement le meilleur attaquant de l'équipe ?",
      choix: ["Central", "Libéro", "Pointu (opposé)", "Passeur"],
      bonne: 2,
      explication: "Le pointu (ou opposé) est le poste de l'attaquant principal, souvent le meilleur frappeur de l'équipe."
    },
    {
      q: "Quelle ville accueillait les championnats du monde de volley masculin 2025 ?",
      choix: ["Tokyo", "Manille", "Rome", "Paris"],
      bonne: 1,
      explication: "Les Championnats du monde masculins 2025 se sont tenus aux Philippines, avec une grande partie des matchs à Manille."
    },
    {
      q: "Que se passe-t-il si un joueur touche le filet pendant l'action de jeu ?",
      choix: [
        "Rien, c'est autorisé",
        "Avertissement uniquement",
        "Faute, point pour l'adversaire",
        "Le set est rejoué"
      ],
      bonne: 2,
      explication: "Toucher le filet pendant l'action de jouer la balle est une faute. Toutefois, depuis 2014, certains contacts mineurs sont tolérés."
    },
    {
      q: "Quel est le rôle principal du joueur central ?",
      choix: [
        "Faire les passes",
        "Servir uniquement",
        "Bloquer et attaquer au centre",
        "Recevoir tous les services"
      ],
      bonne: 2,
      explication: "Le central est l'expert du contre et des attaques rapides au centre du filet."
    },
    {
      q: "Quel type de service est très rapide et frappé en pleine course ?",
      choix: ["Service flottant", "Service smashé (en saut)", "Service tennis", "Service cuillère"],
      bonne: 1,
      explication: "Le service smashé en saut (jump serve) est le plus puissant et le plus utilisé en haut niveau."
    }
  ],

  // ----------------------- EXPERT -----------------------
  expert: [
    {
      q: "En quelle année le rally point system (point à chaque échange) a-t-il été adopté officiellement ?",
      choix: ["1992", "1998", "2000", "2005"],
      bonne: 1,
      explication: "Le rally point system a été adopté en 1998, remplaçant le système où seul le serveur pouvait marquer."
    },
    {
      q: "Quel joueur est considéré comme l'un des plus grands passeurs brésiliens, surnommé \"Bruninho\" ?",
      choix: ["Giba", "Bruno Rezende", "Wallace de Souza", "Lucas Saatkamp"],
      bonne: 1,
      explication: "Bruno Rezende, dit Bruninho, fils de Bernardinho, a été le passeur clé du Brésil pendant plus d'une décennie."
    },
    {
      q: "Quel pays a remporté le plus de titres mondiaux masculins de l'histoire ?",
      choix: ["Brésil", "URSS / Russie", "Italie", "États-Unis"],
      bonne: 1,
      explication: "L'URSS puis la Russie totalisent le plus de titres mondiaux masculins, devant l'Italie et le Brésil."
    },
    {
      q: "Quelle est la durée maximale d'un temps mort technique en FIVB (quand il est joué) ?",
      choix: ["30 secondes", "60 secondes", "90 secondes", "Variable selon le set"],
      bonne: 1,
      explication: "Le temps mort technique dure 60 secondes. Les temps morts classiques sont de 30 secondes."
    },
    {
      q: "Quelle innovation tactique a marqué le volley féminin à la fin des années 1990 ?",
      choix: [
        "Le bloc en cloche",
        "L'attaque pipe par l'arrière",
        "Le service à deux mains",
        "Le contre offensif à 3 joueuses"
      ],
      bonne: 1,
      explication: "Le \"pipe\" (attaque par l'arrière en zone centrale) s'est généralisé pour augmenter la diversité offensive."
    },
    {
      q: "Quel club français a remporté le plus de titres de champion de France hommes ?",
      choix: ["Tours VB", "Paris Volley", "Cannes VB", "Montpellier"],
      bonne: 0,
      explication: "Tours Volley-Ball est le club le plus titré du championnat de France masculin."
    },
    {
      q: "Quelle joueuse italienne, devenue iconique, a été élue meilleure joueuse aux JO de Paris 2024 ?",
      choix: ["Paola Egonu", "Miriam Sylla", "Anna Danesi", "Caterina Bosetti"],
      bonne: 0,
      explication: "Paola Egonu a été la grande star de la victoire italienne (premier titre olympique féminin de l'Italie) aux JO 2024."
    },
    {
      q: "Quel est le surnom officieux de l'équipe de France masculine ?",
      choix: ["Les Bleus", "Les Experts", "Les Volleyeurs", "Les Frenchies"],
      bonne: 0,
      explication: "Comme la plupart des équipes nationales françaises, ils sont simplement appelés \"Les Bleus\"."
    },
    {
      q: "Combien pèse réglementairement un ballon de volley-ball officiel ?",
      choix: ["180-200 g", "230-250 g", "260-280 g", "300-320 g"],
      bonne: 2,
      explication: "Un ballon officiel pèse entre 260 et 280 grammes."
    },
    {
      q: "Quel championnat européen de clubs est le plus prestigieux ?",
      choix: ["Coupe CEV", "Challenge Cup", "Champions League CEV", "Euroligue"],
      bonne: 2,
      explication: "La CEV Champions League est l'équivalent de la Ligue des champions de football pour le volley."
    },
    {
      q: "Quel libéro brésilien est considéré comme l'un des meilleurs de tous les temps ?",
      choix: ["Sergio Santos", "Lipe", "Murilo", "Dante Amaral"],
      bonne: 0,
      explication: "Sergio Santos, surnommé Serginho, est élu meilleur libéro de l'histoire selon de nombreux classements FIVB."
    },
    {
      q: "Quel est le nom de la compétition mondiale annuelle de volley FIVB ?",
      choix: ["World Grand Prix", "Nations League (VNL)", "World League", "Grand Champions Cup"],
      bonne: 1,
      explication: "Depuis 2018, la Volleyball Nations League (VNL) a remplacé la World League et le World Grand Prix."
    },
    {
      q: "Lors d'un set, à partir de combien de points l'équipe \"tourne\" au service ?",
      choix: [
        "Quand elle reprend le service après l'avoir perdu",
        "Tous les 5 points",
        "Lors de chaque temps mort",
        "Au choix du capitaine"
      ],
      bonne: 0,
      explication: "L'équipe effectue une rotation horaire (d'une position) à chaque fois qu'elle reprend le service à l'adversaire."
    }
  ]
};

// ----------------------------------------------------------------
// Tirage : on prend N questions au hasard d'un niveau donné
// Les questions custom Firestore (passées en argument) sont fusionnées
// avec la banque locale avant tirage.
// ----------------------------------------------------------------
export function tirerQuiz(niveau, nb = 10, questionsCustom = []) {
  const banque = [...(QUESTIONS[niveau] || [])];
  // Fusion des questions custom (filtrées par niveau)
  for (const c of questionsCustom) {
    if (c.niveau === niveau) {
      banque.push({
        q: c.q,
        choix: c.choix,
        bonne: c.bonne,
        explication: c.explication
      });
    }
  }
  const copie = [...banque];
  // Mélange Fisher-Yates
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie.slice(0, Math.min(nb, copie.length));
}

// ----------------------------------------------------------------
// Génère le message final selon le pourcentage
// ----------------------------------------------------------------
export function messageFinal(pourcentage) {
  if (pourcentage < 30)
    return { titre: "Encore un peu d'entraînement", ton: "warn" };
  if (pourcentage < 70)
    return { titre: "Pas mal !", ton: "ok" };
  return { titre: "Expert du volley", ton: "win" };
}

// Formatage temps mm:ss
export function formatTemps(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
