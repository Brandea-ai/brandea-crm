# Brandea CRM - Kanban Board System

Ein professionelles Full-Stack Kanban CRM System für die Verwaltung von Lieferanten.

## Features

- 🔐 Sicheres Login-System mit JWT-Authentifizierung
- 📊 Kanban Board mit 4 Status-Spalten
- 🔄 Drag & Drop Funktionalität
- ✏️ Inline-Editing aller Felder
- 🎯 Triple-Navigation (Dropdown, Pfeile, Drag & Drop)
- 📥 CSV-Export
- 💾 SQLite Datenbank mit automatischem Backup
- 📱 Responsive Design

## Installation

### Voraussetzungen
- Node.js (v14 oder höher)
- npm oder yarn

### Backend Setup
```bash
cd backend
npm install
npm run seed  # Erstellt Datenbank mit Standardbenutzer und Beispieldaten
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Entwicklungsmodus (beide gleichzeitig)
```bash
npm install
npm run dev
```

## Standard-Login
- Benutzername: `Brandea-Texamed`
- Passwort: `BrandeaTexamed2025`

## Deployment

### Backend (Railway/Render)
1. Environment Variables setzen:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `PORT`

2. Build Command: `npm install`
3. Start Command: `npm start`

### Frontend (Netlify/Vercel)
1. Build Command: `cd frontend && npm install && npm run build`
2. Publish Directory: `frontend/build`
3. Environment Variable: `REACT_APP_API_URL` (Backend URL)

## Technologien

### Backend
- Node.js & Express
- Sequelize ORM
- SQLite Datenbank
- JWT für Authentifizierung
- bcrypt für Passwort-Hashing

### Frontend
- React 18
- Redux Toolkit
- React Beautiful DnD
- React Router
- Axios

## Lizenz
© 2025 Brandea - Ein Tool von Brandea