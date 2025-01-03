import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";
import Event from "@/models/Event";
import { currentUser } from "@clerk/nextjs/server";

interface EventRequestBody {
	eventName: string;
	eventDate: string;
	eventDescription: string;
	eventLocation: string;
}

export const POST = async (req: Request) => {
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

		const club = user._id;

		const body: EventRequestBody = await req.json();
		const { eventName, eventDate, eventDescription, eventLocation } = body;

		if (!eventName || !eventDate || !eventDescription || !eventLocation) {
			return NextResponse.json(
				{ message: "All fields are required" },
				{ status: 400 }
			);
		}

		const newEvent = new Event({
			eventName: eventName.trim(),
			eventDate: new Date(eventDate),
			eventDescription: eventDescription.trim(),
			eventLocation: eventLocation.trim(),
			club,
			attendees: [],
		});

		await newEvent.save();

		return NextResponse.json(
			{ message: "Event created successfully", event: newEvent },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating event:", error);
		return NextResponse.json(
			{ message: "An error occurred while creating the event" },
			{ status: 500 }
		);
	}
};

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

		const events = await Event.find({ club: user._id }).populate(
			"attendees",
			"name email"
		);

		return NextResponse.json(
			{ message: "Events fetched successfully", events },
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

export const DELETE = async (req: Request) => {
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

		const { eventId } = await req.json();

		if (!eventId) {
			return NextResponse.json(
				{ message: "Event ID is required" },
				{ status: 400 }
			);
		}

		const event = await Event.findOne({ _id: eventId, club: user._id });

		if (!event) {
			return NextResponse.json(
				{ message: "Event not found or not authorized" },
				{ status: 404 }
			);
		}

		await Event.findByIdAndDelete(eventId);

		return NextResponse.json(
			{ message: "Event deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting event:", error);
		return NextResponse.json(
			{ message: "An error occurred while deleting the event" },
			{ status: 500 }
		);
	}
};

export const PUT = async (req: Request) => {
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

		const { eventId } = await req.json();
		if (!eventId) {
			return NextResponse.json(
				{ message: "Event ID is required" },
				{ status: 400 }
			);
		}

		const event = await Event.findById(eventId);
		if (!event) {
			return NextResponse.json(
				{ message: "Event not found" },
				{ status: 404 }
			);
		}

		const userId = user._id;

		const isAttending = event.attendees.includes(userId);

		if (isAttending) {
			event.attendees = event.attendees.filter(
				(attendee: any) => attendee.toString() !== userId.toString()
			);
		} else {
			event.attendees.push(userId);
		}

		await event.save();

		return NextResponse.json(
			{
				message: isAttending
					? "User removed from attendees successfully"
					: "User added to attendees successfully",
				attending: !isAttending,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error toggling attendance:", error);
		return NextResponse.json(
			{ message: "An error occurred while toggling attendance" },
			{ status: 500 }
		);
	}
};
