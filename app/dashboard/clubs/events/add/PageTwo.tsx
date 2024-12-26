"use client";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import "./style.css";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import moment from "moment";
import "./style.css";
import { Spin } from "antd";

interface Budget {
	name: string;
	proposedAmount: number;
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
interface Room {
	roomNumber: string;
}

export default function RoomForm({
	event,
	setEvent,
	setCurrentPage,
}: {
	event: Event;
	setEvent: (event: Event) => void;
	setCurrentPage: (page: number) => void;
}) {
	const [startDate, setStartDate] = useState<Date>(event.startDate);
	const [endDate, setEndDate] = useState<Date | null>(event.endDate);
	const [rooms, setRooms] = useState<Room[]>([]);
	const [selectedRooms, setSelectedRooms] = useState<Room[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchRooms = async () => {
			setLoading(true);
			const res = await fetch("/api/free-rooms", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					startDate,
					endDate,
				}),
			});
			const data = await res.json();
			setRooms(data);
			setLoading(false);
			setSelectedRooms([]);
		};
		fetchRooms();
	}, [startDate, endDate]);

	const handleSubmit = () => {
		if (!startDate || !endDate) {
			toast.error("Please select start and end date");
			return;
		}
		if (selectedRooms.length === 0) {
			toast.error("Please select at least one room");
			return;
		}

		const newEvent = { ...event, startDate, endDate, rooms: selectedRooms };

		setEvent(newEvent);
		setCurrentPage(3);
	};

	const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newEndDate = e.target.value ? new Date(e.target.value) : null;
		if (startDate && newEndDate && newEndDate <= startDate) {
			toast.error("End date must be after start date");
		} else {
			setEndDate(newEndDate);
		}
	};

	return (
		<div className="h-full flex justify-center pb-16">
			<div className="w-full h-full px-4 flex items-center justify-center text-white">
				<div className="p-8 rounded-lg h-full shadow-lg w-full  overflow-y-auto container-class">
					<h2 className="text-2xl font-bold mb-6 text-center">
						Select Rooms
					</h2>
					<div className="flex flex-col md:flex-row gap-4">
						<LabelInputContainer>
							<Label htmlFor="start-date">
								Start Date & Time
							</Label>
							<Input
								className="w-full"
								id="start-date"
								type="datetime-local"
								value={
									startDate
										? moment(startDate).format(
												"YYYY-MM-DDTHH:mm"
										  )
										: ""
								}
								onChange={(e) => {
									if (e.target.value) {
										setStartDate(new Date(e.target.value));
									}
								}}
								required
							/>
						</LabelInputContainer>
						<LabelInputContainer>
							<Label htmlFor="end-date">End Date & Time</Label>
							<Input
								className="w-full"
								id="end-date"
								type="datetime-local"
								value={
									endDate
										? moment(endDate).format(
												"YYYY-MM-DDTHH:mm"
										  )
										: ""
								}
								onChange={handleEndDateChange}
								required
							/>
						</LabelInputContainer>
					</div>
					{loading && (
						<div className="w-full h-full flex justify-center items-center">
							<Spin size="large" fullscreen />
						</div>
					)}
					{!loading && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4">
							{rooms.map((room) => (
								<RoomBox
									key={room.roomNumber}
									room={room}
									selectedRooms={selectedRooms}
									setSelectedRooms={setSelectedRooms}
								/>
							))}
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
							Continue &rarr;
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

function RoomBox({
	room,
	selectedRooms,
	setSelectedRooms,
}: {
	room: Room;
	selectedRooms: Room[];
	setSelectedRooms: (rooms: Room[]) => void;
}) {
	const [selected, setSelected] = useState(false);

	function toggleSelected() {
		setSelected(!selected);
		if (selected) {
			setSelectedRooms(selectedRooms.filter((r) => r !== room));
		} else {
			setSelectedRooms([...selectedRooms, room]);
		}
	}

	return (
		<div
			className={cn(
				"flex flex-col bg-black relative border-2 border-black group/btn hover:bg-gray-950 cursor-pointer select-none items-center justify-center p-4 rounded-lg ",
				selected ? "border-teal-500 " : ""
			)}
			onClick={toggleSelected}
		>
			<h3 className="text-lg font-bold">{room.roomNumber}</h3>
			<BottomGradient />
		</div>
	);
}
