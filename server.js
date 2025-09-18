// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

// Connect to MongoDB
connectDB();

const app = express();

// ✅ Allowed Origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://192.168.1.16:5173",
  process.env.FRONTEND_URL, // your production frontend URL from .env
];

// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        // allow Postman, curl, or server-to-server calls
        return callback(null, true);
      }

      // ✅ Exact match
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // ✅ Allow any ngrok URL
      if (/\.ngrok-free\.app$/.test(origin) || /\.ngrok\.io$/.test(origin)) {
        return callback(null, true);
      }

      // ❌ Reject everything else
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true, // if you are using cookies or JWT auth
  })
);

// ✅ Middlewares
app.use(express.json());

// ✅ Routes
app.use("/api", routes);

// ✅ Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

export { app, server };
