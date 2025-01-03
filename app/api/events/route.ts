import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";
import Event from "@/models/Event";
import Favourite from "@/models/Favourite";
import { currentUser } from "@clerk/nextjs/server";


export const GET = async () => {
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

		const userId = user._id;

		const favoriteClubs = await Favourite.find({
			follower: userId,
		}).populate("club");

		if (!favoriteClubs.length) {
			return NextResponse.json(
				{ message: "No favorite clubs found", events: [] },
				{ status: 200 }
			);
		}

		const clubIds = favoriteClubs.map((fav) => fav.club._id);

		const events = await Event.find({ club: { $in: clubIds } }).populate(
			"club",
			"name"
		);

		const eventsWithAttendance = events.map((event) => ({
			...event.toObject(),
			isAttending: event.attendees.some(
				(attendee: any) => attendee.toString() === userId.toString()
			),
		}));

		return NextResponse.json(
			{
				message: "Events fetched successfully",
				events: eventsWithAttendance,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching events:", error);
		return NextResponse.json(
			{ message: "An error occurred while fetching the events" },
			{ status: 500 }
		);
	}
};
