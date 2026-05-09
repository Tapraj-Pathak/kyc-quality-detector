# Smart KYC Capture Assistant

A full-stack MERN web app for guided KYC document capture, lightweight quality analysis, and submission tracking. The experience is designed with a fintech-style UI inspired by modern wallet apps and includes a React/Tailwind frontend plus an Express/Mongo backend.

## Features

- **Live Webcam Capture**: Mirrored preview using `react-webcam` for intuitive document capture.
- **Real-Time Quality Checks**: Lightweight blur, brightness, and framing heuristics updated every 400ms.
- **Guided Capture Experience**: Overlay guides and live feedback states to assist users.
- **Applicant Intake Form**: Collect document metadata with validation.
- **Submission Dashboard**: Live stats and review queue with readiness indicators.
- **Review Checklist**: Quality breakdown and capture preview modal.
- **MongoDB Integration**: Persistent storage for KYC submissions with timestamps.
- **REST API**: Endpoints for health checks, stats, submissions, and data retrieval.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Dev Tools**: Concurrently, Nodemon, Morgan for logging

## Project Structure

```
kyc-quality-detector/
├── client/          # React + Tailwind frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── lib/         # API utilities
│   │   └── utils/       # Quality analysis helpers
│   └── package.json
├── server/          # Express + MongoDB API
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API routes
│   │   └── utils/       # Middleware utilities
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local instance or Atlas)
- npm or yarn

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory.

2. **Install dependencies**:

   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure environment**:
   Create `server/.env` from the example:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/smart-kyc-assistant
   CLIENT_URL=http://localhost:5173
   JWT_SECRET=hahahahahaha
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=....
   CLOUDINARY_API_SECRET=......

   ```

      Create `client/.env` from the example:

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start MongoDB**:
   Ensure a MongoDB instance is running locally or update `MONGODB_URI` for Atlas.

5. **Run the application**:

   ```bash
   # Terminal 1: Start the backend
   cd server
   npm run dev

   # Terminal 2: Start the frontend
   cd ../client
   npm run dev
   ```

   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:5000](http://localhost:5000)

## API Endpoints

| Method | Endpoint                 | Description             |
| ------ | ------------------------ | ----------------------- |
| GET    | `/api/health`            | Service health check    |
| GET    | `/api/submissions`       | List recent submissions |
| GET    | `/api/submissions/stats` | Submission statistics   |
| POST   | `/api/submissions`       | Create new submission   |

## Development

### Available Scripts

- **Client**:
  - `npm run dev`: Start development server
  - `npm run build`: Build for production
  - `npm run preview`: Preview production build

- **Server**:
  - `npm run dev`: Start with nodemon (auto-restart)
  - `npm start`: Start production server

### Code Quality

- Run `npm audit` in client directory to check for vulnerabilities (currently 2 moderate issues in dependencies).
- No linting errors detected in the codebase.

## Deployment

### Production Considerations

- **Image Storage**: Currently stores base64 images in MongoDB. For production, migrate to cloud storage (e.g., AWS S3, Cloudinary).
- **Security**: Add authentication, input sanitization, and rate limiting.
- **Environment**: Use production-grade MongoDB (Atlas) and set secure environment variables.
- **Build**: Run `npm run build` in client and serve static files.

### Docker (Optional)

Add a `Dockerfile` and `docker-compose.yml` for containerized deployment.

## Troubleshooting

### Common Issues

- **MongoDB Connection Error**: Ensure MongoDB is running and `MONGODB_URI` is correct.
- **CORS Issues**: Verify `CLIENT_URL` in `.env` matches frontend URL.
- **Build Failures**: Check Node.js version and reinstall dependencies.
- **Camera Access**: Ensure HTTPS in production for webcam access.

### Logs

- Server logs are output to console with Morgan middleware.
- Check browser console for client-side errors.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test thoroughly
4. Submit a pull request

## License

This project is for educational purposes. See license file if applicable.

## Notes

- Quality analysis is client-side and lightweight; no heavy ML models.
- Extend with OCR, authentication, or reviewer workflows as needed.
- For production deployment, address the noted security and storage considerations.
