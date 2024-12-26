"use client";
import { useState, useEffect } from "react";
import BudgetForm from "./PageThree";
import EventForm from "./PageOne";
import ImageForm from "./PageFour";
import RoomForm from "./PageTwo";
import PageFive from "./PageFive";
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

export default function Home() {
	const [currentPage, setCurrentPage] = useState(1);
	const [event, setEvent] = useState<Event>({
		name: "",
		description: "",
		objective: "",
		impact: "",
		startDate: new Date(),
		endDate: new Date(),
		numberOfAttendees: 0,
		budget: [],
		cover: "",
		rooms: [],
	});
	return (
		<div className="h-full w-full">
			{currentPage === 1 && (
				<EventForm
					setCurrentPage={setCurrentPage}
					setEvent={setEvent}
				/>
			)}
			{currentPage === 2 && (
				<RoomForm
					event={event}
					setCurrentPage={setCurrentPage}
					setEvent={setEvent}
				/>
			)}
			{currentPage === 3 && (
				<BudgetForm
					event={event}
					setCurrentPage={setCurrentPage}
					setEvent={setEvent}
				/>
			)}
			{currentPage === 4 && (
				<ImageForm
					event={event}
					setCurrentPage={setCurrentPage}
					setEvent={setEvent}
				/>
			)}
			{currentPage === 5 && <PageFive />}
		</div>
	);
}
