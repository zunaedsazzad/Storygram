import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/lib/models/User";
import Club from "@/lib/models/Club";
import { auth } from "@clerk/nextjs/server";

export const GET = async (req: Request) => {
	try {
		await connectToDB();

		const { sessionClaims, userId } = await auth();
		if (!sessionClaims) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const user = await User.findOne({ clerkID: userId });
		if (!user) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		const clubID = user.clubID;
		if (!clubID) {
			return NextResponse.json(
				{ message: "User is not a member of any club" },
				{ status: 404 }
			);
		}

		const club = await Club.findOne({ _id: clubID });
		if (!club) {
			return NextResponse.json(
				{ message: "Club not found" },
				{ status: 404 }
			);
		}

		const members = await User.find({
			clubID: clubID,
			leavedAt: { $exists: false },
		});

		return NextResponse.json(
			{
				members: members,
			},
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
