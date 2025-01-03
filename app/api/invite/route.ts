import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";
import Invite from "@/models/Invite";
import Book from "@/models/books";
import { currentUser } from "@clerk/nextjs/server";

export const GET = async () => {
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

		const currentUserId = user._id;

		const invites = await Invite.find({
			$or: [{ invitee: currentUserId }],
		})
			.populate("invitor", "name email photo clerkId")
			.populate("invitee", "name email photo clerkId")
			.populate("book", "bookname bookauthor genre photo");

		return NextResponse.json(
			{ message: "Invites fetched successfully", invites },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching invites:", error);
		return NextResponse.json(
			{ message: "An error occurred while fetching invites" },
			{ status: 500 }
		);
	}
};

export const POST = async (req: Request) => {
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
		const invitorId = user._id;

		const { inviteeId, bookId } = await req.json();

		if (!inviteeId || !bookId) {
			return NextResponse.json(
				{ message: "Invitee ID and Book ID are required" },
				{ status: 400 }
			);
		}

		const invitee = await User.findById(inviteeId);
		if (!invitee) {
			return NextResponse.json(
				{ message: "Invitee not found" },
				{ status: 404 }
			);
		}

		const book = await Book.findById(bookId);
		if (!book) {
			return NextResponse.json(
				{ message: "Book not found" },
				{ status: 404 }
			);
		}

		const existingInvite = await Invite.findOne({
			invitor: invitorId,
			invitee: inviteeId,
			book: bookId,
		});

		if (existingInvite) {
			return NextResponse.json(
				{
					message: "An invitation already exist.",
				},
				{ status: 400 }
			);
		}

		const newInvite = new Invite({
			invitor: invitorId,
			invitee: inviteeId,
			book: bookId,
		});

		await newInvite.save();

		return NextResponse.json(
			{ message: "Invitation created successfully", invite: newInvite },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating invitation:", error);
		return NextResponse.json(
			{ message: "An error occurred while creating the invitation" },
			{ status: 500 }
		);
	}
};
