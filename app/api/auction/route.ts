import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Auction from "@/models/Auction";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";

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

		const { bookName, authorName, basePrice, auctionEndTime } =
			await req.json();

		if (!bookName || !authorName || !basePrice || !auctionEndTime) {
			return NextResponse.json(
				{ message: "All fields are required" },
				{ status: 400 }
			);
		}

		const newAuction = new Auction({
			user: user._id,
			bookName: bookName.trim(),
			authorName: authorName.trim(),
			basePrice,
			auctionEndTime: new Date(auctionEndTime),
			bets: [],
		});

		await newAuction.save();

		return NextResponse.json(
			{ message: "Auction created successfully", auction: newAuction },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating auction:", error);
		return NextResponse.json(
			{ message: "An error occurred while creating the auction" },
			{ status: 500 }
		);
	}
};

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

		const userId = user._id;

		// Populate user for the auction and the bets list
		const auctions = await Auction.find()
			.populate("user", "name email")
			.populate("bets.user", "name email");

		const auctionsWithExtras = await Promise.all(
			auctions.map(async (auction) => {
				const isAuctionEnded =
					new Date() > new Date(auction.auctionEndTime);
				const isAuctionOwner =
					auction.user._id.toString() === userId.toString();
				const hasBetted = auction.bets.some(
					(bet: { user: { _id: string } }) =>
						bet.user._id.toString() === userId.toString()
				);

				let winner = null;

				if (isAuctionEnded && auction.bets.length > 0) {
					// Find the highest bet
					const highestBet = auction.bets.reduce(
						(
							maxBet: { price: number },
							currentBet: { price: number }
						) =>
							currentBet.price > maxBet.price
								? currentBet
								: maxBet
					);

					// Winner details are already populated in bets list
					winner = highestBet.user;
					winner = {
						...winner.toObject(),
						paid: highestBet.price,
					};
				}

				return {
					...auction.toObject(),
					isAuctionEnded,
					isAuctionOwner,
					hasBetted,
					winner, // Include winner details if auction ended
				};
			})
		);

		return NextResponse.json(
			{
				message: "Auctions fetched successfully",
				auctions: auctionsWithExtras,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching auctions:", error);
		return NextResponse.json(
			{ message: "An error occurred while fetching auctions." },
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

		const { auctionId, price } = await req.json();

		if (!auctionId || !price) {
			return NextResponse.json(
				{ message: "Auction ID and bet price are required" },
				{ status: 400 }
			);
		}

		const auction = await Auction.findById(auctionId);

		if (!auction) {
			return NextResponse.json(
				{ message: "Auction not found" },
				{ status: 404 }
			);
		}

		if (auction.user.toString() === userId.toString()) {
			return NextResponse.json(
				{ message: "Auction owner cannot place a bet" },
				{ status: 403 }
			);
		}

		if (new Date() > new Date(auction.auctionEndTime)) {
			return NextResponse.json(
				{ message: "The auction has already ended" },
				{ status: 400 }
			);
		}

		// Check if there are any bets, and find the highest bet
		const highestBet = auction.bets.reduce(
			(maxBet: { price: number }, currentBet: { price: number }) =>
				currentBet.price > maxBet.price ? currentBet : maxBet,
			{ price: auction.basePrice } // Use basePrice as the default highest bet
		);

		if (price <= highestBet.price) {
			return NextResponse.json(
				{
					message:
						"Bet price should be higher than the current highest",
				},
				{ status: 400 }
			);
		}

		const existingBetIndex = auction.bets.findIndex(
			(bet: { user: { _id: string } }) =>
				bet.user._id.toString() === userId.toString()
		);

		if (existingBetIndex !== -1) {
			auction.bets[existingBetIndex].price = price;
			auction.bets[existingBetIndex].createdAt = new Date();
		} else {
			auction.bets.push({
				user: userId,
				price,
				createdAt: new Date(),
			});
		}

		await auction.save();

		return NextResponse.json(
			{ message: "Bet placed successfully", auction },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error placing bet:", error);
		return NextResponse.json(
			{ message: "An error occurred while placing the bet" },
			{ status: 500 }
		);
	}
};
