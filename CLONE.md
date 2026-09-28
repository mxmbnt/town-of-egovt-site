# Clone #11 — egovt.ovathemewp.com

- **Source** : https://egovt.ovathemewp.com/home-6/
- **Créé le** : 28/09/2026 21:42:57

## Structure
- `_capture/` — captures d'écran, design tokens, assets bruts (`report.html` = récap visuel)
- `public/img/` — assets prêts pour le build (voir `contact.png` pour les identifier)
- `src/` — code du clone à construire (sections dans `src/sections/`)

## Démarrer
```bash
cd 11
npm install
npm run dev
```

## À faire
1. Remplir les tokens dans `src/index.css` depuis `_capture/design-tokens.md`.
2. Renommer les assets utiles de `public/img/` (voir `_capture/assets/contact.png`).
3. Recréer les sections dans `src/sections/` puis les composer dans `src/App.jsx`.
4. Vérifier le rendu contre `_capture/full.png`.
