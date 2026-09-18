# 🌾 AFANE - Plateforme Agricole

<div align="center">

---

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Structure du projet](#-structure-du-projet)
- [Scripts disponibles](#-scripts-disponibles)
- [Déploiement](#-déploiement)
- [Contribution](#-contribution)
- [Licence](#-licence)

---

## 🎯 À propos

**AFANE** est une plateforme numérique agricole conçue pour faciliter les échanges commerciaux entre les différents acteurs du secteur agricole. Elle permet aux producteurs, coopératives, acheteurs, fournisseurs d'intrants et conseillers agricoles de se connecter, d'échanger et de développer leurs activités.

### Objectifs

- 🌱 Faciliter la commercialisation des produits agricoles
- 🤝 Encourager les ventes collectives entre producteurs
- 💰 Réduire les coûts d'achat des intrants grâce aux achats groupés
- 📚 Améliorer l'accès aux conseils techniques agricoles
- 🗺️ Produire une cartographie numérique des exploitations

---

## ✨ Fonctionnalités

### 🔐 Authentification

- Connexion avec Google (Firebase)
- Connexion Email/Mot de passe
- Vérification d'email
- Réinitialisation de mot de passe
- Onboarding personnalisé par rôle

### 👥 Gestion des utilisateurs

- 7 types de rôles : Utilisateur, Producteur, Coopérative, Acheteur, Fournisseur, Conseiller, Admin
- Profils personnalisables
- Système de vérification
- Gestion des permissions

### 🛍️ Marketplace

- Publication d'annonces avec photos
- Vente individuelle et en groupe
- Système de commandes
- Gestion des stocks
- Catégorisation automatique (IA)

### 💬 Communication

- Messagerie entre utilisateurs
- Notifications en temps réel
- Système d'alertes

### 📊 Tableaux de bord

- Statistiques personnalisées par rôle
- Suivi des ventes et commandes
- Analyses de performance

### 🤖 Intelligence Artificielle

- Catégorisation automatique des produits
- Suggestion de tags
- Analyse de prix

---

## 🛠️ Technologies

### Frontend

| Technologie  | Version | Usage            |
| ------------ | ------- | ---------------- |
| Next.js      | 16.3.2  | Framework React  |
| React        | 19.2.8  | Bibliothèque UI |
| TypeScript   | 5       | Typage statique  |
| Tailwind CSS | 4       | Styling          |
| shadcn/ui    | 4.19    | Composants UI    |
| Lucide React | 1.33    | Icônes          |

### Backend & Base de données

| Technologie | Version | Usage                       |
| ----------- | ------- | --------------------------- |
| Supabase    | 2.112   | Base de données PostgreSQL |
| Firebase    | 12.18   | Authentification            |
| Next.js API | -       | Routes API                  |

### IA & Services

| Technologie           | Usage            |
| --------------------- | ---------------- |
| Cloudflare Workers AI | Catégorisation  |
| Hugging Face          | Analyse de texte |

### Outils

| Technologie | Usage                   |
| ----------- | ----------------------- |
| pnpm        | Gestionnaire de paquets |
| ESLint      | Linting                 |
| Prettier    | Formatage               |

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir :

- **Node.js** 20.x ou supérieur
- **pnpm** 9.x ou supérieur
- **Compte Supabase** ([créer](https://supabase.com))
- **Compte Firebase** ([créer](https://firebase.google.com))
- **Git**

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/landourenech/afane.git
cd afane
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
