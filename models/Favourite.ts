import mongoose from "mongoose";

const FavouriteSchema = new mongoose.Schema({
	club: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	follower: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Favourite =
	mongoose.models.Favourite || mongoose.model("Favourite", FavouriteSchema);
export default Favourite;
