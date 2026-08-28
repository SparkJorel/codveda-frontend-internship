# Niveau 3 · Tâche 2 — Performance Optimization

Optimisation de la landing page du Niveau 1, **mesurée** avec Lighthouse avant et après
plutôt qu'affirmée.

```
before/    la page du Niveau 1, non modifiée — la référence
after/     le build optimisé, produit par build.mjs
reports/   les résultats Lighthouse et le tableau comparatif
```

---

## Reproduire la mesure

```bash
cd Level-3/task-2-performance
npm install

npm run build     # produit after/ à partir de before/
npm run audit     # Lighthouse sur les deux, 3 runs chacun
npm run report    # régénère le tableau sans réauditer
```

L'audit sert les deux versions **depuis la même machine locale**, avec le même preset
mobile Lighthouse. Aucune des deux ne bénéficie d'un CDN que l'autre n'aurait pas.

**Trois runs, médiane retenue.** Un passage unique de Lighthouse varie beaucoup sur une
machine de développement : les trois runs de la version d'origine ont donné 64, 86 et 82.
Publier le meilleur aurait été malhonnête.

---

## Couverture du brief

| Objectif | Ce qui a été fait |
|---|---|
| Images en formats modernes + lazy loading | WebP **lossless** avec repli PNG via `<picture>`, `loading="lazy"` et `decoding="async"` sous la ligne de flottaison |
| Minifier et bundler JS/CSS | esbuild : CSS −35 %, JS −52 %, HTML minifié |
| Stratégie de cache | `after/_headers` + en-têtes équivalents dans `serve.mjs` : immuable un an sur les polices et images, `no-cache` sur le HTML |
| Réduire les ressources bloquantes | Polices auto-hébergées, CSS critique inliné, chaîne de requêtes bloquantes supprimée |

---

## Les optimisations, par ordre d'impact

### 1. Auto-hébergement des polices — le gros morceau

La page d'origine charge une feuille de style depuis `fonts.googleapis.com`. Cette
requête **bloque le rendu**, et pendant ce temps le navigateur doit résoudre le DNS,
négocier le TLS, télécharger le CSS — et seulement **ensuite** découvrir que les fichiers
de police sont sur un **second** domaine, `fonts.gstatic.com`, qu'il faut résoudre et
négocier à son tour.

C'est une chaîne série de quatre allers-retours avant le premier texte affiché. En
servant les `woff2` depuis notre propre domaine et en inlinant les `@font-face`, cette
chaîne disparaît, et les deux polices visibles au-dessus de la ligne de flottaison sont
`preload`ées pour partir en parallèle du parsing HTML.

### 2. Deux polices étaient téléchargées pour rien

En auditant la version d'origine, j'ai constaté qu'elle demande **sept** graisses alors
que le CSS n'en applique que **cinq** : `Inter 400` et `Poppins 700` n'apparaissent dans
aucune règle.

Ce n'est pas anodin : les fichiers Inter pèsent **48 kB par graisse**, contre 8 kB pour
Poppins. Retirer ces deux faces mortes économise environ **56 kB** sans le moindre
changement visuel.

### 3. CSS critique inliné

Après le traitement des polices, la feuille de style restait la dernière requête
bloquante. Elle est désormais inlinée dans le `<head>` : le navigateur peut peindre à
partir de la seule réponse HTML, soit **un aller-retour au lieu de deux**. Le CSS minifié
et gzippé reste bien sous les ~14 kB de la première fenêtre de congestion TCP, ce qui
rend l'inlining clairement gagnant ici.

### 4. WebP — mais seulement quand il gagne réellement

Premier essai en WebP **lossy** qualité 88 : le résultat était **84 % plus lourd** que le
PNG source. Logique — ce sont des aplats de couleur en palette, avec des bords nets ;
c'est exactement le cas où le PNG excelle et où la compression photographique échoue.

Le pipeline utilise donc le **WebP lossless** et, surtout, **ne garde le WebP que s'il
est effectivement plus petit** (`build.mjs`, fonction `convertImages`). Ici il gagne
21 %. Livrer un « format moderne » plus lourd que l'original aurait été une régression
déguisée en optimisation.

### 5. Lazy loading ciblé

`loading="lazy"` sur les images sous la ligne de flottaison uniquement. Le logo de
l'en-tête reste en chargement immédiat avec `fetchpriority="high"` : le lazy-loader
retarderait le premier rendu de l'élément le plus visible de la page.

### 6. Cache

`after/_headers` (format Netlify/Vercel) : un an en `immutable` sur les polices et
images, une semaine sur le JS, `no-cache` sur le HTML — sans quoi un déploiement
n'atteindrait jamais un visiteur récurrent. `serve.mjs` envoie les mêmes en-têtes, pour
que la stratégie soit réellement exercée pendant l'audit et pas seulement décrite ici.

---

## Résultats

Voir **[`reports/comparison.md`](reports/comparison.md)** pour le tableau généré, et
`reports/before.json` / `reports/after.json` pour le détail.

---

## Une limite, énoncée franchement

Le **poids total transféré augmente** avec l'auto-hébergement des polices. C'est un
arbitrage assumé : on échange des octets contre des allers-retours. Sur une connexion
mobile typique, la latence des quatre requêtes série vers deux domaines tiers coûte
beaucoup plus cher en temps perçu que quelques dizaines de kilo-octets supplémentaires
servis en parallèle depuis notre propre domaine — ce que confirment les métriques LCP et
Speed Index.

La réduction à cinq graisses (point 2) limite cet écart, mais ne l'annule pas. Une étape
supplémentaire serait de sous-ensembler les polices aux seuls glyphes réellement
présents dans la page, avec un outil comme `glyphhanger` — hors périmètre ici, mais c'est
la suite logique.
