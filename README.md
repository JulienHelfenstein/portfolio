# Portfolio — Julien Helfenstein

Portfolio interactif (Next.js 16, React Three Fiber, GSAP, Motion, Lenis) : constellation 3D des projets, récit au scroll, grille filtrable et fiches détaillées.

## Lancer en local

```bash
npm install
cp .env.example .env.local   # puis renseigner PRIVATE_ACCESS_TOKEN
npm run dev
```

## Deux niveaux de contenu

| Tier | Contenu | URL |
|---|---|---|
| Public | `content/public/*.mdx` — fiches anonymisées | `/`, `/projects/<slug>` |
| Privé | `content/private/*.mdx` — vrais clients | `/private`, `/private/projects/<slug>` |

L'espace privé est protégé par `src/proxy.ts`. Pour y donner accès, partager le lien :

```
https://<domaine>/access?key=<PRIVATE_ACCESS_TOKEN>
```

Il pose un cookie httpOnly de 30 jours. Changer `PRIVATE_ACCESS_TOKEN` révoque tous les accès donnés.

## Ajouter un projet

Lancer la skill `portfolio-card` (`.claude/skills/portfolio-card/`) sur le repo du projet : elle génère les deux versions de la fiche. Relire, compléter les `TODO`, puis ajouter le slug dans `src/lib/profile.ts` (`featured`) s'il doit apparaître dans les projets phares.

## Déploiement (Vercel)

```bash
vercel link
vercel env add PRIVATE_ACCESS_TOKEN production
vercel deploy          # preview
vercel deploy --prod   # production
```
