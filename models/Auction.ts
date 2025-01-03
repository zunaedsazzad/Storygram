import mongoose from "mongoose";

const AuctionSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	bookName: {
		type: String,
		required: true,
	},
	authorName: {
		type: String,
		required: true,
	},
	basePrice: {
		type: Number,
		required: true,
	},
	auctionEndTime: {
		type: Date,
		required: true,
	},
	bets: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
			price: {
				type: Number,
				required: true,
			},
			createdAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
});

const Auction =
	mongoose.models.Auction || mongoose.model("Auction", AuctionSchema);
export default Auction;
