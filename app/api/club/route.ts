import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Favourite from "@/models/Favourite";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";

export const GET = async () => {
	try {
		await connectToDB();

		// Check the current user using Clerk
		const clerk_user = await currentUser();
		if (!clerk_user) {
			return NextResponse.json(
				{ message: "Not signed in" },
				{ status: 401 }
			);
		}

		// Find the current user in the database
		const user = await User.findOne({ clerkId: clerk_user.id });
		if (!user) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}
		const currentUserId = user._id;

		// Fetch all organizations
		const organizations = await User.find({ role: "Organization" });

		// Map through organizations to add `isJoined` field
		const organizationsWithJoinStatus = await Promise.all(
			organizations.map(async (org) => {
				// Check if a favorite relationship exists
				const isJoined = await Favourite.exists({
					club: org._id,
					follower: currentUserId,
				});
				return {
					...org.toObject(),
					isJoined: !!isJoined, // Convert to boolean
				};
			})
		);

		return NextResponse.json(
			{
				message: "Clubs fetched successfully",
				organizations: organizationsWithJoinStatus,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching Clubs:", error);
		return NextResponse.json(
			{ message: "An error occurred while fetching the Clubs" },
			{ status: 500 }
		);
	}
};
