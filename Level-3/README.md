# Niveau 3 (Advanced) — Codveda Front-End Internship

Livrables du **Niveau 3**, réalisés par **Tiomela Zangue Jorel**.

> Le brief demande **2 tâches sur 3** par niveau. Les tâches **2** et **3** constituent
> la soumission.

Ouvrir `Level-3/index.html` pour le sommaire des deux projets.

---

## Pourquoi ces deux tâches

**Tâche 1 — Custom Component Library : écartée, et signalée à l'équipe.** La page du
brief est contradictoire. Le paragraphe de description demande *« Build a fully
functional web application using Django that includes user authentication »*, alors que
le titre et les quatre objectifs juste en dessous portent sur une bibliothèque de
composants documentée avec Storybook et publiée sur NPM. Ce sont deux projets sans
rapport, et le premier n'appartient pas au domaine front-end. La question a été posée à
l'équipe Codveda ; en attendant une réponse, les deux tâches non ambiguës ont été
traitées.

---

## Tâche 2 — Performance Optimization

[`task-2-performance/`](task-2-performance/) · [notes détaillées](task-2-performance/README.md)

Optimisation de la landing page du Niveau 1, **mesurée** avec Lighthouse avant et après.
La version d'origine non modifiée est conservée dans `before/` pour que la comparaison
reste reproductible.

Les résultats générés sont dans
[`task-2-performance/reports/comparison.md`](task-2-performance/reports/comparison.md).

Points principaux :

- **Polices auto-hébergées** — supprime une chaîne série de quatre allers-retours vers
  deux domaines tiers avant le premier texte affiché
- **Deux graisses mortes retirées** — la page demandait sept faces et n'en appliquait
  que cinq ; Inter pèse 48 kB par graisse
- **CSS critique inliné** — un aller-retour au lieu de deux avant le premier rendu
- **WebP lossless, conservé seulement quand il gagne** — le lossy sortait 84 % *plus
  lourd* sur ces aplats en palette
- **Lazy loading ciblé**, cache immuable sur les ressources hachées

## Tâche 3 — Advanced Animations

[`task-3-animations/`](task-3-animations/) · [notes détaillées](task-3-animations/README.md)

Animations pilotées par le scroll avec **GSAP 3** et **ScrollTrigger** : timeline
d'entrée, grille en cascade, section épinglée scrubbée par la barre de défilement,
compteurs tweenés et boutons magnétiques.

Trois règles tenues d'un bout à l'autre :

- **Rien n'est masqué par le CSS** — si le CDN tombe ou si JS est bloqué, la page reste
  complète et lisible
- **Uniquement `transform` et `opacity`** — aucune frame ne déclenche de layout ni de
  paint
- **Le mouvement est révocable** — `prefers-reduced-motion` via `gsap.matchMedia()`,
  **plus** un interrupteur visible dans l'en-tête, parce que le réglage système n'est pas
  toujours celui qu'on veut sur une page donnée

---

## Prérequis

La tâche 3 s'ouvre directement dans un navigateur, sans installation.

La tâche 2 nécessite Node pour rejouer le build et l'audit :

```bash
cd Level-3/task-2-performance
npm install
npm run build && npm run audit
```

Le build optimisé (`task-2-performance/after/`) est versionné, il est donc consultable
sans rien installer.
