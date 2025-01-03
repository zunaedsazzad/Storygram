"use client";
import { useEffect, useState } from "react";
import { PlusCircle, XCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

interface Auction {
	_id: string;
	bookName: string;
	authorName: string;
	basePrice: number;
	auctionEndTime: string;
	user: { _id: string; name: string };
	bets: { user: string; price: number; createdAt: string }[];
	isAuctionEnded: boolean;
	isAuctionOwner: boolean;
	winner?: { name: string; email: string; paid: number };
}

export default function Auction() {
	const { user, isSignedIn } = useUser();
	const [auctions, setAuctions] = useState<Auction[]>([]);
	const [formData, setFormData] = useState({
		bookName: "",
		authorName: "",
		basePrice: "",
		auctionEndTime: "",
	});
	const [loading, setLoading] = useState(false);
	const [modalAuction, setModalAuction] = useState<Auction | null>(null);
	const [betValue, setBetValue] = useState("");

	useEffect(() => {
		if (isSignedIn) fetchAuctions();
	}, [isSignedIn]);

	const fetchAuctions = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/auction");
			const data = await response.json();
			if (response.ok) setAuctions(data.auctions);
			else toast.error(data.message || "Failed to fetch auctions.");
		} catch (error) {
			toast.error("An error occurred while fetching auctions.");
		} finally {
			setLoading(false);
		}
	};

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch("/api/auction", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					basePrice: Number(formData.basePrice),
				}),
			});
			const data = await response.json();
			if (response.ok) {
				toast.success("Auction created successfully!");
				setFormData({
					bookName: "",
					authorName: "",
					basePrice: "",
					auctionEndTime: "",
				});
				fetchAuctions();
			} else toast.error(data.message || "Failed to create auction.");
		} catch (error) {
			toast.error("An error occurred while creating auction.");
		}
	};

	const handlePlaceBet = async () => {
		try {
			const response = await fetch("/api/auction", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					auctionId: modalAuction?._id,
					price: Number(betValue),
				}),
			});
			const data = await response.json();
			if (response.ok) {
				toast.success("Bet placed successfully!");
				setModalAuction(null);
				fetchAuctions();
				setBetValue("");
			} else toast.error(data.message || "Failed to place bet.");
		} catch (error) {
			toast.error("An error occurred while placing bet.");
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4">
			<h1 className="text-2xl font-bold mb-6 text-center">Auction</h1>

			{/* Add Auction Form */}
			<form
				onSubmit={handleFormSubmit}
				className="grid gap-4 grid-cols-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8"
			>
				<div>
					<label
						htmlFor="bookName"
						className="block text-sm font-medium mb-1"
					>
						Book Name
					</label>
					<input
						id="bookName"
						type="text"
						className="w-full p-2 border rounded-md dark:bg-gray-700"
						value={formData.bookName}
						onChange={(e) =>
							setFormData({
								...formData,
								bookName: e.target.value,
							})
						}
						required
					/>
				</div>
				<div>
					<label
						htmlFor="authorName"
						className="block text-sm font-medium mb-1"
					>
						Author Name
					</label>
					<input
						id="authorName"
						type="text"
						className="w-full p-2 border rounded-md dark:bg-gray-700"
						value={formData.authorName}
						onChange={(e) =>
							setFormData({
								...formData,
								authorName: e.target.value,
							})
						}
						required
					/>
				</div>
				<div>
					<label
						htmlFor="basePrice"
						className="block text-sm font-medium mb-1"
					>
						Base Price
					</label>
					<input
						id="basePrice"
						type="number"
						className="w-full p-2 border rounded-md dark:bg-gray-700"
						value={formData.basePrice}
						onChange={(e) =>
							setFormData({
								...formData,
								basePrice: e.target.value,
							})
						}
						required
					/>
				</div>
				<div>
					<label
						htmlFor="auctionEndTime"
						className="block text-sm font-medium mb-1"
					>
						Auction End Time
					</label>
					<input
						id="auctionEndTime"
						type="datetime-local"
						className="w-full p-2 border rounded-md dark:bg-gray-700"
						value={formData.auctionEndTime}
						onChange={(e) =>
							setFormData({
								...formData,
								auctionEndTime: e.target.value,
							})
						}
						required
					/>
				</div>
				<div className="col-span-2">
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
						disabled={loading}
					>
						{loading ? (
							<Loader2 className="animate-spin mx-auto" />
						) : (
							<>
								<PlusCircle className="inline mr-2" />
								Add Auction
							</>
						)}
					</button>
				</div>
			</form>

			{/* Auctions List */}
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{auctions.map((auction) => (
					<div
						key={auction._id}
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md relative"
					>
						<h3 className="text-lg font-semibold mb-2">
							{auction.bookName}
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Author: {auction.authorName}
						</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Base Price: ${auction.basePrice}
						</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Ends:{" "}
							{new Date(auction.auctionEndTime).toLocaleString()}
						</p>
						<p className="mt-2">
							{auction.isAuctionEnded ? (
								<span className="text-red-500 font-semibold">
									Closed
								</span>
							) : (
								<span className="text-green-500 font-semibold">
									Ongoing
								</span>
							)}
						</p>
						{auction.winner && (
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
								Winner: {auction.winner.name} (
								{auction.winner.email}) [
								<span className="text-green-500 font-semibold">
									{auction.winner.paid} TK
								</span>
								]
							</p>
						)}
						<button
							onClick={() => setModalAuction(auction)}
							className="absolute top-4 right-4 bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition"
						>
							Bet
						</button>
					</div>
				))}
			</div>
			{modalAuction && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
						{/* Close Button */}
						<button
							title="Close Modal"
							onClick={() => setModalAuction(null)}
							className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition"
						>
							<XCircle size={24} />
						</button>

						{/* Modal Content */}
						<h3 className="text-lg font-semibold mb-4">
							{modalAuction.bookName}
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Author: {modalAuction.authorName}
						</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Base Price: ${modalAuction.basePrice}
						</p>
						<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
							Ends:{" "}
							{new Date(
								modalAuction.auctionEndTime
							).toLocaleString()}
						</p>

						{/* Bet Input for Non-Owner */}
						{!modalAuction.isAuctionEnded &&
						!modalAuction.isAuctionOwner ? (
							<>
								<input
									type="number"
									placeholder="Your Bet"
									className="w-full p-2 border rounded-md dark:bg-gray-700 mb-4"
									value={betValue}
									onChange={(e) =>
										setBetValue(e.target.value)
									}
								/>
								<button
									onClick={handlePlaceBet}
									className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
								>
									Place Bet
								</button>
							</>
						) : (
							<p className="text-sm font-medium text-red-500">
								{modalAuction.isAuctionOwner
									? "Auction owner cannot place a bet"
									: "The auction has already ended"}
							</p>
						)}

						{/* Previous Bets */}
						<h4 className="text-md font-semibold mt-4">
							Previous Bets
						</h4>
						<div className="mt-2 max-h-40 overflow-y-auto">
							{modalAuction.bets.length > 0 ? (
								modalAuction.bets.map((bet: any, index) => (
									<p
										key={index}
										className="text-sm text-gray-600 dark:text-gray-400"
									>
										${bet.price} by{" "}
										<span
											className={`${
												!modalAuction.isAuctionOwner
													? "text-green-500 font-semibold"
													: ""
											}`}
										>
											{bet.user.name}
										</span>{" "}
										on{" "}
										{new Date(
											bet.createdAt
										).toLocaleString()}
									</p>
								))
							) : (
								<p className="text-sm text-gray-600 dark:text-gray-400">
									No bets placed yet.
								</p>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
