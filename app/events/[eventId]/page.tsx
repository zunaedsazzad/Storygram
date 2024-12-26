"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Spin } from "antd";
import { User } from "lucide-react";
import toast from "react-hot-toast";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import Link from "next/link";
import "./style.css";
import { SparklesCore } from "@/components/ui/sparkles";

interface Budget {
	_id: string;
	name: string;
	proposedAmount: number;
	approvedAmount?: number;
	spentAmount?: number;
}

interface Club {
	_id: string;
	clubName: string;
	description: string;
	logo: string;
}

interface Room {
	_id: string;
	roomNumber: string;
}

interface Event {
	name: string;
	description: string;
	objective: string;
	impact: string;
	startDate: Date;
	endDate: Date;
	numberOfAttendees: number;
	budget: Budget[];
	cover: string;
	rooms: Room[];
	club: Club;
}

export default function EventPage() {
	const [event, setEvent] = useState<Event | null>(null);
	const [loading, setLoading] = useState(true);
	const { eventId } = useParams();

	useEffect(() => {
		async function fetchEvent() {
			const response = await fetch(`/api/events/${eventId}`);
			const data = await response.json();
			if (response.status === 200) {
				setEvent(data.event);
			} else {
				toast.error("Failed to load event");
			}
			setLoading(false);
		}
		fetchEvent();
	}, [eventId]);

	if (loading) return <Spin size="large" fullscreen />;

	const budgetChartData = {
		labels: event?.budget.map((b) => b.name),
		datasets: [
			{
				label: "Proposed Amount",
				data: event?.budget.map((b) => b.proposedAmount),
				backgroundColor: "#6366F1",
			},
			{
				label: "Approved Amount",
				data: event?.budget.map((b) => b.approvedAmount || 0),
				backgroundColor: "#10B981",
			},
			{
				label: "Spent Amount",
				data: event?.budget.map((b) => b.spentAmount || 0),
				backgroundColor: "#EF4444",
			},
		],
	};

	const budgetChartOptions = {
		indexAxis: "y" as const,
		scales: {
			x: {
				ticks: {
					color: "white",
				},
				grid: {
					color: "rgba(255, 255, 255, 0.2)",
				},
			},
			y: {
				ticks: {
					color: "white",
				},
				grid: {
					color: "rgba(255, 255, 255, 0.2)",
				},
			},
		},
		plugins: {
			legend: {
				labels: {
					color: "white",
				},
			},
		},
		maintainAspectRatio: false,
	};

	return (
		<div className="text-gray-100 xl:px-96 w-full h-full container-class overflow-y-scroll">
			<div className="w-full p-6 flex justify-center">
				<div className="relative w-full h-72 md:h-96">
					<img
						src={event?.cover}
						alt={event?.name}
						className="w-full rounded-lg h-full object-cover"
					/>
					<div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
						<h1 className="2xl:text-8xl font-rogan tracking-wider xl:text-7xl lg:text-6xl md:text-5xl sm:text-4xl text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
							{event?.name}
						</h1>
					</div>
				</div>
			</div>

			<div className="p-6 w-full space-y-6 container-class">
				<Link
					href={`/clubs/${event?.club._id}`}
					className="bg-gray-800 hover:underline rounded-lg p-6 shadow-md flex items-center"
				>
					{event?.club.logo ? (
						<img
							src={event.club.logo}
							alt={`${event.club.clubName} logo`}
							className="w-16 h-16 rounded-lg mr-4"
						/>
					) : (
						<div className="w-16 h-16 bg-gray-700 flex items-center justify-center rounded-lg mr-4">
							<User size={32} />
						</div>
					)}
					<div>
						<h2 className="text-2xl font-semibold">
							{event?.club.clubName}
						</h2>
						<p>{event?.club.description}</p>
					</div>
				</Link>

				<div className="bg-gray-800 rounded-lg p-6 shadow-md">
					<h2 className="text-2xl font-semibold mb-4">
						Event Details
					</h2>
					<p>{event?.description}</p>
					<div className="flex flex-col sm:flex-row sm:justify-between mt-4 space-y-2 sm:space-y-0">
						{event && event.startDate && (
							<p>
								<strong>Start Date:</strong>{" "}
								{new Date(event?.startDate).toLocaleString()}
							</p>
						)}
						{event && event.endDate && (
							<p>
								<strong>End Date:</strong>{" "}
								{new Date(event?.endDate).toLocaleString()}
							</p>
						)}

						<p>
							<strong>Attendees:</strong>{" "}
							{event?.numberOfAttendees}
						</p>
					</div>
				</div>

				<div className="bg-gray-800 rounded-lg p-6 shadow-md space-y-4">
					<h2 className="text-2xl font-semibold">Budget</h2>

					<div className="flex gap-4 items-center">
						<div className="">
							<p className="text-lg ">Total Budget</p>
						</div>
						<div className="text-violet-600 text-2xl font-bold">
							<p>
								$
								{event?.budget.reduce(
									(acc, item) => acc + item.proposedAmount,
									0
								)}
							</p>
						</div>
					</div>
					<div className="flex gap-4 items-center">
						<div className="">
							<p className="text-lg ">Total Approved</p>
						</div>
						<div className="text-violet-600 text-2xl font-bold">
							<p>
								$
								{event?.budget.reduce(
									(acc, item) =>
										acc + (item.approvedAmount || 0),
									0
								)}
							</p>
						</div>
					</div>
					<div className="flex gap-4 items-center">
						<div className="">
							<p className="text-lg ">Total Spent</p>
						</div>
						<div className="text-violet-600 text-2xl font-bold">
							<p>
								$
								{event?.budget.reduce(
									(acc, item) =>
										acc + (item.spentAmount || 0),
									0
								)}
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						{event?.budget.map((item) => (
							<div
								key={item._id}
								className="p-4 bg-gray-700 rounded-lg text-center"
							>
								<h3 className="text-lg font-semibold">
									{item.name}
								</h3>
								<p>Proposed: ${item.proposedAmount}</p>
								<p>Approved: ${item.approvedAmount || 0}</p>
								<p>Spent: ${item.spentAmount || 0}</p>
							</div>
						))}
					</div>
					<div className="p-4 bg-gray-700 rounded-lg h-96">
						<Bar
							data={budgetChartData}
							options={budgetChartOptions}
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-gray-800 rounded-lg p-6 shadow-md">
						<h2 className="text-xl font-semibold mb-2">
							Objective
						</h2>
						<p>{event?.objective}</p>
					</div>
					<div className="bg-gray-800 rounded-lg p-6 shadow-md">
						<h2 className="text-xl font-semibold mb-2">Impact</h2>
						<p>{event?.impact}</p>
					</div>
				</div>

				<div className="bg-gray-800 rounded-lg p-6 shadow-md">
					<h2 className="text-2xl font-semibold">Assigned Rooms</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
						{event?.rooms.map((room) => (
							<div
								key={room._id}
								className="p-4 bg-gray-700 rounded-lg text-center"
							>
								<p className="text-lg font-semibold">
									Room {room.roomNumber}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
