import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Event from "@/lib/models/Event";
import Club from "@/lib/models/Club";

export const GET = async (req: Request) => {
	try {
		await connectToDB();

		const currentDate = new Date();
		const events = await Event.find({
			endDate: { $gt: currentDate },
			ocaApproval: true,
		});

		for (const event of events) {
			const club = await Club.findById(event.club);
			if (!club) {
				return NextResponse.json(
					{ message: "Club not found" },
					{ status: 404 }
				);
			}
			event.club = club;
		}

		return NextResponse.json(events, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
