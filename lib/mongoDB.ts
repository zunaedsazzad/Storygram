import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async (): Promise<void> => {
  mongoose.set("strictQuery", true); // Enable strict query mode

  if (isConnected) {
    console.log("Database is already connected.");
    return;
  }

  try {
    // Use the fallback URL if the environment variable is not defined
    const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/storygram";

    // Validate the connection string format
    if (!mongoUrl.startsWith("mongodb://") && !mongoUrl.startsWith("mongodb+srv://")) {
      throw new Error("Invalid MongoDB connection string");
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUrl, {
      dbName: "storygram", // Specify your database name
    });

    isConnected = true; // Mark the connection as successful
    console.log("Connected to MongoDB successfully.");
  } catch (err) {
    console.error("Database connection error:", err);
    throw err; // Re-throw the error to handle it in the caller function
  }
};

