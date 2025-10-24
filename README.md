# Le Loup et les 7 Chevreaux — Conte interactif

Présentation
------------
Application web interactive racontant le conte "Le Loup et les 7 Chevreaux" avec illustrations, narration audio et deux mini-jeux (trouver les chevreaux et glisser des cailloux). Le projet est implémenté en JavaScript (Vue 3 via CDN) et fonctionne sans build.

Structure du projet
-------------------
- [index.html](index.html) — page principale.
- [app.js](app.js) — logique principale de l'application (exporte le composant Vue [`app`](app.js)).
- [scenes.js](scenes.js) — données des scènes (exporte la constante [`scenes`](scenes.js)).
- [style.css](style.css) — styles et animations.
- assets/
  - audio/ — fichiers audio (narration et musique).
  - images/ — images des scènes et fonds.
- [.gitattributes](.gitattributes)

Prérequis
---------
- Navigateur moderne (Chrome, Firefox, Edge, Safari).
- (Optionnel) Serveur local pour gérer correctement les lectures audio depuis le filesystem.

Lancement
---------
1. Méthode simple : ouvrir [index.html](index.html) dans le navigateur (double-clic).  
   - Si certains navigateurs bloquent l'audio pour des fichiers locaux, lancer un serveur local.
2. Servir via un serveur local (ex. Node + http-server) :
   - Installer http-server si nécessaire :
     - npm i -g http-server
   - Lancer depuis le dossier du projet :
     - http-server -c-1
   - Ouvrir l'URL fournie (ex. http://127.0.0.1:8080).

Utilisation
-----------
- Navigation : flèches gauche/droite (boutons fixes).
- Musique : bouton en haut à droite pour activer/désactiver la musique d'ambiance.
- Mini-jeux :
  - Scène "trouver les chevreaux" : cliquer sur les zones interactives.
  - Scène "cailloux" : glisser-déposer les cailloux dans la zone (support tactile géré).

Développement
-------------
- Ouvrir le projet dans VS Code.
- Modifier [scenes.js](scenes.js) pour ajouter/éditer scènes, images, textes, ou mini-jeux.
- La logique principale se trouve dans [app.js](app.js) (méthodes de navigation, typing, drag & drop, narration).

Points d'attention
------------------
- Les fichiers audio sont nommés par numéro de scène (assets/audio/1.mp3, 2.mp3, ...). Vérifier que les fichiers existent si la narration ne se lance pas.
- Préchargement des images géré dans [app.js](app.js) ; attendre la fin du chargement avant d'interagir.

Licence
-------
Projet éducatif / personnel — adapter selon besoin.
