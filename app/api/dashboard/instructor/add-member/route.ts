import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/lib/models/User";
import Club from "@/lib/models/Club";
import { auth } from "@clerk/nextjs/server";

export const POST = async (req: Request) => {
	try {
		await connectToDB();

		const { designation, presidentEmail } = await req.json();
		if (!designation || !presidentEmail) {
			return NextResponse.json(
				{ message: "Invalid designation or email" },
				{ status: 400 }
			);
		}

		if (
			designation !== "vicepresident" &&
			designation !== "generalsecretary" &&
			designation !== "treasurer" &&
			designation !== "president"
		) {
			return NextResponse.json(
				{ message: "Invalid designation" },
				{ status: 400 }
			);
		}

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
		const userRole = user.role;
		if (userRole !== "instructor") {
			return NextResponse.json(
				{ message: "User is not a Authorized to add a member" },
				{ status: 403 }
			);
		}

		const club = await Club.findById(clubID);

		if (!club) {
			return NextResponse.json(
				{ message: "Club not found" },
				{ status: 404 }
			);
		}

		const userInClub = await User.findOne({
			clubID,
			role: designation,
			leavedAt: { $exists: false },
		});

		if (userInClub) {
			return NextResponse.json(
				{ message: `A ${designation} already exists in the club` },
				{ status: 400 }
			);
		}

		const tempUser = await User.findOne({ email: presidentEmail });
		if (tempUser) {
			return NextResponse.json(
				{ message: "User already exists" },
				{ status: 400 }
			);
		}

		const response = await fetch("https://api.clerk.com/v1/invitations", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email_address: presidentEmail,
				public_metadata: { role: designation },
				expires_in_days: 30,
				ignore_existing: true,
			}),
		});

		if (!response.ok) {
			return NextResponse.json(
				{ message: "Failed to send invitation" },
				{ status: response.status }
			);
		}

		await User.create({
			email: presidentEmail,
			role: designation,
			clubID: club._id,
		});

		return NextResponse.json(
			{ message: "Successfully sent an invitation" },
			{ status: 201 }
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

		const { email } = await req.json();

		const { sessionClaims, userId } = await auth();
		if (!sessionClaims) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const tempUser = await User.findOne({ clerkID: userId });
		if (!tempUser) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		await user.updateOne({ leavedAt: new Date() });

		return NextResponse.json(
			{ message: "Successfully retired the member" },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
