"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import ModalReq from "@/app/library/modalReq";
import { Loader2, Share2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Friend {
	_id: string;
	name: string;
	email: string;
	clerkId: string;
}

export const Card = React.memo(
	({
		card,
		index,
		hovered,
		setHovered,
		openModal,
		friends,
	}: {
		card: any;
		index: number;
		hovered: number | null;
		setHovered: React.Dispatch<React.SetStateAction<number | null>>;
		openModal: () => void;
		friends: Friend[];
	}) => {
		const [shareMenuOpen, setShareMenuOpen] = useState(false);
		const [selectedFriendId, setSelectedFriendId] = useState("");
		const [loading, setLoading] = useState(false);

		const handleShare = async () => {
			if (!selectedFriendId) {
				toast.error("Please select a friend to share with");
				return;
			}

			try {
				setLoading(true);
				const response = await fetch("/api/invite", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						inviteeId: selectedFriendId,
						bookId: card.id,
					}),
				});
				const data = await response.json();
				if (response.ok) {
					toast.success("Invitation sent successfully!");
					setShareMenuOpen(false);
					setSelectedFriendId("");
				} else {
					toast.error(data.message || "Failed to send invitation");
				}
				setLoading(false);
			} catch {
				toast.error("An error occurred while sending the invitation");
			}
		};

		return (
			<div
				onMouseEnter={() => setHovered(index)}
				onMouseLeave={() => setHovered(null)}
				className={cn(
					"rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out",
					hovered !== null &&
						hovered !== index &&
						"blur-sm scale-[0.98]"
				)}
			>
				<img
					src={card.src}
					alt={"hey"}
					className="object-cover absolute inset-0"
				/>
				<div
					className={cn(
						"absolute inset-0 bg-black/50 flex justify-between items-end py-8 px-4 transition-opacity duration-300",
						hovered === index ? "opacity-100" : "opacity-0"
					)}
				>
					<button
						title="Share"
						onClick={() => setShareMenuOpen((prev) => !prev)}
						className="bg-gradient-to-r from-teal-500 to-gray-800 text-white font-thin  py-[7px] font-sm rounded-full px-2 hover:bg-blue-600 flex items-center"
					>
						<Share2 className="mr-2" size={16} />
					</button>
					<div className="text-xl bottom-10 w-full md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
						{card.title}
						<br />
						<span className="text-sm text-gray-400">
							{card.author}
						</span>
					</div>
					<div className="flex items-center justify-between ">
						{/* Share Button */}
						<div className="flex items-center">
							{shareMenuOpen && (
								<div className="absolute bottom-14 left-2 bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-md z-10">
									<div className="flex justify-between items-center mb-2">
										<h4 className="text-sm font-semibold">
											Share with Friend
										</h4>
										<button
											title="Close"
											onClick={() =>
												setShareMenuOpen(false)
											}
											className="text-gray-500 hover:text-gray-800"
										>
											<XCircle size={16} />
										</button>
									</div>
									<select
										title="Select Friend"
										className="w-full p-2 border rounded-md dark:bg-gray-700 mb-2"
										value={selectedFriendId}
										onChange={(e) =>
											setSelectedFriendId(e.target.value)
										}
									>
										<option value="">Select Friend</option>
										{friends.map((friend) => (
											<option
												key={friend._id}
												value={friend._id}
											>
												{friend.name}
											</option>
										))}
									</select>
									<button
										onClick={handleShare}
										className="bg-blue-500 text-white py-1 px-3 rounded-md w-full hover:bg-blue-600 transition flex items-center justify-center"
										disabled={loading}
									>
										{loading ? (
											<Loader2
												className="animate-spin"
												size={16}
											/>
										) : (
											"Share"
										)}
									</button>
								</div>
							)}
						</div>
						{/* Request Button */}
						<button
							onClick={openModal}
							className="bg-gradient-to-r from-teal-500 to-gray-800 text-white font-thin px-2 py-[7px] font-sm rounded hover:bg-blue-600 flex items-center"
						>
							Request
						</button>
					</div>
				</div>
			</div>
		);
	}
);

Card.displayName = "Card";

export function FocusCards({ cards }: { cards: any[] }) {
	const [hovered, setHovered] = useState<number | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedBookId, setSelectedBookId] = useState<string | null>(null); // Track selected book ID

	const openModal = (bookId: string) => {
		setSelectedBookId(bookId);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedBookId(null);
	};

	const [friends, setFriends] = useState<Friend[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchFriends = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/get-all-friends");
			const data = await response.json();
			if (response.ok) setFriends(data.friends);
		} catch {
			toast.error("Failed to fetch friends");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (cards) fetchFriends();
	}, [cards]);

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
			{loading ? (
				<div className="flex items-center justify-center h-96">
					<Loader2 size={48} />
				</div>
			) : (
				cards.map((card: any, index: number) => (
					<Card
						key={index}
						card={card}
						index={index}
						hovered={hovered}
						setHovered={setHovered}
						openModal={() => openModal(card.id)} // Pass book ID to openModal
						friends={friends}
					/>
				))
			)}

			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg relative">
						<button
							onClick={closeModal}
							className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
						>
							&times;
						</button>
						<ModalReq
							isOpen={isModalOpen}
							onClose={closeModal}
							bookId={selectedBookId}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
