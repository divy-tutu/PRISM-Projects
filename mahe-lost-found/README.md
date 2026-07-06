# MAHE Lost & Found Platform
 
A centralized web platform for reporting, searching, and recovering lost items across the MAHE campus. Built as a client-side single-page application with no custom backend server — Firebase handles data and auth directly from the client.
 
## Overview
 
Students and staff can report lost or found items, browse/search existing listings, and manage submissions through a responsive, type-safe interface. The app is intentionally serverless: all persistence and authentication run through Firebase, keeping the architecture simple to deploy and maintain.
 
## Tech Stack
 
**Frontend**
- React 19 + TypeScript
- Vite 8 (`@vitejs/plugin-react`)
- React Router 7
- Tailwind CSS 4 (`@tailwindcss/vite`) + PostCSS/autoprefixer
- React Hook Form + `@hookform/resolvers` + Zod (form handling & validation)
- lucide-react (icons), react-hot-toast (notifications), date-fns, clsx / tailwind-merge (utilities)
**Backend / Infra**
- Firebase v12 — Firestore (data) and Auth (users), used directly from the client
- `firestore.rules` and `firestore.indexes.json` define security rules and query indexes
**Tooling**
- oxlint for linting
- npm for package management
> This is a client-side SPA using Firestore as a NoSQL document database accessed directly from the browser — there is no custom REST API or relational schema.
 
## Features
 
- Report a lost or found item with structured, validated forms
- Search and browse existing listings
- Firebase Auth–backed user accounts
- Real-time data sync via Firestore
- Responsive UI styled with Tailwind CSS
## Project Setup
 
```bash
npm install
```
 
Create a Firebase project and add your config (e.g. via a `.env` file or `src/firebase.ts`, depending on your setup) with your Firebase project's API key, auth domain, and project ID.
 
```bash
npm run dev
```
 
Deploy Firestore rules and indexes:
```bash
firebase deploy --only firestore:rules,firestore:indexes
```
 
## Project Structure (high level)
 
```
mahe-lost-found/
├── src/
│   ├── components/     # UI components
│   ├── pages/           # Route-level views (React Router)
│   ├── forms/            # React Hook Form + Zod schemas
│   └── firebase/          # Firebase init & Firestore/Auth helpers
├── firestore.rules
├── firestore.indexes.json
├── package.json
└── vite.config.ts
```
 
*(Adjust folder names above to match your actual `src/` layout if it differs.)*
 
## Roadmap / Possible Extensions
 
- Automated item matching between lost and found reports
- Notification service for potential matches
- Admin moderation tools for listings
## Author
 
Divyesh Shrivastava — B.Tech, Computer and Communication Engineering, Manipal Institute of Technology
