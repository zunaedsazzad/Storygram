import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Favourite from "@/models/Favourite";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";

export const POST = async (req: Request) => {
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
		const follower = user._id;

		// Parse the request body
		const { clubId } = await req.json();
		if (!clubId) {
			return NextResponse.json(
				{ message: "Club ID is required" },
				{ status: 400 }
			);
		}

		// Check if the favorite relationship already exists
		const existingFavourite = await Favourite.findOne({
			club: clubId,
			follower,
		});

		if (existingFavourite) {
			// Remove the favorite if it already exists (toggle off)
			await Favourite.deleteOne({ _id: existingFavourite._id });
			return NextResponse.json(
				{
					message: "Removed from favorites successfully",
					action: "removed",
				},
				{ status: 200 }
			);
		} else {
			// Add the favorite if it does not exist (toggle on)
			const newFavourite = new Favourite({
				club: clubId,
				follower,
			});
			await newFavourite.save();
			return NextResponse.json(
				{
					message: "Added to favorites successfully",
					action: "added",
					favourite: newFavourite,
				},
				{ status: 201 }
			);
		}
	} catch (error) {
		console.error("Error toggling favorite:", error);
		return NextResponse.json(
			{ message: "An error occurred while toggling favorite" },
			{ status: 500 }
		);
	}
};
