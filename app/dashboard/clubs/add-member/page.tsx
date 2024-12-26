"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Spin } from "antd";

import { useState } from "react";

export default function AddMember() {
	const [presidentEmail, setPresidentEmail] = useState("");
	const [designation, setDesignation] = useState("vicepresident");
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setLoading(true);
			const res = await fetch("/api/dashboard/clubs/add-member", {
				method: "POST",
				body: JSON.stringify({ presidentEmail, designation }),
			});
			const data = await res.json();
			if (res.ok) {
				setSuccess(data.message);
				setError("");
				setPresidentEmail("");
				setDesignation("vicepresident");
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
					Add A New Member
				</h2>

				<div className="flex flex-col gap-4 mb-4">
					<LabelInputContainer className="mb-4">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							placeholder="Enter Email"
							type="email"
							value={presidentEmail}
							onChange={(e) => setPresidentEmail(e.target.value)}
						/>
					</LabelInputContainer>
					<Label htmlFor="Designation">Designation</Label>
					<select
						title="Designation"
						id="Designation"
						value={designation}
						onChange={(e) => setDesignation(e.target.value)}
						className="bg-zinc-900 text-white rounded-md h-10 px-2"
					>
						<option value="vicepresident">Vice President</option>
						<option value="generalsecretary">
							General Secretary
						</option>
						<option value="treasurer">Treasurer</option>
					</select>
				</div>

				{loading && (
					<div className="w-full flex justify-center">
						<Spin />
					</div>
				)}
				{!loading && (
					<button
						className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
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
