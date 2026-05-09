import cors from "cors";
import express from "express";
import morgan from "morgan";
import submissionsRouter from "./routes/submissions.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json({ limit: "12mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "smart-kyc-capture-assistant-api",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/submissions", submissionsRouter);

app.use((error, _req, res, _next) => {
  console.error(error);

  res.status(error.statusCode || 500).json({
    message: error.message || "Internal server error",
  });
});

export default app;
