# Niveau 3 · Tâche 3 — Advanced Animations

Animations pilotées par le scroll et par le pointeur, construites avec **GSAP 3** et
**ScrollTrigger**.

Ouvrir `index.html` dans un navigateur. Aucune dépendance à installer — GSAP est chargé
depuis jsDelivr en `defer`.

---

## Couverture du brief

| Objectif | Où c'est traité |
|---|---|
| Animations fluides et performantes | Seuls `transform` et `opacity` sont animés — les deux sont gérés par le compositeur, donc aucune frame ne déclenche de layout ni de paint |
| Animations en timeline pour les séquences complexes | Timeline d'entrée du hero, et surtout la section épinglée avec `scrub` |
| Animations accessibles, qui ne gênent pas l'usage | `gsap.matchMedia()` sur `prefers-reduced-motion` **plus** un interrupteur visible dans l'en-tête |
| Impact minimal sur les performances | `gsap.quickTo()` pour le pointeur, `will-change` déclaré en CSS une fois, un seul ScrollTrigger pour toute la grille |

---

## Les cinq animations

**1. Timeline d'entrée du hero.** Les trois mots du titre montent derrière un masque
(`overflow: hidden` sur chaque ligne), en décalé, puis le texte et les boutons suivent.
Une seule timeline plutôt que cinq tweens indépendants : les décalages restent lisibles
et modifiables en un endroit.

**2. Dérive des formes du logo.** Les trois marques flottent en `yoyo` infini, avec une
durée différente chacune pour qu'elles ne se synchronisent jamais en pulsation.

**3. Section épinglée et scrubbée.** La pièce maîtresse. La section se fige, et la barre
de défilement devient la tête de lecture : `scrub: 0.6` lie la progression de la timeline
à la position de scroll. En remontant, la séquence se joue **à l'envers** — ce qui n'est
pas possible avec un simple déclencheur one-shot. Le compteur `01 / 04` se met à jour via
`onUpdate`.

**4. Compteurs tweenés.** GSAP anime un objet JavaScript ordinaire et le nombre est écrit
à chaque frame dans `onUpdate`. L'easing est donc exactement la même courbe que le reste
de la page, au lieu d'une interpolation linéaire faite à la main.

**5. Boutons magnétiques.** Le bouton suit le curseur avec un retard élastique.
`gsap.quickTo()` met le tween en cache : `pointermove` ne crée pas un nouvel objet tween
à chaque événement. Lié **uniquement** si `(pointer: fine)` correspond — les écrans
tactiles ne paient pas pour un comportement qu'ils ne peuvent pas utiliser.

---

## Les trois règles suivies

**1. Rien n'est masqué par le CSS.** La page se rend entièrement dans son état final et
lisible ; GSAP masque les éléments juste avant de les animer, avec `gsap.from()`. Si le
CDN tombe ou si JavaScript est bloqué, le visiteur obtient une page complète, pas un
écran blanc. Le script vérifie d'ailleurs la présence de `window.gsap` et sort
proprement.

**2. Uniquement `transform` et `opacity`.** Aucune animation ne touche `width`,
`height`, `top` ou `left`, qui forceraient un recalcul de layout à chaque frame.

**3. Le mouvement est révocable.** Deux niveaux :

- `gsap.matchMedia()` sur `prefers-reduced-motion` — quand la préférence système est
  active, GSAP annule tous les tweens et supprime tous les triggers ; rien ne tourne en
  arrière-plan.
- Un **interrupteur visible** dans l'en-tête. Le réglage système n'est pas toujours
  celui qu'on veut sur une page précise, et beaucoup d'utilisateurs ignorent qu'il
  existe. Le bouton force le contexte dans les deux sens et rebâtit les animations.

Dans les deux cas les compteurs sont peints instantanément à leur valeur finale : le
contenu reste accessible, seule l'animation disparaît.

---

## Détail technique

**Le recalcul après chargement des polices.** Les polices arrivent après le premier
rendu et changent la hauteur des éléments, ce qui décale tous les points de déclenchement
calculés par ScrollTrigger. `document.fonts.ready` déclenche un `ScrollTrigger.refresh()`
une fois qu'elles sont posées — sans ça, les animations se déclenchent au mauvais endroit
sur un chargement à froid.

**Pourquoi GSAP plutôt que Framer Motion.** Le brief propose les deux. Framer Motion est
une librairie React ; cette page est en HTML/CSS/JS natif, comme le Niveau 1. GSAP
fonctionne sans framework et ScrollTrigger reste la référence pour l'épinglage et le
scrub.
