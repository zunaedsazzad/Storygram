"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Spin } from "antd";

import { useState } from "react";

export default function AddClub() {
	const [clubName, setClubName] = useState("");
	const [presidentEmail, setPresidentEmail] = useState("");
	const [instructorEmail, setInstructorEmail] = useState("");
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setLoading(true);
			const res = await fetch("/api/dashboard/oca/add-club", {
				method: "POST",
				body: JSON.stringify({
					clubName,
					presidentEmail,
					instructorEmail,
				}),
			});
			const data = await res.json();
			if (res.ok) {
				setSuccess(data.message);
				setError("");
				setClubName("");
				setPresidentEmail("");
				setInstructorEmail("");
			} else {
				setError(data.message);
				setSuccess("");
			}
			setLoading(false);
		} catch (err) {
			setError("Failed to send invitation");
			setSuccess("");
			setLoading(false);
		}
	};

	return (
		<div className="w-full h-full px-4 flex items-center justify-center text-white">
			<form
				onSubmit={handleSubmit}
				className="bg-black p-8 rounded-lg shadow-lg w-full max-w-md"
			>
				<h2 className="text-2xl font-bold mb-6 text-center">
					Add A New Club
				</h2>
				<div className="flex flex-col gap-4">
					<LabelInputContainer>
						<Label htmlFor="clubname">Club Name</Label>
						<Input
							id="clubname"
							placeholder="Enter Club Name"
							type="text"
							value={clubName}
							onChange={(e) => setClubName(e.target.value)}
						/>
					</LabelInputContainer>
					<LabelInputContainer className="">
						<Label htmlFor="email">
							Club President&apos;s Email
						</Label>
						<Input
							id="email"
							placeholder="Enter President's Email"
							type="email"
							value={presidentEmail}
							onChange={(e) => setPresidentEmail(e.target.value)}
						/>
					</LabelInputContainer>
					<LabelInputContainer className="mb-4">
						<Label htmlFor="email_instructor">
							Club Instructor&apos;s Email
						</Label>
						<Input
							id="email_instructor"
							placeholder="Enter Instructor's Email"
							type="email"
							value={instructorEmail}
							onChange={(e) => setInstructorEmail(e.target.value)}
						/>
					</LabelInputContainer>
				</div>
				{loading && (
					<div className="w-full flex justify-center">
						<Spin />
					</div>
				)}
				{!loading && (
					<button
						className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium "
						type="submit"
					>
						Add &rarr;
						<BottomGradient />
					</button>
				)}

				{success && (
					<p className="mt-4 text-green-500 text-center">{success}</p>
				)}
				{error && (
					<p className="mt-4 text-red-500 text-center">{error}</p>
				)}
			</form>
		</div>
	);
}

const LabelInputContainer = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div className={cn("flex flex-col space-y-2 w-full", className)}>
			{children}
		</div>
	);
};

const BottomGradient = () => {
	return (
		<>
			<span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
			<span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
		</>
	);
};
