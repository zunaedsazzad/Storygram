"use client";
import { useEffect, useState } from "react";
import { User as UserIcon } from "lucide-react";
import ImageUpload from "@/components/imageUpload/ImageUpload";
import { Spin } from "antd";

interface Club {
	clubName: string;
	description?: string;
	logo?: string;
}

export default function EditClub() {
	const [club, setClub] = useState<Club | null>(null);
	const [profilePicture, setProfilePicture] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [description, setDescription] = useState<string>("");
	const [showDescription, setShowDescription] = useState(false);

	useEffect(() => {
		async function fetchUser() {
			setLoading(true);
			const res = await fetch("/api/dashboard/clubs/get-clubs");
			const data = await res.json();
			console.log(data);
			setClub(data.club);
			if (data.club.description) {
				setDescription(data.club.description);
			}
			setLoading(false);
		}
		fetchUser();
	}, []);

	async function updateDP(url: string) {
		setProfilePicture(url);
		setLoading(true);
		const res = await fetch("/api/dashboard/clubs/get-clubs", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ url: url, description: "" }),
		});
		const data = await res.json();
		setClub(data.club);
		setLoading(false);
	}

	async function updateDescription() {
		setLoading(true);
		const res = await fetch("/api/dashboard/clubs/get-clubs", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ url: "", description: description }),
		});
		const data = await res.json();
		setClub(data.club);
		setDescription(data.club.description);
		setLoading(false);
		setShowDescription(false);
	}

	return (
		<div className="flex w-full items-center justify-center min-h-screenp-4">
			{club && !loading && (
				<div className=" text-white p-8 rounded-lg shadow-lg w-full max-w-md md:max-w-lg flex flex-col items-center space-y-6">
					<div className="relative w-64 h-64 rounded-md overflow-hidden bg-gray-700 flex items-center justify-center">
						{club.logo || profilePicture ? (
							<img
								src={profilePicture || club.logo}
								alt="Profile"
								className="w-full h-full object-cover"
							/>
						) : (
							<UserIcon className="w-64 h-64 text-gray-500" />
						)}
					</div>
					<div>
						<ImageUpload onChange={(url) => updateDP(url)} />
					</div>
					<div className="text-center">
						<div className="text-3xl font-bold text-green-400">
							{club.clubName}
						</div>
						{!showDescription && (
							<div className="text-gray-400 mt-4 text-lg">
								{club.description}
							</div>
						)}

						{!club.description && !showDescription && (
							<button
								className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 w-full text-white rounded-lg mt-4"
								onClick={() => setShowDescription(true)}
							>
								Add a description
							</button>
						)}
						{club.description && !showDescription && (
							<button
								className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 w-full text-white rounded-lg mt-4"
								onClick={() => setShowDescription(true)}
							>
								Edit description
							</button>
						)}
						{showDescription && (
							<div className="mt-4">
								<textarea
									name="description"
									title="description"
									className="w-full p-2 rounded-lg bg-slate-900 text-white"
									onChange={(e) =>
										setDescription(e.target.value)
									}
									value={description}
									rows={7}
								></textarea>
								<button
									className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 w-full text-white rounded-lg mt-4"
									onClick={updateDescription}
								>
									Save
								</button>
							</div>
						)}
					</div>
				</div>
			)}
			{loading && <Spin spinning={loading} size="large" />}
		</div>
	);
}
