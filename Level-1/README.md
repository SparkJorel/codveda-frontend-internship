# Niveau 1 (Basic) — Codveda Front-End Internship

Livrables du **Niveau 1** du stage Front-End Development chez **Codveda Technologies**.
Réalisé par **Tiomela Zangue Jorel**.

> Le brief demande de compléter **2 tâches sur 3** par niveau.
> Les tâches **1** et **2** constituent la soumission officielle ; la tâche **3** est
> incluse en bonus.

---

## Lancer les projets

Aucune dépendance, aucun build. Il suffit d'ouvrir un fichier dans le navigateur :

```text
Level-1/index.html          ← page d'accueil qui relie les 3 projets
```

Pour un rendu 100 % fidèle (les polices Google Fonts se chargent par HTTP),
préférer un petit serveur local :

```bash
# depuis le dossier Level-1/
python -m http.server 8000
# puis ouvrir http://localhost:8000
```

---

## Fidélité à la marque

Rien n'est inventé : le logo, les couleurs, les typographies **et le contenu**
proviennent des sources officielles Codveda.

### Logo

Deux fichiers officiels, **aucun n'a été modifié** :

- `assets/codveda-logo.png` — le wordmark, depuis `codveda.com/wp-content/uploads/2025/07/cropped-1.png`
- `assets/favicon.png` — le favicon, depuis `.../cropped-codveda-3-192x192.png`

Le wordmark est **blanc sur fond transparent** : il ne fonctionne que sur fond sombre.
Le thème étant clair, c'est le **favicon officiel** qui sert de marque — ses trois formes
et sa croix noire sont justement dessinées pour un fond clair — accompagné du nom
« Codveda Technologies » composé en **Poppins**, la typo officielle de Codveda. Aucun
pixel des deux assets n'est retouché.

### Couleurs

Direction assumée : **clair, minimaliste, professionnel**. Aucun dégradé, aucune texture,
aucune ombre. Le bleu Codveda est la **seule** couleur de la page.

| Rôle | Hex | Source |
|---|---|---|
| Fond de page | `#F9FBFF` | couleur claire officielle Codveda |
| Cartes, panneaux, champs | `#FFFFFF` | — |
| Titres | `#1B1F29` | couleur sombre officielle Codveda |
| Texte courant | `#4B4F58` | couleur de texte officielle Codveda |
| Libellés, métadonnées | `#676D79` | dérivée, pour respecter AA |
| Filets, bordures | `#E0E3EB` | couleur de bordure officielle Codveda |
| Accent | `#2563EB` | primaire officielle Codveda |
| Accent survol | `#103EB2` | bleu profond officiel Codveda |
| Erreurs de validation | `#D92020` | rouge du logo, assombri pour AA sur blanc |

**Profondeur sans ombre.** La page repose sur `#F9FBFF` et les cartes sont en blanc pur
par-dessus. Un seul cran de luminosité fait le travail qu'une ombre portée ferait
d'habitude — principe repris de la mise en page de `rpjminfo.com`.

**Note contraste :** tous les couples texte/fond dépassent 4,5:1 (AA). `#2563EB` sur
`#F9FBFF` donne 4,9:1 ; `#676D79` donne 5,0:1 ; `#D92020` donne 4,9:1.

### Typographie

**Poppins** et **Inter** — exactement les deux familles que `codveda.com` charge
lui-même. Poppins pour les titres, le corps et le nom dans le lockup ; Inter pour les
libellés d'interface, boutons et métadonnées.

### Mise en page

Grille **12 colonnes** avec des spans volontairement irréguliers (6·3·3 puis 4·4·4 pour
les services, 7·5 pour mission/vision, 5·7 et 4·8 pour les en-têtes de section). C'est
ce rythme inégal qui donne un rendu éditorial plutôt qu'un effet template en trois
colonnes. En dessous de 1000 px la grille retombe à 2 colonnes, puis à 1 sur mobile.

### Contenu

Tous les textes, chiffres et témoignages de la Tâche 1 sont repris des pages
`codveda.com`, `/about-us/`, `/services/` et `/internships/` :

- Baseline « Empowering Growth with IT Innovation » / « Transforming Education, Careers & Technology »
- Mission et vision, mot pour mot
- Chiffres d'impact : 1 800+ interns · 200+ stipend scholars · 50+ mentors · 20+ clients
- Les 6 services réels avec leurs sous-prestations
- Les 4 tracks de stage (1 mois, remote)
- Les 3 témoignages étudiants publiés, avec leurs noms et rôles
- Numéros AICTE, MSME et ISO 9001:2015
- Adresse : Chandrapur, Maharashtra

