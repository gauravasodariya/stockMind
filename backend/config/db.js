import mongoose from "mongoose";

const connectDB = async () => {
  const uri =
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/inventory-forecast";

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB_NAME || undefined,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
