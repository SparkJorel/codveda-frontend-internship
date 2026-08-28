# Niveau 2 (Intermediate) — Codveda Front-End Internship

Livrables du **Niveau 2**, réalisés par **Tiomela Zangue Jorel**.

> Le brief demande **2 tâches sur 3** par niveau. Les tâches **1** et **2** constituent
> la soumission ; la tâche **3** est couverte en bonus par la personnalisation du thème
> Tailwind.

---

## Lancer le projet

```bash
cd Level-2
npm install
npm run dev        # serveur de développement
npm run build      # build de production dans dist/
npm run preview    # sert le build de production
```

---

## Tâche 1 — Single Page Application

Application React avec **quatre routes** — Home, About, Explore et Contact — plus une
page 404. Navigation entièrement côté client, sans rechargement.

| Objectif du brief | Où c'est traité |
|---|---|
| React Router pour la navigation | `react-router-dom` v7, routes déclarées dans `src/App.jsx` |
| État maintenu entre les pages | `src/context/AppContext.jsx` — React Context au-dessus du routeur |
| Navigation rapide et transitions fluides | Animation `route-in` sur chaque vue, remise à zéro du scroll et déplacement du focus à chaque changement de route |
| Déploiement sur Netlify ou Vercel | `vercel.json` fourni (voir plus bas) |

**Comment l'état inter-pages se vérifie.** Sur `/explore`, enregistre un dépôt : le
compteur dans l'en-tête s'incrémente. Va sur `/about`, reviens — la liste est intacte.
Elle survit aussi à un rechargement, car le contexte est répliqué dans `localStorage`.
C'est la démonstration concrète que l'état vit au-dessus du routeur, pas dans une page.

**Accessibilité de la navigation.** Un changement de route côté client ne réinitialise
pas le scroll et n'annonce rien aux lecteurs d'écran. `src/App.jsx` remet le scroll en
haut et déplace le focus sur `<main>` à chaque navigation.

---

## Tâche 2 — Intégration d'une API REST

Recherche en direct sur l'**API REST publique de GitHub** (`/search/repositories`),
sans clé d'API.

| Objectif du brief | Où c'est traité |
|---|---|
| Axios ou Fetch pour récupérer les données | `fetch` natif dans `src/lib/github.js` — aucune dépendance ajoutée |
| Contenu dynamique selon la saisie | Recherche par mot-clé + filtre par langage |
| États de chargement et d'erreur gérés | `src/components/StateMessage.jsx` — squelettes, erreurs, résultat vide |
| Recherche optimisée par debounce | `src/hooks/useDebounce.js`, 400 ms |

**Pourquoi le debounce est nécessaire ici.** L'API de recherche GitHub non authentifiée
autorise **10 requêtes par minute**. Taper « react » sans debounce en consomme cinq ;
avec, une seule.

**Requêtes périmées.** Chaque recherche crée un `AbortController` et annule la
précédente. Sans cela, une réponse lente partie tôt peut arriver après une réponse
rapide partie plus tard et écraser les bons résultats.

**Gestion fine des erreurs.** `ApiError` distingue les cas : un `403` sur cet endpoint
est presque toujours la limite de débit, pas un problème de permission — il reçoit donc
son propre message, avec un bouton de réessai.

---

## Tâche 3 — Framework CSS *(bonus)*

**Tailwind CSS v4** avec un thème entièrement redéfini dans `src/index.css`.

Le bloc `@theme` remplace la palette, les polices et les rayons par défaut de Tailwind
par les tokens de Codveda. Les classes utilitaires parlent donc le langage de la marque :
`bg-accent`, `text-ink`, `border-line`, `bg-brand-amber` — et non `bg-blue-600`.

| Objectif du brief | Où c'est traité |
|---|---|
| Composants pré-construits | Utilitaires Tailwind + composants `.card`, `.chip`, `.btn`, `.eyebrow` dans `@layer components` |
| Couleurs, typographie et espacements personnalisés | Bloc `@theme` — 16 couleurs, 2 familles de polices, rayon de 4 px |
| Cohérence sur tous les éléments | Mêmes tokens que le Niveau 1, à l'identique |
| Responsive et accessibilité | Breakpoints Tailwind, `prefers-reduced-motion`, focus visible, contrastes AA |

---

## Déploiement sur Vercel

Le dépôt contient déjà `vercel.json` avec la réécriture SPA (toutes les routes vers
`index.html`, sans quoi un rafraîchissement sur `/about` renverrait un 404) et des
en-têtes de cache immuables sur `/assets`.

1. Sur [vercel.com](https://vercel.com), **Add New → Project**
2. Importer le dépôt `codveda-frontend-internship`
3. Renseigner **Root Directory** : `Level-2`
4. Vercel détecte Vite automatiquement — `npm run build`, sortie `dist`
5. Deploy

---

## Choix techniques

**Pas d'Axios.** Le brief propose « Axios ou Fetch ». `fetch` est natif, gère
`AbortController` nativement et évite 15 Ko de dépendance pour trois requêtes.

**Pas de librairie de state.** Le brief demande « React Context ou Vuex ». Le périmètre
— une liste de favoris et un historique de recherche — ne justifie pas Redux ou Zustand.

## Accessibilité

- Skip link, focus déplacé sur `<main>` à chaque changement de route
- `role="alert"` sur les erreurs, `aria-live` sur le compte de résultats
- `aria-pressed` sur le bouton d'enregistrement, `aria-invalid` et `aria-describedby` sur le formulaire
- `prefers-reduced-motion: reduce` respecté
- Contrastes AA : texte coloré limité à `#2563EB` et `#103EB2`
