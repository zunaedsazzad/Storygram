"use client";
import { use, useEffect, useState } from "react";
import { User as UserIcon } from "lucide-react";
import ImageUpload from "@/components/imageUpload/ImageUpload";
import { Spin } from "antd";

interface User {
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	profilePicture?: string;
}

export default function Profile() {
	const [user, setUser] = useState<User | null>(null);
	const [profilePicture, setProfilePicture] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchUser() {
			setLoading(true);
			const res = await fetch("/api/dashboard/clubs/profile");
			const data = await res.json();
			setUser(data.user);
			setLoading(false);
		}
		fetchUser();
	}, []);

	async function updateDP(url: string) {
		setProfilePicture(url);
		setLoading(true);
		const res = await fetch("/api/dashboard/clubs/profile", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ url }),
		});
		const data = await res.json();
		setUser(data.user);
		setLoading(false);
	}

	return (
		<div className="flex w-full items-center justify-center min-h-screenp-4">
			{user && !loading && (
				<div className=" text-white p-8 rounded-lg shadow-lg w-full max-w-md md:max-w-lg flex flex-col items-center space-y-6">
					<div className="relative w-64 h-64 rounded-md overflow-hidden bg-gray-700 flex items-center justify-center">
						{user.profilePicture || profilePicture ? (
							<img
								src={profilePicture || user.profilePicture}
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
							{user.firstName} {user.lastName}
						</div>
						<div className="text-gray-400 text-lg">
							{user.email}
						</div>
						<div className="text-yellow-400 text-lg mt-1">
							{user.role === "president"
								? "President"
								: user.role === "vicepresident"
								? "Vice President"
								: user.role === "treasurer"
								? "Treasurer"
								: user.role === "instructor"
								? "Instructor"
								: "General Secretary"}
						</div>
					</div>
				</div>
			)}
			{loading && <Spin spinning={loading} size="large" />}
		</div>
	);
}
