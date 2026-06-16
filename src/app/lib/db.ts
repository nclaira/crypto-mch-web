import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  // 1. If already connected, reuse it
  if (mongoose.connection.readyState >= 1) {
    console.log("Using existing database connection! ");
    return;
  }

  // 2. Check if the string actually exists
  if (!MONGODB_URI) {
    console.error("CRITICAL ERROR: MONGODB_URI is missing inside .env.local!");
    throw new Error("MONGODB_URI is missing");
  }

  // 3. Try connecting
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("Database connected successfully! ");
  } catch (error) {
    console.error("Database connection failed completely:", error);
    throw error;
  }
}
