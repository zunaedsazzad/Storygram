"use client";
import { BadgeCheck, Clock } from "lucide-react";
import { Spin } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./add/style.css";
import { useRouter } from "next/navigation";

interface Event {
	_id: string;
	name: string;
	description: string;
	cover: string;
	startDate: Date;
	endDate: Date;
	ocaApproval: boolean;
	instructorApproval: boolean;
}

export default function Events() {
	const [loading, setLoading] = useState(false);
	const [events, setEvents] = useState<Event[]>([]);
	const router = useRouter();

	useEffect(() => {
		async function fetchEvents() {
			setLoading(true);
			const response = await fetch("/api/dashboard/clubs/add-event");
			const data = await response.json();
			setEvents(data.events);
			setLoading(false);
		}
		fetchEvents();
	}, []);

	return (
		<div className="h-screen-no-nav w-full overflow-hidden pb-32">
			{loading && <Spin size="large" fullscreen />}
			<div className="rounded-lg p-2 h-fit flex justify-between items-center mb-6">
				<h2 className="font-semibold text-2xl">Events</h2>
				<Link
					href="/dashboard/clubs/events/add"
					className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
				>
					Add New
				</Link>
			</div>
			<div className="flex-1 p-2 h-full text-gray-100">
				{events.length === 0 ? (
					<div className="flex items-center justify-center h-full">
						<p className="text-lg text-gray-500">No events found</p>
					</div>
				) : (
					<div className="grid h-full py-4 container-class overflow-y-scroll gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
						{events.map((event) => (
							<Card
								key={event._id}
								router={router}
								event={event}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

function Card({ event, router }: { event: Event; router: any }) {
	return (
		<div className="rounded-lg flex flex-col w-full h-fit p-4 bg-gray-800 text-gray-200 shadow-lg mb-4 max-w-md mx-auto">
			<img
				src={event.cover}
				alt={`${event.name} cover image`}
				className="rounded-lg mb-4 w-full object-cover h-48"
				width={400}
				height={200}
			/>
			<Link
				href={`/events/${event._id}`}
				className="font-semibold text-2xl mb-2 hover:underline"
			>
				{event.name}
			</Link>
			<p className="text-gray-400 mb-4">
				{event.description.slice(0, 100) +
					(event.description.length > 100 ? "..." : "")}
			</p>
			<p className="text-sm text-gray-500">
				{new Date(event.startDate).toLocaleString()} -{" "}
			</p>
			<p className="text-sm text-gray-500">
				{new Date(event.endDate).toLocaleString()}
			</p>
			<div className="flex gap-2 flex-col items-center w-full h-full mt-4">
				<div className="flex w-full h-full items-center gap-2">
					<div className="flex w-full gap-1">
						{event.instructorApproval ? (
							<span className="flex w-full items-center bg-green-600 text-gray-200 px-2 py-1 rounded-lg text-xs">
								<BadgeCheck className="mr-1 h-4 w-4" />
								Instructor Approved
							</span>
						) : (
							<span className="flex w-full font-semibold text-black items-center bg-yellow-600 px-2 py-1 rounded-lg text-xs">
								<Clock className="mr-1 h-4 w-4" />
								Instructor Pending
							</span>
						)}
						{event.ocaApproval ? (
							<span className="flex w-full items-center bg-green-600 text-gray-200 px-2 py-1 rounded-lg text-xs">
								<BadgeCheck className="mr-1 h-4 w-4" />
								OCA Approved
							</span>
						) : (
							<span className="flex w-full font-semibold text-black items-center bg-yellow-600 px-2 py-1 rounded-lg text-xs">
								<Clock className="mr-1 h-4 w-4" />
								OCA Pending
							</span>
						)}
					</div>
				</div>
				<div className="h-full w-full">
					<button
						onClick={() =>
							router.push(`/dashboard/clubs/events/${event._id}`)
						}
						className="text-white rounded-lg py-2 h-full w-full bg-slate-900 hover:bg-slate-950 font-semibold"
					>
						View Budget
					</button>
				</div>
			</div>
		</div>
	);
}
