import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
	roomNumber: {
		type: String,
		required: true,
	},
});

const Room = mongoose.models.Room || mongoose.model("Room", RoomSchema);

export default Room;
