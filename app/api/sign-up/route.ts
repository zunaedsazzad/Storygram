import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";

export const POST = async (req: Request) => {
	const { email, password, name, address, division, district, age, role, genres } = await req.json();
	if (!email || !password || !name || !address || !division || !age || !role || !genres) {
		return NextResponse.json(
			{ message: "Missing required fields" },
			{ status: 400 }
		);
	}

	const clerkResponse = await fetch("https://api.clerk.com/v1/users", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email_address: [email],
			password,
			public_metadata: { role },
		}),
	});

	if (!clerkResponse.ok) {
		const errorData = await clerkResponse.json();
		return NextResponse.json(
			{ message: errorData.message || "Failed to create user with Clerk" },
			{ status: clerkResponse.status }
		);
	}

	const { id: clerkId } = await clerkResponse.json();

	connectToDB();

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return NextResponse.json(
			{ message: "Email already exists" },
			{ status: 400 }
		);
	}

	const user = new User({ email, name, address, division, district, age, role, genres, clerkId });
	await user.save();

	return NextResponse.json({ message: "User created" });
};
