import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
	eventName: {
		type: String,
		required: true,
		trim: true,
	},
	eventDate: {
		type: Date,
		required: true,
	},
	eventDescription: {
		type: String,
		required: true,
		trim: true,
	},
	eventLocation: {
		type: String,
		required: true,
		trim: true,
	},
	club: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	attendees: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
});

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);
export default Event;
