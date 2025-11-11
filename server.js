// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors());



// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api", routes);






// ✅ Start server only after DB connection attempt
const PORT = process.env.PORT || 8080;

let server;
const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    
  } catch (err) {
    console.error("❌ Failed to connect to DB", err);
    process.exit(1); // Crash early if DB is mandatory
  }
};

startServer();

export { app, server };
