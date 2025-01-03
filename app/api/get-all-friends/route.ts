import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Friend from "@/models/Friend";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";

export const GET = async (req: Request) => {
	try {
		await connectToDB();

		const clerk_user = await currentUser();
		if (!clerk_user) {
			return NextResponse.json(
				{ message: "Not signed in" },
				{ status: 401 }
			);
		}

		const user = await User.findOne({ clerkId: clerk_user.id });
		if (!user) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}
		const currentUserId = user._id;

		const friends = await Friend.find({
			$and: [
				{
					$or: [
						{ friend_one: currentUserId },
						{ friend_two: currentUserId },
					],
				},
				{ is_requested: false },
			],
		})
			.populate("friend_one", "name email clerkId")
			.populate("friend_two", "name email clerkId");

		const friendList = friends.map((friend: any) => {
			const friendDetails =
				friend.friend_one._id.toString() === currentUserId.toString()
					? friend.friend_two
					: friend.friend_one;
			return {
				_id: friendDetails._id,
				name: friendDetails.name,
				email: friendDetails.email,
				clerkId: friendDetails.clerkId,
			};
		});

		return NextResponse.json(
			{ message: "Friends fetched successfully", friends: friendList },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching friends:", error);
		return NextResponse.json(
			{ message: "An error occurred while fetching friends" },
			{ status: 500 }
		);
	}
};
