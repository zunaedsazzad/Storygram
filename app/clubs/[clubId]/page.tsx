"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Spin } from "antd";
import { User } from "lucide-react";
import toast from "react-hot-toast";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import Link from "next/link";
import "../style.css";

interface Budget {
	_id: string;
	name: string;
	proposedAmount: number;
	approvedAmount?: number;
	spentAmount?: number;
}

interface Event {
	_id: string;
	name: string;
	description: string;
	startDate: Date;
	endDate: Date;
	numberOfAttendees: number;
	cover: string;
	budget: Budget[];
}

interface Member {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	profilePicture?: string;
	leavedAt?: Date;
}

interface Club {
	_id: string;
	clubName: string;
	description?: string;
	logo?: string;
	events: Event[];
	members: Member[];
}

export default function ClubPage() {
	const [club, setClub] = useState<Club | null>(null);
	const [loading, setLoading] = useState(true);
	const { clubId } = useParams();

	useEffect(() => {
		async function fetchClub() {
			setLoading(true);
			const response = await fetch(`/api/clubs/${clubId}`);
			const data = await response.json();
			if (response.status === 200) {
				setClub(data.club);
			} else {
				toast.error("Failed to load club");
			}
			setLoading(false);
		}
		fetchClub();
	}, [clubId]);

	if (loading) return <Spin size="large" fullscreen />;

	const budgetData = club?.events.reduce(
		(acc, event) => {
			event.budget.forEach((b) => {
				acc.proposed += b.proposedAmount;
				acc.approved += b.approvedAmount || 0;
				acc.spent += b.spentAmount || 0;
			});
			return acc;
		},
		{ proposed: 0, approved: 0, spent: 0 }
	);

	const budgetChartData = {
		labels: ["Proposed", "Approved", "Spent"],
		datasets: [
			{
				label: "Budget",
				data: [
					budgetData?.proposed,
					budgetData?.approved,
					budgetData?.spent,
				],
				backgroundColor: ["#6366F1", "#10B981", "#EF4444"],
			},
		],
	};

	const budgetChartOptions = {
		scales: {
			x: {
				ticks: { color: "white" },
				grid: { color: "rgba(255, 255, 255, 0.2)" },
			},
			y: {
				ticks: { color: "white" },
				grid: { color: "rgba(255, 255, 255, 0.2)" },
			},
		},
		plugins: {
			legend: {
				labels: { color: "white" },
			},
		},
		maintainAspectRatio: false,
	};

	const activeMembers = club?.members.filter((member) => !member.leavedAt);
	const formerMembers = club?.members.filter((member) => member.leavedAt);

	return (
		<div className=" text-gray-100 p-8 h-full container-class overflow-y-auto">
			<div className="flex flex-col items-center space-y-6">
				<div className="flex items-center space-x-4">
					{club?.logo ? (
						<img
							src={club.logo}
							alt={`${club.clubName} logo`}
							className="w-24 h-24 rounded-full border-2 border-gray-700"
						/>
					) : (
						<div className="w-24 h-24 flex items-center justify-center bg-gray-700 rounded-full">
							<User size={48} />
						</div>
					)}
					<div>
						<h1 className="text-4xl font-bold">{club?.clubName}</h1>
						<p className="text-gray-300">{club?.description}</p>
					</div>
				</div>

				{/* Budget Summary Graph */}
				<div className="w-full bg-gray-800 rounded-lg p-6 shadow-md space-y-4">
					<h2 className="text-2xl font-semibold text-center">
						Budget Overview
					</h2>
					<div className="h-80">
						<Bar
							data={budgetChartData}
							options={budgetChartOptions}
						/>
					</div>
				</div>

				{/* Events List */}
				<div className="w-full">
					<h2 className="text-3xl font-semibold mb-6">Club Events</h2>
					<div className="grid gap-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
						{club?.events.map((event) => (
							<div
								key={event._id}
								className="bg-gray-800 rounded-lg shadow-md overflow-hidden"
							>
								<img
									src={event.cover}
									alt={event.name}
									className="w-full h-48 object-cover"
								/>
								<div className="p-4 space-y-4">
									<Link href={`/events/${event._id}`}>
										<h3 className="text-2xl font-bold hover:text-gray-300 cursor-pointer">
											{event.name}
										</h3>
									</Link>
									<p className="text-sm text-gray-300 line-clamp-3">
										{event.description}
									</p>
									<div className="text-sm text-gray-400">
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
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Members List */}
				<div className="w-full mt-10">
					<h2 className="text-3xl font-semibold mb-6">
						Club Members
					</h2>
					<div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
						{activeMembers?.map((member) => (
							<div
								key={member._id}
								className="bg-gray-800 rounded-lg p-4 shadow-md flex items-center space-x-4"
							>
								{member.profilePicture ? (
									<img
										src={member.profilePicture}
										alt={`${member.firstName} ${member.lastName}`}
										className="w-16 h-16 rounded-full border-2 border-gray-700"
									/>
								) : (
									<div className="w-16 h-16 flex items-center justify-center bg-gray-700 rounded-full">
										<User size={24} />
									</div>
								)}
								<div>
									<p className="text-lg font-semibold text-white">
										{member.firstName} {member.lastName}
									</p>
									<p className="text-sm text-gray-400">
										{member.email}
									</p>
									<p className="text-sm text-gray-300">
										<strong>Role:</strong> {member.role}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Former Members List */}
				{formerMembers && formerMembers.length > 0 && (
					<div className="w-full mt-10">
						<h2 className="text-3xl font-semibold mb-6">
							Former Members
						</h2>
						<div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
							{formerMembers.map((member) => (
								<div
									key={member._id}
									className="bg-gray-800 rounded-lg p-4 shadow-md flex items-center space-x-4"
								>
									{member.profilePicture ? (
										<img
											src={member.profilePicture}
											alt={`${member.firstName} ${member.lastName}`}
											className="w-16 h-16 rounded-full border-2 border-gray-700"
										/>
									) : (
										<div className="w-16 h-16 flex items-center justify-center bg-gray-700 rounded-full">
											<User size={24} />
										</div>
									)}
									<div>
										<p className="text-lg font-semibold text-white">
											{member.firstName} {member.lastName}
										</p>
										<p className="text-sm text-gray-400">
											{member.email}
										</p>
										<p className="text-sm text-gray-300">
											<strong>Role:</strong> {member.role}
										</p>
										<p className="text-xs text-gray-500">
											Left on{" "}
											{new Date(
												member.leavedAt!
											).toLocaleDateString()}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
