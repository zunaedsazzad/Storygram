import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Race from "@/models/Race";
import User from "@/models/User";
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

		const races = await Race.find({
			$or: [{ invitor: currentUserId }, { invitee: currentUserId }],
		})
			.populate("invitor", "name email _id clerkId")
			.populate("invitee", "name email _id clerkId");

		const currentDate = new Date();

		const racesWithExtras = races.map((race) => {
			const isExpired =
				race.invitorRead === race.totalPage ||
				race.inviteeRead === race.totalPage;

			return {
				...race.toObject(),
				isExpired,
			};
		});

		return NextResponse.json(
			{
				message: "Races fetched successfully",
				races: racesWithExtras,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching races:", error);
		return NextResponse.json(
			{ message: "An error occurred while fetching races" },
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

		const { inviteeId, bookName, totalPage } = await req.json();

		if (!inviteeId || !bookName || !totalPage) {
			return NextResponse.json(
				{ message: "All fields are required" },
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

		const newRace = new Race({
			invitor: invitorId,
			invitee: inviteeId,
			bookName: bookName.trim(),
			totalPage,
		});

		await newRace.save();

		return NextResponse.json(
			{ message: "Race created successfully", race: newRace },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating race:", error);
		return NextResponse.json(
			{ message: "An error occurred while creating the race" },
			{ status: 500 }
		);
	}
};

export const PUT = async (req: Request) => {
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
		const userId = user._id;

		const { raceId, pagesRead } = await req.json();

		if (!raceId || typeof pagesRead !== "number") {
			return NextResponse.json(
				{ message: "Race ID and pagesRead are required" },
				{ status: 400 }
			);
		}

		const race = await Race.findById(raceId);
		if (!race) {
			return NextResponse.json(
				{ message: "Race not found" },
				{ status: 404 }
			);
		}

		if (race.invitor.toString() === userId.toString()) {
			if (pagesRead <= race.invitorRead) {
				return NextResponse.json(
					{
						message:
							"Pages read must be greater than the previous value",
					},
					{ status: 400 }
				);
			}
			if (pagesRead > race.totalPage) {
				return NextResponse.json(
					{
						message:
							"Pages read cannot exceed the total page count",
					},
					{ status: 400 }
				);
			}
			race.invitorRead = pagesRead;
		} else if (race.invitee.toString() === userId.toString()) {
			if (pagesRead <= race.inviteeRead) {
				return NextResponse.json(
					{
						message:
							"Pages read must be greater than the previous value",
					},
					{ status: 400 }
				);
			}
			if (pagesRead > race.totalPage) {
				return NextResponse.json(
					{
						message:
							"Pages read cannot exceed the total page count",
					},
					{ status: 400 }
				);
			}
			race.inviteeRead = pagesRead;
		} else {
			return NextResponse.json(
				{ message: "You are not part of this race" },
				{ status: 403 }
			);
		}

		await race.save();

		const hasInvitorWon = race.invitorRead === race.totalPage;
		const hasInviteeWon = race.inviteeRead === race.totalPage;

		if (hasInvitorWon && !hasInviteeWon) {
			const invitor = await User.findById(race.invitor);
			invitor.points = (invitor.points || 0) + 100;
			await invitor.save();
		} else if (!hasInvitorWon && hasInviteeWon) {
			const invitee = await User.findById(race.invitee);
			invitee.points = (invitee.points || 0) + 100;
			await invitee.save();
		}

		return NextResponse.json(
			{ message: "Pages read updated successfully", race },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating pages read:", error);
		return NextResponse.json(
			{ message: "An error occurred while updating pages read" },
			{ status: 500 }
		);
	}
};

export const DELETE = async (req: Request) => {
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
		const userId = user._id;

		const { raceId } = await req.json();

		if (!raceId) {
			return NextResponse.json(
				{ message: "Race ID is required" },
				{ status: 400 }
			);
		}

		const race = await Race.findById(raceId);

		if (!race) {
			return NextResponse.json(
				{ message: "Race not found" },
				{ status: 404 }
			);
		}

		if (race.invitee.toString() !== userId.toString()) {
			return NextResponse.json(
				{ message: "You are not the invitee for this race" },
				{ status: 403 }
			);
		}

		if (race.invitationAccepted) {
			return NextResponse.json(
				{ message: "The race invitation has already been accepted" },
				{ status: 400 }
			);
		}

		race.invitationAccepted = true;
		await race.save();

		return NextResponse.json(
			{ message: "Race invitation accepted successfully", race },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error accepting race invitation:", error);
		return NextResponse.json(
			{
				message:
					"An error occurred while accepting the race invitation",
			},
			{ status: 500 }
		);
	}
};
