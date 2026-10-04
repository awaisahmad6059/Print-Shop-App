# Deployment Guide

## Frontend (Vercel)
1. Push code to GitHub
2. Connect Vercel to repository
3. Set environment variable: `REACT_APP_API_URL=https://your-backend-url.onrender.com`

## Backend (Render/Railway)
1. Push code to GitHub
2. Create Web Service on Render/Railway
3. Set environment variables from .env
4. Deploy

## Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Get connection string
3. Add to backend environment variables

## Domain Setup
Configure DNS to point to Vercel for frontend and Render for backend.
