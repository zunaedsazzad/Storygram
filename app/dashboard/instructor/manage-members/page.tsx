"use client";
import { Spin } from "antd";
import { useState, useEffect } from "react";
import { User } from "lucide-react";

interface Member {
	firstName: string;
	lastName: string;
	role: string;
	profilePicture?: string;
	email: string;
}

export default function ManageMember() {
	const [members, setMembers] = useState<Member[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchMembers() {
			setLoading(true);
			const res = await fetch("/api/dashboard/clubs");
			const data = await res.json();
			setMembers(data.members);
			setLoading(false);
		}
		fetchMembers();
	}, []);

	async function handleRemoveMember(index: number) {
		const member = members[index];
		const res = await fetch("/api/dashboard/clubs/add-member", {
			method: "DELETE",
			body: JSON.stringify({ email: member.email }),
		});

		if (res.ok) {
			setMembers((prev) => prev.filter((_, i) => i !== index));
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen bg-gray-900">
				<Spin size="large" fullscreen />
			</div>
		);
	}

	return (
		<div className="w-full  text-white flex justify-center">
			<div className="w-full max-w-[500px] p-4 md:p-8">
				<h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-green-400">
					Members
				</h1>
				<div className="space-y-4">
					{members.map((member, index) => (
						<div
							key={member.firstName + member.lastName}
							className="flex items-center justify-between bg-gray-800 rounded-lg p-4 shadow-md space-x-4"
						>
							<div className="flex items-center space-x-4">
								{member.profilePicture ? (
									<img
										src={member.profilePicture}
										alt="Profile"
										className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
									/>
								) : (
									<User className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
								)}
								<div className="text-sm md:text-base">
									<h2 className="font-semibold">
										{member.firstName +
											" " +
											member.lastName}
									</h2>
									<p className="text-gray-400">
										{member.role === "president"
											? "President"
											: member.role === "vicepresident"
											? "Vice President"
											: member.role === "treasurer"
											? "Treasurer"
											: "General Secretary"}
									</p>
								</div>
							</div>
							<button
								onClick={() => handleRemoveMember(index)}
								className="bg-red-500 hover:bg-red-600 shadow-md py-2 px-4 rounded-lg text-black font-bold"
							>
								Retire
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
