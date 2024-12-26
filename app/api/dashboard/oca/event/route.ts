import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Event from "@/lib/models/Event";
import Club from "@/lib/models/Club";
import User from "@/lib/models/User";
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

		const events = await Event.find().sort({
			endDate: 1,
		});

		return NextResponse.json({ events });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
