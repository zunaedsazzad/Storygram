import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";

export const POST = async (req: Request) => {
	const { email, password, name } = await req.json();
	if (!email || !password || !name) {
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
			public_metadata: { role: "user"},
		}),
	});

	const { id: clerkId } = await clerkResponse.json();

	connectToDB();

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return NextResponse.json(
			{ message: "Email already exists" },
			{ status: 400 }
		);
	}

	const user = new User({ email, name, clerkId });
	await user.save();

	return NextResponse.json({ message: "User created" });
};
