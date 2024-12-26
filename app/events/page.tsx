"use client";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import "./[eventId]/style.css";

interface Club {
	_id: string;
	clubName: string;
	description: string;
	logo: string;
}

interface Event {
	name: string;
	description: string;
	startDate: Date;
	endDate: Date;
	numberOfAttendees: number;
	cover: string;
	club: Club;
	_id: string;
}

export default function EventPage() {
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchEvents() {
			setLoading(true);
			const response = await fetch("/api/events");
			const data = await response.json();
			if (response.ok) {
				setEvents(data);
			} else {
				toast.error("Failed to fetch events");
			}
			setLoading(false);
		}
		fetchEvents();
	}, []);

	return (
		<div className="h-full text-gray-100 p-8">
			{loading && <Spin fullscreen size="large" />}
			<div className="grid gap-8 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 container-class overflow-y-scroll h-full">
				{events.map((event, index) => (
					<motion.div
						key={event._id}
						className="rounded-2xl h-fit bg-gray-800 shadow-xl"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: index * 0.1, duration: 0.3 }}
						whileHover={{
							scale: 1.05,
							transition: { duration: 0.2 },
						}}
					>
						<img
							src={event.cover}
							alt={event.name}
							className="w-full h-64 object-cover rounded-t-2xl"
						/>
						<div className="p-6 space-y-4">
							<Link href={`/events/${event._id}`}>
								<h2 className="text-2xl font-semibold hover:text-gray-300 text-white cursor-pointer">
									{event.name}
								</h2>
							</Link>
							<p className="text-sm text-gray-300 line-clamp-3">
								{event.description}
							</p>
							<div className="text-sm text-gray-300">
								<p>
									<strong>Start:</strong>{" "}
									{new Date(
										event.startDate
									).toLocaleDateString()}
								</p>
								<p>
									<strong>End:</strong>{" "}
									{new Date(
										event.endDate
									).toLocaleDateString()}
								</p>
								<p>
									<strong>Attendees:</strong>{" "}
									{event.numberOfAttendees}
								</p>
							</div>
							<div className="flex items-center mt-4 space-x-4">
								{event.club.logo ? (
									<img
										src={event.club.logo}
										alt={event.club.clubName}
										className="w-12 h-12 rounded-full border-2 border-gray-700"
									/>
								) : (
									<div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-full">
										<User size={24} color="white" />
									</div>
								)}
								<div>
									<Link href={`/clubs/${event.club._id}`}>
										<p className="text-lg font-semibold hover:text-gray-300 text-white cursor-pointer">
											{event.club.clubName}
										</p>
									</Link>
									<p className="text-sm text-gray-400">
										{event.club.description}
									</p>
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}
