import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";  // add .js extension in ESM

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api", routes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

export { app, server };
