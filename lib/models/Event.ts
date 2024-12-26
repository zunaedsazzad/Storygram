import { ins } from "framer-motion/client";
import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	cover: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	objective: {
		type: String,
		required: true,
	},
	impact: {
		type: String,
		required: true,
	},
	club: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Club",
		required: true,
	},
	rooms: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Room",
			required: true,
		},
	],
	startDate: {
		type: Date,
		required: true,
	},
	endDate: {
		type: Date,
		required: true,
	},
	numberOfAttendees: {
		type: Number,
		required: true,
	},
	budget: [
		{
			name: {
				type: String,
				required: true,
			},
			proposedAmount: {
				type: Number,
				required: true,
			},
			approvedAmount: {
				type: Number,
				required: false,
			},
			spentAmount: {
				type: Number,
				required: false,
			},
		},
	],
	ocaApproval: {
		type: Boolean,
		required: false,
		default: false,
	},
	instructorApproval: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

export default Event;
