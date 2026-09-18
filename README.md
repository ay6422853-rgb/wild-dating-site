# WILD Dating Website

A MERN starter project for WILD, an 18+ dating platform.

## Features
- Email/password registration and login
- Optional mobile number
- 18+ DOB validation
- What are you?
- Who are you interested in?
- What are you looking for?
- Dating intent
- Profile creation/editing
- Discover profiles
- Like / pass
- Mutual likes become matches
- Match list
- Basic real-time-ready chat API structure
- Report / block endpoints
- Admin portal with dashboard, users, reports and account actions
- JWT authentication
- MongoDB/Mongoose

## Run locally

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend: http://localhost:4000

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

Set `VITE_API_URL=http://localhost:4000/api` in frontend/.env if needed.

## Admin
Create a normal account, then set its MongoDB `role` to `ADMIN`, or use the admin seed:
```bash
cd backend
npm run seed:admin
```
The seed reads ADMIN_EMAIL and ADMIN_PASSWORD from `.env`.

## Notes
- Never store or expose plaintext passwords.
- This starter intentionally does not expose private messages to admins by default; moderation should use proper legal/privacy controls and an auditable workflow.
- Add production email verification, password reset, rate limiting, CSRF/origin controls, image moderation, secure cloud image storage, age/identity verification as required by your jurisdiction, and a proper consent/privacy system before launch.
