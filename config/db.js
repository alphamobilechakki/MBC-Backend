import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // ⏳ avoid long hang
    });
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    console.log("⚠️ Continuing without DB…");

    // ❗ Absolutely DO NOT kill Cloud Run process
    // No process.exit()
  }
};

export default connectDB;
