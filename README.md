# AI-APQP Co-pilot

Plateforme web de digitalisation du cycle APQP avec assistance IA générative pour l'industrie automobile (IATF 16949).

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

### Build pour production

```bash
# Build
npm run build

# Preview du build
npm run preview
```

## 📁 Structure du Projet

```
src/
├── components/
│   ├── Layout.tsx          # Layout principal
│   ├── Header.tsx          # Header avec recherche
│   ├── Sidebar.tsx         # Navigation latérale
│   └── phases/
│       └── Phase1/         # Composants Phase 1
│           ├── ProjectInfoForm.tsx
│           ├── VOCInput.tsx
│           └── RequirementsMatrix.tsx
├── pages/
│   ├── Dashboard.tsx       # Dashboard projets
│   └── ProjectView.tsx     # Vue détaillée projet
├── lib/
│   └── utils.ts            # Utilitaires (cn, etc.)
├── App.tsx                 # Application principale
├── main.tsx                # Point d'entrée
└── index.css               # Styles globaux
```

## 🎯 Fonctionnalités

### Phase 1 : Planification & Définition
- Formulaire informations projet
- Saisie VOC (Voice of Customer)
- Génération IA matrice des exigences
- Planning prévisionnel

### Phase 2 : Conception Produit
- Spécifications design
- Génération DFMEA avec calcul RPN
- Matrice CC/SC
- DVP&R

### Phase 3 : Conception Processus
- Étapes de fabrication
- Génération PFD automatique
- PFMEA avec RPN temps réel
- Control Plan couplé
- Work Instructions

### Phase 4 : Validation
- Upload données mesures
- Analyses statistiques (Cp, Cpk, Ppk)
- MSA R&R
- PPAP Niveau 3

### Phase 5 : Amélioration Continue
- Dashboard KPIs temps réel
- Alertes dérive process
- Reverse FMEA
- Actions correctives

## 🛠 Stack Technologique

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + shadcn/ui
- **Routing**: React Router v6
- **State**: Zustand + React Query
- **Icons**: Lucide React
- **Backend**: Node.js + Express (à venir)
- **Database**: PostgreSQL + Prisma (à venir)
- **AI**: OpenAI GPT-4o-mini (à venir)

## 📝 Conformité IATF 16949

L'application respecte les standards AIAG :
- APQP Manual 2nd Edition
- FMEA 4th Edition (DFMEA/PFMEA)
- Control Plan 2nd Edition
- SPC Manual
- MSA 4th Edition
- PPAP 4th Edition

## 📄 License

Ce projet est un portfolio personnel pour démonstration de compétences en qualité automobile et développement full-stack.

## 👤 Auteur

Projet portfolio - Ingénieur Qualité / Développeur Full-stack

## 📦 Préparer pour le déploiement

- 1) Supprimez les secrets committés : retirez le fichier `.env` du dépôt (il a été supprimé automatiquement) et assurez-vous que vos clés réelles sont stockées en sécurité.
- 2) Créez vos variables d'environnement sur la plateforme d'hébergement (Vercel, Netlify, Railway, Render, Heroku).
- 3) Frontend : construire avec `npm run build` puis déployer le dossier `dist` (ou utiliser Vercel/Netlify qui build automatiquement).
- 4) Backend : configurez les variables `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`, puis `npm run build` et `npm start` ou utilisez un service Node (PM2, Docker, ou plateforme PaaS).
- 5) Fichiers exemples fournis : `.env.example` (root) et `backend/.env.example`.

Conseil sécurité: révoquez et régénérez les clés exposées si elles ont été publiées publiquement.
