import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },  // Book's name
  author: { type: String, required: true }, // Who wrote it
  genre: String,                            // What type of book it is
  publishedYear: Number,                    // When it was written
  available: Boolean,                       // If it's available to borrow
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who owns the book
  isAuctioned: { type: Boolean, default: false } // If the book is currently up for auction
});

export default mongoose.models.Book || mongoose.model("Book", bookSchema);
