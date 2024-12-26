import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Event from "@/lib/models/Event";
import Club from "@/lib/models/Club";

export const GET = async (req: Request) => {
	try {
		await connectToDB();

		const clubs = await Club.find();
		const newClubs: any[] = [];
		await Promise.all(
			clubs.map(async (club) => {
				const totalEvents = await Event.countDocuments({
					club: club._id,
					ocaApproval: true,
				});
				const newClub = club.toObject();
				newClub.totalEvents = totalEvents;
				newClubs.push(newClub);
			})
		);

		return NextResponse.json(newClubs, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
