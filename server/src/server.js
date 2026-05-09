import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/esewa";

async function startServer() {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured. Add it to server/.env.");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
