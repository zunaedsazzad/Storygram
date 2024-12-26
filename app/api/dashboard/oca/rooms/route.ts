import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Room from "@/lib/models/Room";
import { auth } from "@clerk/nextjs/server";

export const GET = async (req: Request) => {
	try {
		await connectToDB();
		const rooms = await Room.find();
		return NextResponse.json({ rooms: rooms }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};

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

		if (sessionClaims.metadata.role !== "oca") {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { roomNumber } = await req.json();

		const roomExists = await Room.findOne({ roomNumber });
		if (roomExists) {
			return NextResponse.json(
				{ message: "Room already exists" },
				{ status: 400 }
			);
		}

		const room = new Room({ roomNumber });
		await room.save();
		return NextResponse.json(
			{ message: "Room added", room: room },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};

export const PUT = async (req: Request) => {
	try {
		await connectToDB();
		const { sessionClaims } = await auth();
		if (!sessionClaims) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		if (sessionClaims.metadata.role !== "oca") {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { roomNumber, roomID } = await req.json();
		const roomExists = await Room.findOne({ roomNumber });
		if (roomExists) {
			return NextResponse.json(
				{ message: "Room already exists" },
				{ status: 400 }
			);
		}
		const room = await Room.findById(roomID);
		if (!room) {
			return NextResponse.json(
				{ message: "Room not found" },
				{ status: 404 }
			);
		}
		room.roomNumber = roomNumber;
		await room.save();
		return NextResponse.json(
			{ message: "Room updated", room: room },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};

export const DELETE = async (req: Request) => {
	try {
		await connectToDB();
		const { sessionClaims } = await auth();
		if (!sessionClaims) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		if (sessionClaims.metadata.role !== "oca") {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { roomID } = await req.json();

		const room = await Room.findById(roomID);
		if (!room) {
			return NextResponse.json(
				{ message: "Room not found" },
				{ status: 404 }
			);
		}
		await Room.findByIdAndDelete(roomID);
		return NextResponse.json({ message: "Room deleted" }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
