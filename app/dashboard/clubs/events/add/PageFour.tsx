"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import "./style.css";
import CoverUpload from "@/components/imageUpload/CoverUpload";
import { Spin } from "antd";

interface Budget {
	name: string;
	proposedAmount: number;
}

interface Room {
	roomNumber: string;
}

interface Event {
	name?: string;
	description?: string;
	objective?: string;
	impact?: string;
	startDate: Date;
	endDate: Date;
	numberOfAttendees?: number;
	budget: Budget[];
	cover: string;
	rooms: Room[];
}

export default function ImageForm({
	event,
	setEvent,
	setCurrentPage,
}: {
	event: Event;
	setEvent: (event: Event) => void;
	setCurrentPage: (page: number) => void;
}) {
	const [cover, setCover] = useState<string>("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		if (!cover) {
			toast.error("Please add a cover image");
			return;
		}
		const tempEvent = { ...event, cover: cover };
		setLoading(true);
		const response = await fetch("/api/dashboard/clubs/add-event", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ event: tempEvent }),
		});
		const data = await response.json();
		if (response.status === 200) {
			setCurrentPage(5);
		} else {
			toast.error(data.message);
		}
		setLoading(false);
	};

	return (
		<div className="h-full flex justify-center pb-16">
			{loading && <Spin size="large" fullscreen />}
			<div className="w-full h-full px-4 flex items-center justify-center text-white">
				<div className="p-8 rounded-lg h-full shadow-lg w-full  overflow-y-auto container-class">
					<h2 className="text-2xl font-bold mb-6 text-center">
						Add Cover Image
					</h2>

					{!cover && (
						<CoverUpload
							onChange={(url: string) => {
								setCover(url);
							}}
						/>
					)}

					{cover && (
						<div className="flex items-center justify-center">
							<img
								src={cover}
								alt="cover"
								className="w-1/2 h-1/2"
							/>
						</div>
					)}

					{cover && (
						<div className="flex items-center w-full justify-center">
							<button
								onClick={() => setCover("")}
								className="bg-gradient-to-br max-w-64 relative group/btn from-red-900 to-red-900 w-full text-white rounded-md h-10 font-medium mt-6"
							>
								Remove Cover Image
								<BottomGradient />
							</button>
						</div>
					)}

					<div className="flex gap-4">
						<button
							onClick={() => setCurrentPage(3)}
							className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 w-full text-white rounded-md h-10 font-medium mt-6"
						>
							&larr; Back
							<BottomGradient />
						</button>
						<button
							onClick={handleSubmit}
							className="bg-gradient-to-br relative group/btn from-green-900 to-green-900 w-full text-white rounded-md h-10 font-medium mt-6"
						>
							Submit
							<BottomGradient />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

const BottomGradient = () => {
	return (
		<>
			<span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
			<span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
		</>
	);
};
