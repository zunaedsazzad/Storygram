"use client";
import { useEffect, useState } from "react";
import { Trash2, PlusCircle, Users, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Events() {
	const [events, setEvents] = useState<
		{
			_id: string;
			eventName: string;
			eventDate: string;
			eventDescription: string;
			eventLocation: string;
			attendees: { _id: string }[];
		}[]
	>([]);
	const [loading, setLoading] = useState(false);
	const [formLoading, setFormLoading] = useState(false);
	const [formData, setFormData] = useState({
		eventName: "",
		eventDate: "",
		eventDescription: "",
		eventLocation: "",
	});

	// Fetch events on load
	useEffect(() => {
		const fetchEvents = async () => {
			setLoading(true);
			try {
				const response = await fetch("/api/club/event");
				const data = await response.json();
				if (response.ok) {
					setEvents(data.events);
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

	// Handle form submission
	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormLoading(true);
		try {
			const response = await fetch("/api/club/event", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await response.json();
			if (response.ok) {
				setEvents((prev) => [...prev, data.event]);
				toast.success("Event added successfully!");
				setFormData({
					eventName: "",
					eventDate: "",
					eventDescription: "",
					eventLocation: "",
				});
			} else {
				toast.error(data.message || "Failed to add event.");
			}
		} catch (error) {
			toast.error("An error occurred while adding the event.");
		} finally {
			setFormLoading(false);
		}
	};

	// Handle event deletion
	const handleDelete = async (eventId: string) => {
		setLoading(true);
		try {
			const response = await fetch("/api/club/event", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ eventId }),
			});
			const data = await response.json();
			if (response.ok) {
				setEvents((prev) =>
					prev.filter((event) => event._id !== eventId)
				);
				toast.success("Event deleted successfully!");
			} else {
				toast.error(data.message || "Failed to delete event.");
			}
		} catch (error) {
			toast.error("An error occurred while deleting the event.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4">
			<h1 className="text-2xl font-bold mb-6 text-center">
				Manage Your Events
			</h1>

			{/* Form to Add New Event */}
			<form
				onSubmit={handleFormSubmit}
				className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 max-w-lg mx-auto grid gap-3"
			>
				<div className="grid gap-2">
					<input
						type="text"
						placeholder="Event Name"
						className="w-full p-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
						value={formData.eventName}
						onChange={(e) =>
							setFormData({
								...formData,
								eventName: e.target.value,
							})
						}
						required
					/>
					<input
						title="Event Date"
						type="datetime-local"
						className="w-full p-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
						value={formData.eventDate}
						onChange={(e) =>
							setFormData({
								...formData,
								eventDate: e.target.value,
							})
						}
						required
					/>
					<textarea
						placeholder="Event Description"
						className="w-full p-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
						value={formData.eventDescription}
						onChange={(e) =>
							setFormData({
								...formData,
								eventDescription: e.target.value,
							})
						}
						required
					/>
					<input
						type="text"
						placeholder="Event Location"
						className="w-full p-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
						value={formData.eventLocation}
						onChange={(e) =>
							setFormData({
								...formData,
								eventLocation: e.target.value,
							})
						}
						required
					/>
				</div>
				<button
					type="submit"
					className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
					disabled={formLoading}
				>
					{formLoading ? (
						<Loader2 className="animate-spin" />
					) : (
						<PlusCircle />
					)}
					Add Event
				</button>
			</form>

			{/* Loading Spinner */}
			{loading && (
				<div className="flex justify-center items-center py-4">
					<Loader2
						className="animate-spin text-gray-500 dark:text-gray-400"
						size={32}
					/>
				</div>
			)}

			{/* Events List */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{events.map((event) => (
					<div
						key={event._id}
						className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between relative"
					>
						<button
							title="Delete Event"
							onClick={() => handleDelete(event._id)}
							className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition"
						>
							<Trash2 size={20} />
						</button>
						<div>
							<h3 className="text-lg font-semibold">
								{event.eventName}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								{new Date(event.eventDate).toLocaleString()}
							</p>
							<p className="mt-2 text-gray-700 dark:text-gray-300">
								{event.eventDescription}
							</p>
							<p className="mt-2 text-gray-700 dark:text-gray-300 font-semibold">
								Location: {event.eventLocation}
							</p>
						</div>
						<div className="flex items-center mt-4 text-gray-600 dark:text-gray-400">
							<Users className="mr-2" size={16} />
							<p>{event.attendees.length} Attendee(s)</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
