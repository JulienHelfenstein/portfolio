---
name: portfolio-card
description: Analyse un repo de projet (en lecture seule) et génère un brouillon de fiche portfolio en deux versions — publique anonymisée et privée — dans content/public et content/private. À utiliser pour ajouter ou rafraîchir un projet dans le portfolio. Mots-clés : portfolio, fiche projet, étude de cas, vitrine, ajouter un projet.
---

# portfolio-card

Transforme un repo en fiche projet pour le portfolio (Next.js, `C:\Users\julie\portfolio`).

## Entrées
- Chemin d'un ou plusieurs repos (le repo source est en **lecture seule** : ne jamais le modifier, ne jamais lancer d'install/build dedans).
- Optionnel : slug imposé, repos à fusionner en une seule fiche.

## Analyse (lecture seule)
1. README, docs/, docs/FEATURES.md, docs/adr/, CLAUDE.md s'ils existent.
2. package.json / pyproject.toml / requirements.txt → stack réelle.
3. Points d'entrée, structure (app/, pages, api, agents, prompts), infra (terraform/, Dockerfile, .github/workflows).
4. `git log --oneline | head -40`, `git log --reverse --format=%ci | head -1` et `git log -1 --format=%ci` → période ; `git shortlog -sn` → part de contribution (ne jamais écrire de noms de personnes dans la fiche).
5. Repérer captures/GIF/vidéos existants (png, gif, mp4 dans le repo) → les lister en `media` (chemins source), ne pas les copier.

**Ne jamais lire ni recopier** : `.env*`, secrets, clés, tfvars, jeux de données clients, dumps.

## Sorties
Deux fichiers MDX par projet :
- `content/private/<slug>.mdx` — version complète (vrai client, vrais noms de produits).
- `content/public/<slug>.mdx` — version anonymisée.

### Frontmatter (identique dans les deux, sauf `client`)
```yaml
---
slug: kebab-case
title: "Nom court du projet"           # public : pas de nom de client dans le titre
tagline: "Une phrase qui vend le problème résolu"
client: "Nom réel du client"           # private uniquement ; public : retirer la clé
clientAlias: "Groupe de luxe international"   # descripteur sectoriel, toujours présent
sector: "Luxe | Industrie | Immobilier | Services IT | Interne Saegus | ..."
period: "2026-03 → 2026-05"
status: "poc | pilote | production | interne | en cours"
role: "TODO"                            # à compléter par Julien si non déductible
team: "solo | équipe"                   # déduit de git shortlog, sans noms
domains: ["IA générative", "RAG", "Multi-agents", "Data", "DevOps", "Observabilité", "Outillage"]
stack: ["Next.js", "Azure OpenAI", "PostgreSQL"]
highlights: ["3 à 5 puces courtes et concrètes"]
metrics: []                             # uniquement des chiffres trouvés dans le repo ; sinon []
media: []                               # chemins source des captures trouvées
featuredScore: 1-5                      # ton avis : impact + originalité + démontrabilité
confidential: true                      # true si client externe
sources: ["poc-xxx"]                    # dossiers repo d'origine
---
```

### Corps (sections, en français)
```
## Le problème
## La solution
## Architecture
(diagramme mermaid flowchart LR, 5 à 10 nœuds max)
## Fonctionnalités clés
## Mon rôle
## Résultats
```

## Règles d'anonymisation (version publique)
- Aucun nom de client, de marque, de filiale, de personne, d'email, d'URL interne, de nom de tenant/ressource Azure, d'ID.
- Remplacer par le descripteur sectoriel (`clientAlias`) et des termes génériques (« le service achats », « l'outil ITSM du client »).
- Les noms de produits du client (ex. nom interne d'un outil) → générique.
- Les technos publiques (Azure, Snowflake, Next.js…) restent.
- Relire la version publique en cherchant chaque nom propre de la version privée : il ne doit en rester aucun.

## Règles de véracité
- Ne jamais inventer de métrique, d'adoption ou de mise en prod. Inconnu → `<!-- TODO: ... -->` dans le corps.
- `Mon rôle` : `<!-- TODO: à compléter -->` sauf si c'est évident (repo solo).
- Ton : concret, orienté valeur métier, phrases courtes, pas de superlatifs creux.
