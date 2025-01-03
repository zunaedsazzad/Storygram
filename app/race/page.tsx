"use client";
import { useState, useEffect } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { PlusCircle, Expand, XCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

interface Friend {
	_id: string;
	name: string;
	email: string;
	clerkId: string;
}

interface Race {
	_id: string;
	bookName: string;
	totalPage: number;
	invitor: Friend;
	invitee: Friend;
	invitorRead: number;
	inviteeRead: number;
	invitationAccepted: boolean;
	isExpired: boolean;
}

export default function Race() {
	const { user, isLoaded } = useUser();
	const clerkId = user?.id;
	const [friends, setFriends] = useState<Friend[]>([]);
	const [races, setRaces] = useState<Race[]>([]);
	const [formData, setFormData] = useState({
		inviteeId: "",
		bookName: "",
		totalPage: "",
	});
	const [selectedRace, setSelectedRace] = useState<Race | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [progress, setProgress] = useState("");
	const [loading, setLoading] = useState(false);
	const [formLoading, setFormLoading] = useState(false);

	useEffect(() => {
		if (isLoaded) fetchFriends();
		if (isLoaded) fetchRaces();
	}, [isLoaded]);

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

	const fetchRaces = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/race");
			const data = await response.json();
			if (response.ok) setRaces(data.races);
		} catch {
			toast.error("Failed to fetch races");
		} finally {
			setLoading(false);
		}
	};

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormLoading(true);
		try {
			const response = await fetch("/api/race", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					totalPage: Number(formData.totalPage),
				}),
			});
			const data = await response.json();
			if (response.ok) {
				toast.success("Race created successfully");
				setFormData({ inviteeId: "", bookName: "", totalPage: "" });
				fetchRaces();
			} else toast.error(data.message || "Failed to create race");
		} catch {
			toast.error("An error occurred while creating the race");
		} finally {
			setFormLoading(false);
		}
	};

	const handleAcceptInvitation = async (raceId: string) => {
		setLoading(true);
		try {
			const response = await fetch("/api/race", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ raceId }),
			});
			const data = await response.json();
			if (response.ok) {
				toast.success("Invitation accepted");
				fetchRaces();
			} else toast.error(data.message || "Failed to accept invitation");
		} catch {
			toast.error("An error occurred while accepting the invitation");
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateProgress = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/race", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					raceId: selectedRace?._id,
					pagesRead: Number(progress),
				}),
			});
			const data = await response.json();
			if (response.ok) {
				toast.success("Progress updated successfully");
				fetchRaces();
				setModalOpen(false);
				setProgress("");
			} else toast.error(data.message || "Failed to update progress");
		} catch {
			toast.error("An error occurred while updating progress");
		} finally {
			setLoading(false);
			window.location.reload();
		}
	};

	if (!isLoaded) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="animate-spin text-gray-500" size={40} />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
			<h1 className="text-2xl font-bold mb-6 text-center">Race</h1>
			<form
				onSubmit={handleFormSubmit}
				className="grid gap-4 grid-cols-1 sm:grid-cols-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8"
			>
				<select
					title="Select Friend"
					value={formData.inviteeId}
					onChange={(e) =>
						setFormData({ ...formData, inviteeId: e.target.value })
					}
					className="p-2 border rounded-md dark:bg-gray-700"
					required
				>
					<option value="">Select Friend</option>
					{friends.map((friend) => (
						<option key={friend._id} value={friend._id}>
							{friend.name}
						</option>
					))}
				</select>
				<input
					type="text"
					placeholder="Book Name"
					className="p-2 border rounded-md dark:bg-gray-700"
					value={formData.bookName}
					onChange={(e) =>
						setFormData({ ...formData, bookName: e.target.value })
					}
					required
				/>
				<input
					type="number"
					placeholder="Total Pages"
					className="p-2 border rounded-md dark:bg-gray-700"
					value={formData.totalPage}
					onChange={(e) =>
						setFormData({ ...formData, totalPage: e.target.value })
					}
					required
				/>
				<button
					type="submit"
					className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
					disabled={formLoading}
				>
					{formLoading ? (
						<Loader2
							className="animate-spin inline mr-2"
							size={16}
						/>
					) : (
						<PlusCircle className="inline mr-2" />
					)}
					Add Race
				</button>
			</form>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{loading ? (
					<div className="flex items-center justify-center col-span-full">
						<Loader2
							className="animate-spin text-gray-500"
							size={40}
						/>
					</div>
				) : (
					races.map((race) => (
						<div
							key={race._id}
							className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md relative"
						>
							<h3 className="text-lg font-semibold">
								{race.bookName}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Total Pages: {race.totalPage}
							</p>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Invitor: {race.invitor.name}
							</p>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Invitee: {race.invitee.name}
							</p>
							{race.isExpired ? (
								<span className="text-red-500 font-semibold">
									Race Ended
								</span>
							) : race.invitationAccepted ? (
								<span className="text-green-500 font-semibold">
									Ongoing
								</span>
							) : race.invitor.clerkId === clerkId ? (
								<span className="text-yellow-500 font-semibold">
									Invitation Pending
								</span>
							) : (
								<button
									onClick={() =>
										handleAcceptInvitation(race._id)
									}
									className="text-blue-500 hover:underline"
								>
									Accept Invitation
								</button>
							)}
							{race.invitationAccepted && (
								<button
									title="Update Progress"
									onClick={() => {
										setSelectedRace(race);
										setModalOpen(true);
									}}
									className="absolute top-4 right-4 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 p-2 rounded-full"
								>
									<Expand />
								</button>
							)}
						</div>
					))
				)}
			</div>
			{modalOpen && selectedRace && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-lg relative shadow-lg max-w-lg w-full">
						<button
							title="Close Modal"
							onClick={() => setModalOpen(false)}
							className="absolute top-4 right-4 text-gray-600 dark:text-gray-400"
						>
							<XCircle size={24} />
						</button>
						<h3 className="text-lg font-semibold mb-4">
							{selectedRace.bookName}
						</h3>
						<div>
							<Bar
								data={{
									labels: ["Invitor", "Invitee"],
									datasets: [
										{
											label: "Pages Read",
											data: [
												selectedRace.invitorRead,
												selectedRace.inviteeRead,
											],
											backgroundColor: [
												"#4caf50",
												"#2196f3",
											],
										},
									],
								}}
								options={{
									responsive: true,
									plugins: {
										legend: { display: true },
										title: {
											display: true,
											text: "Race Progress",
										},
									},
									scales: {
										x: {
											title: {
												display: true,
												text: "Participants",
											},
										},
										y: {
											beginAtZero: true,
											max: selectedRace.totalPage,
											title: {
												display: true,
												text: "Pages Read",
											},
											ticks: {
												stepSize: 0,
											},
										},
									},
								}}
							/>
						</div>
						{!selectedRace.isExpired && (
							<div className="mt-4">
								<input
									type="number"
									placeholder="Update Pages Read"
									className="p-2 border rounded-md dark:bg-gray-700 w-full"
									value={progress}
									onChange={(e) =>
										setProgress(e.target.value)
									}
								/>
								<button
									onClick={handleUpdateProgress}
									className="bg-green-500 text-white py-2 px-4 rounded-md mt-2 hover:bg-green-600 transition w-full"
									disabled={loading}
								>
									{loading ? (
										<Loader2
											className="animate-spin inline mr-2"
											size={16}
										/>
									) : (
										"Update Progress"
									)}
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
