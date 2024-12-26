import mongoose from "mongoose";

const ClubSchema = new mongoose.Schema({
	clubName: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
	},
	logo: {
		type: String,
		required: false,
	},
});

const Club = mongoose.models.Club || mongoose.model("Club", ClubSchema);

export default Club;
