"use client";
import { useEffect, useState } from "react";
import { Heart, Loader2, Image as PlaceholderImage } from "lucide-react";
import toast from "react-hot-toast";

interface Club {
	_id: string;
	name: string;
	aboutMe: string;
	address: string;
	division: string;
	district: string;
	photo: string | null;
	isJoined: boolean;
}

export default function Clubs() {
	const [joinedClubs, setJoinedClubs] = useState<Club[]>([]);
	const [notJoinedClubs, setNotJoinedClubs] = useState<Club[]>([]);
	const [loading, setLoading] = useState(false);
	const [favLoading, setFavLoading] = useState<string | null>(null);

	useEffect(() => {
		const fetchClubs = async () => {
			setLoading(true);
			try {
				const response = await fetch("/api/club");
				const data = await response.json();
				if (response.ok) {
					setJoinedClubs(
						data.organizations.filter((club: Club) => club.isJoined)
					);
					setNotJoinedClubs(
						data.organizations.filter(
							(club: Club) => !club.isJoined
						)
					);
				} else {
					toast.error(data.message || "Failed to fetch clubs.");
				}
			} catch (error) {
				toast.error("An error occurred while fetching clubs.");
			} finally {
				setLoading(false);
			}
		};

		fetchClubs();
	}, []);

	const toggleFavorite = async (clubId: string) => {
		setFavLoading(clubId);
		try {
			const response = await fetch("/api/favourite", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ clubId }),
			});
			const data = await response.json();
			if (response.ok) {
				if (data.action === "added") {
					const toggledClub = notJoinedClubs.find(
						(club) => club._id === clubId
					);
					if (toggledClub) {
						setNotJoinedClubs((prev) =>
							prev.filter((club) => club._id !== clubId)
						);
						setJoinedClubs((prev) => [
							...prev,
							{ ...toggledClub, isJoined: true },
						]);
					}
				} else {
					const toggledClub = joinedClubs.find(
						(club) => club._id === clubId
					);
					if (toggledClub) {
						setJoinedClubs((prev) =>
							prev.filter((club) => club._id !== clubId)
						);
						setNotJoinedClubs((prev) => [
							...prev,
							{ ...toggledClub, isJoined: false },
						]);
					}
				}
				toast.success(data.message);
			} else {
				toast.error(data.message || "Failed to toggle favorite.");
			}
		} catch (error) {
			toast.error("An error occurred while toggling favorite.");
		} finally {
			setFavLoading(null);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4">
			<h1 className="text-2xl font-bold mb-6 text-center">Clubs</h1>
			{loading && (
				<div className="flex justify-center items-center py-4">
					<Loader2
						className="animate-spin text-gray-500 dark:text-gray-400"
						size={32}
					/>
				</div>
			)}
			<div className="mb-8">
				<h2 className="text-xl font-semibold mb-4">Your Clubs</h2>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{joinedClubs.map((club) => (
						<div
							key={club._id}
							className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 relative"
						>
							<button
								onClick={() => toggleFavorite(club._id)}
								className={`absolute top-4 right-4 ${
									club.isJoined
										? "text-red-600"
										: "text-gray-400"
								} hover:text-red-800 transition`}
								disabled={favLoading === club._id}
							>
								{favLoading === club._id ? (
									<Loader2
										className="animate-spin"
										size={40}
									/>
								) : (
									<Heart
										fill={
											club.isJoined
												? "currentColor"
												: "none"
										}
										size={48}
									/>
								)}
							</button>
							{club.photo ? (
								<img
									src={club.photo}
									alt={club.name}
									className="w-full h-40 object-cover rounded-lg mb-4"
								/>
							) : (
								<div className="w-full h-40 flex justify-center items-center bg-gray-200 dark:bg-gray-700 rounded-lg mb-4">
									<PlaceholderImage
										size={40}
										className="text-gray-400"
									/>
								</div>
							)}
							<h3 className="text-lg font-semibold">
								{club.name}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
								{club.aboutMe}
							</p>
							<div className="mt-4">
								<p className="text-sm font-medium">
									Address: {club.address}
								</p>
								<p className="text-sm font-medium">
									Division: {club.division}
								</p>
								<p className="text-sm font-medium">
									District: {club.district}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
			<div>
				<h2 className="text-xl font-semibold mb-4">Suggested Clubs</h2>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{notJoinedClubs.map((club) => (
						<div
							key={club._id}
							className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 relative"
						>
							<button
								onClick={() => toggleFavorite(club._id)}
								className={`absolute top-4 right-4 ${
									club.isJoined
										? "text-red-600"
										: "text-gray-400"
								} hover:text-red-800 transition`}
								disabled={favLoading === club._id}
							>
								{favLoading === club._id ? (
									<Loader2
										className="animate-spin"
										size={40}
									/>
								) : (
									<Heart
										fill={
											club.isJoined
												? "currentColor"
												: "none"
										}
										size={48}
									/>
								)}
							</button>
							{club.photo ? (
								<img
									src={club.photo}
									alt={club.name}
									className="w-full h-40 object-cover rounded-lg mb-4"
								/>
							) : (
								<div className="w-full h-40 flex justify-center items-center bg-gray-200 dark:bg-gray-700 rounded-lg mb-4">
									<PlaceholderImage
										size={40}
										className="text-gray-400"
									/>
								</div>
							)}
							<h3 className="text-lg font-semibold">
								{club.name}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
								{club.aboutMe}
							</p>
							<div className="mt-4">
								<p className="text-sm font-medium">
									Address: {club.address}
								</p>
								<p className="text-sm font-medium">
									Division: {club.division}
								</p>
								<p className="text-sm font-medium">
									District: {club.district}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
