# Smart KYC Capture Assistant

A full-stack MERN web app for guided KYC document capture, lightweight quality analysis, and submission tracking. The experience is designed with a fintech-style UI inspired by modern wallet apps and includes a React/Tailwind frontend plus an Express/Mongo backend.

## Features

- Live webcam capture with mirrored preview using `react-webcam`
- Real-time quality checks every 400ms
- Lightweight blur, brightness, and framing heuristics
- Guided capture overlay and live feedback states
- Applicant intake form for document metadata
- Submission queue dashboard with live stats
- Review checklist and readiness indicators
- MongoDB-backed KYC submission history
- Capture preview modal with quality breakdown
- REST API for health, stats, recent submissions, and save flow

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Dev tooling: concurrently, nodemon

## Project Structure

```text
kyc-quality-detector/
  client/   # React + Tailwind frontend
  server/   # Express + MongoDB API
```

## Getting Started

### 1. Install dependencies

```bash
npm install
npm --prefix client install
npm --prefix server install
```

### 2. Configure environment

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smart-kyc-assistant
CLIENT_URL=http://localhost:5173
```

### 3. Start MongoDB

Make sure a local MongoDB instance is running, or replace `MONGODB_URI` with your MongoDB Atlas connection string.

### 4. Run the app

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## API Endpoints

- `GET /api/health`
- `GET /api/submissions`
- `GET /api/submissions/stats`
- `POST /api/submissions`

## Notes

- This project keeps image processing lightweight on the client and avoids heavy ML models.
- For a production deployment, replace base64 image storage with object storage such as S3 or Cloudinary.
- You can extend the API with authentication, reviewer workflows, or OCR later.
