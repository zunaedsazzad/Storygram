import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Room from "@/lib/models/Room";
import Event from "@/lib/models/Event";
import { auth } from "@clerk/nextjs/server";

export const POST = async (req: Request) => {
	try {
		await connectToDB();
		const { sessionClaims } = await auth();
		if (!sessionClaims) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		if (
			sessionClaims.metadata.role !== "president" &&
			sessionClaims.metadata.role !== "vicepresident" &&
			sessionClaims.metadata.role !== "generalsecretary" &&
			sessionClaims.metadata.role !== "treasurer" &&
			sessionClaims.metadata.role !== "instructor" &&
			sessionClaims.metadata.role !== "oca"
		) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { startDate, endDate } = await req.json();

		const events = await Event.find({
			$or: [{ startDate: { $lt: endDate }, endDate: { $gt: startDate } }],
		});

		const occupiedRooms = events.reduce((rooms, event) => {
			event.rooms.forEach((room: any) => rooms.add(room.toString()));
			return rooms;
		}, new Set());

		const freeRooms = await Room.find({
			_id: { $nin: Array.from(occupiedRooms) },
		});

		return NextResponse.json(freeRooms);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
