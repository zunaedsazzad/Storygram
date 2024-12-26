import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Event from "@/lib/models/Event";
import Club from "@/lib/models/Club";
import Room from "@/lib/models/Room";

export const GET = async (req: Request) => {
	try {
		await connectToDB();

		const url = new URL(req.url);
		const eventId = url.pathname.split("/").pop();
		if (!eventId) {
			return NextResponse.json(
				{ message: "Event not found" },
				{ status: 404 }
			);
		}

		const event = await Event.findOne({ _id: eventId });
		if (!event) {
			return NextResponse.json(
				{ message: "Event not found" },
				{ status: 404 }
			);
		}

		const club = await Club.findOne({ _id: event.club });
		if (!club) {
			return NextResponse.json(
				{ message: "Club not found" },
				{ status: 404 }
			);
		}
		const roomList = event.rooms;
		const rooms = [];
		for (const room of roomList) {
			const roomData = await Room.findOne({ _id: room });
			if (!roomData) {
				return NextResponse.json(
					{ message: "Room not found" },
					{ status: 404 }
				);
			}
			rooms.push(roomData);
		}

		const newEvent = event.toObject();
		newEvent.club = club;
		newEvent.rooms = rooms;

		return NextResponse.json({ event: newEvent }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