Les pages portent la mention « Student recreation » dans leur pied de page : c'est un
exercice de stage, pas le site officiel.

---

## Tâche 1 — Responsive Landing Page

`task-1-landing-page/`

Landing page complète : navigation, hero, à propos (mission/vision + impact),
6 services, 4 tracks de stage, témoignages, CTA et footer avec les enregistrements
officiels.

| Objectif du brief | Où c'est traité |
|---|---|
| Balises HTML sémantiques (accessibilité + SEO) | `header` / `nav` / `main` / `section` / `article` / `aside` / `figure` / `blockquote` / `footer`, hiérarchie h1→h3, skip link, `aria-label`, JSON-LD `Organization`, meta description + Open Graph |
| CSS Flexbox ou Grid | Grid pour le hero, les services, les stats, les témoignages et le footer ; Flexbox pour la nav, les boutons et les tags |
| Responsive mobile-first + media queries | Styles de base = mobile ; breakpoints `min-width: 45em` (tablette) et `62.5em` (desktop) |
| Smooth scrolling + animations | `scroll-behavior: smooth` + fallback JS avec offset d'en-tête, révélation au scroll (IntersectionObserver), compteurs animés, entrée en cascade du hero |

**Points additionnels :** barre de progression de scroll, en-tête collant, menu plein
écran sur mobile (fermable avec `Échap`), et respect complet de
`prefers-reduced-motion`.

---

## Tâche 2 — Interactive Form

`task-2-interactive-form/`

Création de compte pour candidater à un stage : nom, email, téléphone, mot de passe,
confirmation et acceptation des CGU.

| Objectif du brief | Où c'est traité |
|---|---|
| Validation des champs | 6 validateurs dans `js/validation.js` : champs requis, format email, téléphone 8–15 chiffres, force du mot de passe, correspondance des deux mots de passe |
| Messages d'erreur dynamiques sans rechargement | `e.preventDefault()` sur le submit ; chaque erreur est injectée dans un `<p role="alert">` associé via `aria-describedby` |
| Événements focus et blur | `focus` → surlignage du label ; `blur` → première validation du champ ; ensuite `input` revalide à chaque frappe |
| Style propre et professionnel | Même système de marque que la tâche 1, rouge `#FF3131` réservé exclusivement aux erreurs |

**Logique de validation retenue.** Un champ n'est jugé qu'après l'avoir *quitté*
une première fois (`blur`). Ensuite seulement, il se revalide à chaque frappe.
On évite ainsi d'afficher « email invalide » à quelqu'un qui vient de taper la
lettre « j ».

**Points additionnels :** jauge de force du mot de passe en 4 niveaux (rouge pour un
mot de passe faible, puis neutre, puis bleu Codveda quand il est réellement solide),
checklist des critères qui se cochent en direct, bouton afficher/masquer, secousse des champs fautifs au submit
avec focus sur le premier, état de chargement, écran de confirmation animé, région
`aria-live` pour les lecteurs d'écran.

---

## Tâche 3 — Basic DOM Manipulation *(bonus)*

`task-3-counter/`

Compteur en JavaScript vanilla.

| Objectif du brief | Où c'est traité |
|---|---|
| Mise à jour dynamique du DOM | Un objet `state` unique ; `render()` pousse l'état dans le DOM. Aucune lecture de la valeur depuis le HTML → pas de désynchronisation possible |
| Écouteurs d'événements | Clics sur `+`, `−`, reset, changement de pas, et raccourcis clavier `↑` `↓` `+` `−` `R` |
| Ne jamais descendre sous zéro | Double garde : le bouton `−` est `disabled` à 0 **et** `change()` refuse la valeur négative — un raccourci clavier ne peut donc pas contourner l'UI |
| Design minimaliste | Un grand chiffre, deux contrôles, un reset. Le chiffre passe en gris à zéro |

**Points additionnels :** pas configurable (1 / 5 / 10), animation directionnelle du
chiffre, statistiques (clics, maximum atteint), `aria-live` sur l'affichage.

---

## Accessibilité

- Navigation complète au clavier, `:focus-visible` visible partout
- Skip links sur les tâches 1 et 2
- `aria-live` / `role="alert"` pour tout changement d'état annoncé
- `aria-invalid`, `aria-describedby`, `aria-expanded`, `aria-pressed` sur les contrôles concernés
- `prefers-reduced-motion: reduce` respecté dans les trois projets
- Contrastes conformes AA (voir la note sur `#7296F2` plus haut)

## Compatibilité

Chrome, Edge, Firefox et Safari récents. Aucun framework, aucune dépendance NPM :
les pages fonctionnent en ouvrant simplement le fichier HTML.
