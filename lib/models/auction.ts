import mongoose from "mongoose";

const AuctionSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startingPrice: { type: Number, required: true },
    currentBid: { type: Number, default: 0 },
    currentBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ["active", "completed"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.models.Auction || mongoose.model("Auction", AuctionSchema);
