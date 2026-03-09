# GTAIM — Instructions pour Claude

## Contexte projet
GTAIM est un outil web qui génère des GTM Playbooks depuis une URL produit.
- **Stack** : Next.js + Supabase + Vercel
- **Repo** : github.com/tdebroucker/gtaim
- **Production** : gtaim.io (branche `main`)
- **Preview** : gtaim-akh43vrdp-tdebrouckers-projects.vercel.app (branche `develop`)
- **Tristan n'a pas de compétences en dev** — expliquer les concepts simplement

## Règles de travail
- Toujours travailler sur la branche `develop`, jamais directement sur `main`
- Respecter le design system (`DESIGN_SYSTEM.md`) pour tout travail front-end
- Conserver la structure de fichiers définie dans le `README.md`

## Règle Git absolue
- Toujours vérifier la branche active avec `git branch` avant tout travail
- Ne jamais modifier de fichiers sur `main`
- Travailler uniquement sur `develop`
- Après chaque modification : git add . → git commit → git push origin develop

## Réflexe learning LinkedIn
**À chaque décision technique ou produit importante**, proposer à Tristan de documenter un learning.

Un learning = une décision qui répond à une tension réelle et qui peut apporter de la valeur à la communauté PMM/Growth/Founders sur LinkedIn.

Format :
- **Angle** : La question ou tension que le post résout
- **Insight** : Ce qu'on a appris / décidé
- **Preuve** : Le contexte concret (screenshot, chiffre, exemple)
- **CTA potentiel** : Ce qu'on invite le lecteur à faire ou penser

Mettre à jour `LEARNINGS.md` dans ce projet ET la page Notion :
https://www.notion.so/31e5d8109d5281ceb624c3dd877a725d

## Références
- Design system : `DESIGN_SYSTEM.md`
- Learnings LinkedIn : `LEARNINGS.md`
- Roadmap & décisions techniques : `README.md`
