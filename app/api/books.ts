import { NextApiRequest, NextApiResponse } from "next"; // Explicitly define types for req and res
import Book from "../../lib/models/book"; // Use the model we made
import mongoose, { ConnectOptions, SortOrder } from "mongoose";

// Function to connect to the database
const connectToDatabase = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set.");
  }

  // Check if the connection already exists
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(uri, {
        // Explicitly cast options to ConnectOptions
        useUnifiedTopology: true,
      } as ConnectOptions);
      console.log("Connected to MongoDB.");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }
};

// Main API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase(); // Connect to the database

  try {
    if (req.method === "GET") {
      const { query, sortBy } = req.query; // Get search words and sorting

      // Filter based on query (search by title or author)
      const filter = query
        ? {
            $or: [
              { title: { $regex: query, $options: "i" } },
              { author: { $regex: query, $options: "i" } },
            ],
          }
        : {};

      // Sorting option
      const sortOption: { [key: string]: SortOrder } = 
        sortBy === "title" ? { title: 1 } : { publishedYear: -1 };

      // Fetch books from the database
      const books = await Book.find(filter).sort(sortOption);
      res.status(200).json(books); // Return books
    } else {
      // Handle unsupported methods
      res.setHeader("Allow", ["GET"]);
      res.status(405).json({ message: `Method ${req.method} not allowed.` });
    }
  } catch (error) {
    console.error("Error in handler:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
