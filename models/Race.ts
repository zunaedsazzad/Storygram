import mongoose from "mongoose";

const RaceSchema = new mongoose.Schema({
	invitor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	invitee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	bookName: {
		type: String,
		required: true,
	},
	totalPage: {
		type: Number,
		required: true,
	},
	invitationAccepted: {
		type: Boolean,
		default: false,
	},
	invitorRead: {
		type: Number,
		default: 0,
	},
	inviteeRead: {
		type: Number,
		default: 0,
	},
});

const Race = mongoose.models.Race || mongoose.model("Race", RaceSchema);
export default Race;
