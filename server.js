// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

const app = express();

// ✅ CORS setup (production-safe)
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL, // your production frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

// ✅ Middlewares
app.use(express.json());

// ✅ Routes
app.use("/api", routes);

// ✅ Start server only after DB connection attempt
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to DB", err);
    process.exit(1); // Crash early if DB is mandatory
  }
};

startServer();

export { app };
