// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

const app = express();

// CORS
app.use(cors());



app.use("/api/webhook", express.raw({ type: "*/*" }));

// Body parsers
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api", routes);

// Cloud Run port
const PORT = process.env.PORT || 8080;

let server;

const startServer = async () => {
  console.log("🚀 Starting server...");

  // Try DB Connection (but DO NOT crash if it fails)
  try {
    await connectDB();
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ ERROR: Database connection failed");
    console.error(err);
    console.log("⚠️ Continuing without DB (Cloud Run will still start the container)");
  }

  // Always start the HTTP server
  server = app.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
    // console.log(process.env.CASHFREE_CLIENT_ID, process.env.CASHFREE_CLIENT_SECRET);

  });
};

startServer();

export { app, server };
