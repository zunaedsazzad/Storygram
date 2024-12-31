import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
	photo: {
		type: String,
		
	},
	aboutMe: {
		type: String,
	},
	email: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	division: {
		type: String,
		required: true,
	},
	district: {
		type: String,
		required: true
	},
	age: {
		type: Number,
		required: true,
	},
	role: {
		type: String,
		required: true,
	},
	genres: {
		type: [String],
		required: true,
	},
	clerkId: {
		type: String,
		required: false,
	},
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;