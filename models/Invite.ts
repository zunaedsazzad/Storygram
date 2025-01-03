import mongoose from "mongoose";

const InviteSchema = new mongoose.Schema({
	invitor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	invitee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	book: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Book",
	},
});

const Invite = mongoose.models.Invite || mongoose.model("Invite", InviteSchema);
export default Invite;
