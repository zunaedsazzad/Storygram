"use client";
import { useEffect, useState } from "react";
import { Calendar, CheckCircle, MinusCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Event {
	_id: string;
	eventName: string;
	eventDate: string;
	eventDescription: string;
	eventLocation: string;
	club: { _id: string; name: string };
	isAttending: boolean;
}

export default function Events() {
	const [events, setEvents] = useState<Event[]>([]);
	const [attendingEvents, setAttendingEvents] = useState<Event[]>([]);
	const [notAttendingEvents, setNotAttendingEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(false);
	const [actionLoading, setActionLoading] = useState<string | null>(null);

	useEffect(() => {
		const fetchEvents = async () => {
			setLoading(true);
			try {
				const response = await fetch("/api/events");
				const data = await response.json();
				if (response.ok) {
					setEvents(data.events);
					setAttendingEvents(
						data.events.filter((event: Event) => event.isAttending)
					);
					setNotAttendingEvents(
						data.events.filter((event: Event) => !event.isAttending)
					);
				} else {
					toast.error(data.message || "Failed to fetch events.");
				}
			} catch (error) {
				toast.error("An error occurred while fetching events.");
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);

	const toggleAttendance = async (eventId: string) => {
		setActionLoading(eventId);
		try {
			const response = await fetch("/api/club/event", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ eventId }),
			});
			const data = await response.json();
			if (response.ok) {
				const updatedEvents = events.map((event) =>
					event._id === eventId
						? { ...event, isAttending: data.attending }
						: event
				);
				setEvents(updatedEvents);
				setAttendingEvents(
					updatedEvents.filter((event) => event.isAttending)
				);
				setNotAttendingEvents(
					updatedEvents.filter((event) => !event.isAttending)
				);
				toast.success(data.message);
			} else {
				toast.error(data.message || "Failed to toggle attendance.");
			}
		} catch (error) {
			toast.error("An error occurred while toggling attendance.");
		} finally {
			setActionLoading(null);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4">
			<h1 className="text-2xl font-bold mb-6 text-center">Events</h1>
			{loading && (
				<div className="flex justify-center items-center py-4">
					<Loader2
						className="animate-spin text-gray-500 dark:text-gray-400"
						size={32}
					/>
				</div>
			)}
			<div className="mb-8">
				<h2 className="text-xl font-semibold mb-4">Attending Events</h2>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{attendingEvents.map((event) => (
						<EventCard
							key={event._id}
							event={event}
							actionLoading={actionLoading === event._id}
							onToggle={() => toggleAttendance(event._id)}
						/>
					))}
				</div>
			</div>
			<div>
				<h2 className="text-xl font-semibold mb-4">
					Not Attending Events
				</h2>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{notAttendingEvents.map((event) => (
						<EventCard
							key={event._id}
							event={event}
							actionLoading={actionLoading === event._id}
							onToggle={() => toggleAttendance(event._id)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

function EventCard({
	event,
	actionLoading,
	onToggle,
}: {
	event: Event;
	actionLoading: boolean;
	onToggle: () => void;
}) {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 relative">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold">{event.eventName}</h3>
				<button
					onClick={onToggle}
					disabled={actionLoading}
					className="text-sm flex items-center gap-1 bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
				>
					{actionLoading ? (
						<Loader2 className="animate-spin" size={16} />
					) : event.isAttending ? (
						<MinusCircle size={16} />
					) : (
						<CheckCircle size={16} />
					)}
					{event.isAttending ? "Remove" : "Attend"}
				</button>
			</div>
			<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
				<Calendar size={16} className="inline-block mr-2" />
				{new Date(event.eventDate).toLocaleString()}
			</p>
			<p className="text-sm text-gray-600 dark:text-gray-400">
				{event.eventDescription}
			</p>
			<p className="text-sm font-medium mt-4">
				Location: {event.eventLocation}
			</p>
			<p className="text-sm font-medium">Club: {event.club.name}</p>
		</div>
	);
}
