# Setup Guide - Print Shop App

## Prerequisites
- Node.js 18+ installed
- npm or yarn
- MongoDB Atlas account (optional for local development)

## Local Development

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Update with your values
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/printshop
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.development)
```
REACT_APP_API_URL=http://localhost:5000
```
