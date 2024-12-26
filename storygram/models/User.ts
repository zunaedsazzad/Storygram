import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
    clerkId: {
        type: String,
        required: false,
    },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
