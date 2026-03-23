# GTAIM — Design System

> Last updated: March 2026

---

## 1. Brand Identity

| Element | Value |
|---|---|
| **Name** | GTAIM |
| **Domain** | `gtaim.io` |
| **Baseline** | *"AI-powered GTM, right on target"* |
| **Positioning** | Outil web de génération automatique de GTM Playbook via IA |
| **Target** | Product Marketers, Growth, Founders — profil tech-friendly |
| **Tone** | Expert, direct, moderne. Pas corporatif. |

---

## 2. Logo

### Concept
Cible concentrique — 4 cercles de largeurs variables, du plus large à l'extérieur vers un centre large. Évoque précision, ciblage, AIM + AI intégré dans le nom.

### Fichiers
| Fichier | Usage |
|---|---|
| `gtaim-logo-v6.svg` | Logo principal (200x200) |
| `gtaim-favicon.svg` | Favicon (32x32) |

### Intégration favicon
```html
<link rel="icon" type="image/svg+xml" href="/gtaim-favicon.svg">
```

### Règles d'usage
- Toujours utiliser sur fond blanc (`#FFFFFF`) ou fond sombre (`#0A0A0F`)
- Ne pas déformer les proportions
- Taille minimale recommandée : 32px

---

## 3. Couleurs

### Palette principale

| Rôle | Nom | Hex |
|---|---|---|
| Background principal | Noir profond | `#0A0A0F` |
| Background secondaire | Gris sombre | `#13131A` |
| Accent principal | Orange électrique | `#FF6B35` |
| Accent secondaire | Cyan | `#00D4FF` |
| Texte principal | Blanc cassé | `#F0F0F0` |
| Texte secondaire | Gris clair | `#8B8B9E` |
| Bordures | Gris subtil | `#2A2A3A` |

### Palette logo

| Rôle | Hex |
|---|---|
| Anneau extérieur (sombre) | `#B83A00` → `#F07030` |
| Anneau 2 | `#D95A10` → `#F89060` |
| Anneau 3 (fin) | `#F07040` → `#FBBB90` |
| Centre | `#F5C4A0` → `#FFFFFF` |

---

## 4. Typographie

| Usage | Police | Source |
|---|---|---|
| Titres | `Space Grotesk` | Google Fonts |
| Body / UI | `Inter` | Google Fonts |

### Intégration
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Hiérarchie recommandée
| Élément | Police | Taille | Poids |
|---|---|---|---|
| H1 | Space Grotesk | 48px | 700 |
| H2 | Space Grotesk | 32px | 600 |
| H3 | Space Grotesk | 24px | 600 |
| Body | Inter | 16px | 400 |
| Caption | Inter | 14px | 400 |
| Label UI | Inter | 12px | 500 |

---

## 5. Style visuel

- **Mode :** Dark & Sharp (fond sombre par défaut)
- **Inspiration :** Flat design géométrique avec relief subtil
- **Bordures :** Radius `8px` pour les cards, `4px` pour les boutons
- **Ombres :** Légères, teintées orange (`#FF6B35` à faible opacité)
- **Iconographie :** Lucide Icons (cohérent avec le stack React)

---

## 6. Composants UI (à enrichir)

### Bouton principal
```css
background: #FF6B35;
color: #FFFFFF;
border-radius: 4px;
font-family: Inter;
font-weight: 600;
```

### Bouton secondaire
```css
background: transparent;
border: 1px solid #2A2A3A;
color: #F0F0F0;
border-radius: 4px;
```

### Card
```css
background: #13131A;
border: 1px solid #2A2A3A;
border-radius: 8px;
box-shadow: 0 4px 20px rgba(255, 107, 53, 0.05);
```

---

## 7. Ton éditorial

- **Langue :** Anglais (interface + baseline)
- **Voix :** Expert sans jargon inutile, direct, orienté résultat
- **À éviter :** Superlatifs vides ("amazing", "revolutionary"), ton corporate
- **À privilégier :** Verbes d'action, bénéfices concrets, langage PMM/Growth

---

*Ce fichier est la référence unique pour toute décision front-end. Le mettre à jour à chaque évolution du design.*
