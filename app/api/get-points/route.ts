import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";

export const GET = async (req: Request) => {
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

		return NextResponse.json(
			{
				message: "Points fetched successfully",
				points: user.points,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching points:", error);
		return NextResponse.json(
			{ message: "An error occurred while fetching points" },
			{ status: 500 }
		);
	}
};
