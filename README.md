# Task Manager App

A full-stack task and time tracking application with AI assistant.

## Tech Stack
- **Frontend:** React.js, Tailwind CSS, Recharts
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Auth:** JWT (JSON Web Tokens)
- **AI:** Groq (Llama 3) — task enhancement + AI chat assistant

## Features
- Secure signup/login with JWT auth
- Create, edit, delete tasks with status and priority
- AI-powered task title and description generation
- Real-time timer (start/stop) per task with session logging
- Daily summary with productivity bar chart
- AI chat assistant that knows your tasks and helps you plan

## Local Setup

### Backend
```bash
cd server
npm install
# Fill in .env with MONGO_URI, JWT_SECRET, GROQ_API_KEY
npm run dev
```

### Frontend
```bash
cd client
npm install
npm start
```

## Test Credentials
- Email: test@test.com
- Password: test123

## Live Demo
[Link after deployment]