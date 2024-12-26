import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Event from "@/lib/models/Event";
import Club from "@/lib/models/Club";
import User from "@/lib/models/User";

export const GET = async (req: Request) => {
	try {
		await connectToDB();

		const url = new URL(req.url);
		const clubId = url.pathname.split("/").pop();
		if (!clubId) {
			return NextResponse.json(
				{ message: "Event not found" },
				{ status: 404 }
			);
		}

		const club = await Club.findOne({
			_id: clubId,
		});
		if (!club) {
			return NextResponse.json(
				{ message: "Club not found" },
				{ status: 404 }
			);
		}

		const members = await User.find({
			clubID: club._id,
		});

		const events = await Event.find({
			club: club._id,
			ocaApproval: true,
		});

		const newClub = club.toObject();
		newClub.events = events;
		newClub.members = members;

		return NextResponse.json({ club: newClub }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
