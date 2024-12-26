import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Event from "@/lib/models/Event";
import Club from "@/lib/models/Club";

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

		return NextResponse.json({ club }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
