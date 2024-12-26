"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import moment from "moment";
import { TextArea } from "@/components/ui/textarea";
import "./style.css";

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

export default function EventForm({
	setEvent,
	setCurrentPage,
}: {
	setEvent: (event: Event) => void;
	setCurrentPage: (page: number) => void;
}) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [objective, setObjective] = useState("");
	const [impact, setImpact] = useState("");
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [numberOfAttendees, setNumberOfAttendees] = useState<number>(0);

	const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newEndDate = e.target.value ? new Date(e.target.value) : null;
		if (startDate && newEndDate && newEndDate <= startDate) {
			toast.error("End date must be after start date");
		} else {
			setEndDate(newEndDate);
		}
	};

	const handleSubmit = () => {
		if (
			!name ||
			!description ||
			!objective ||
			!impact ||
			!numberOfAttendees
		) {
			toast.error("Please fill all fields");
			return;
		}
		if (!startDate || !endDate) {
			toast.error("Please enter start and end date");
			return;
		}
		if (startDate >= endDate) {
			toast.error("End date must be after start date");
			return;
		}
		if (numberOfAttendees <= 0) {
			toast.error("Number of attendees must be greater than 0");
			return;
		}

		setEvent({
			name,
			description,
			objective,
			impact,
			startDate,
			endDate,
			numberOfAttendees,
			budget: [],
			cover: "",
			rooms: [],
		});
		setCurrentPage(2);
	};

	return (
		<div className="h-full py-16">
			<div className="w-full h-full px-4 flex items-center justify-center text-white">
				<div className="bg-black p-8 rounded-lg h-full shadow-lg w-full max-w-4xl overflow-y-auto container-class">
					<h2 className="text-2xl font-bold mb-6 text-center">
						Add Event Details
					</h2>
					<div className="flex flex-col gap-4 ">
						<LabelInputContainer>
							<Label htmlFor="event-name">Event Name</Label>
							<Input
								id="event-name"
								placeholder="Enter Event Name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</LabelInputContainer>
						<LabelInputContainer>
							<Label htmlFor="event-description">
								Description
							</Label>
							<TextArea
								rows={5}
								id="event-description"
								placeholder="Enter Event Description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
							/>
						</LabelInputContainer>
						<LabelInputContainer>
							<Label htmlFor="event-objective">Objective</Label>
							<Input
								id="event-objective"
								placeholder="Enter Objective"
								type="text"
								value={objective}
								onChange={(e) => setObjective(e.target.value)}
								required
							/>
						</LabelInputContainer>
						<LabelInputContainer>
							<Label htmlFor="event-impact">Impact</Label>
							<Input
								id="event-impact"
								placeholder="Describe the Impact"
								type="text"
								value={impact}
								onChange={(e) => setImpact(e.target.value)}
								required
							/>
						</LabelInputContainer>
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
								onChange={(e) =>
									setStartDate(
										e.target.value
											? new Date(e.target.value)
											: null
									)
								}
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
						<LabelInputContainer>
							<Label htmlFor="attendees">
								Number of Attendees
							</Label>
							<Input
								id="attendees"
								type="number"
								placeholder="Enter Number of Attendees"
								value={numberOfAttendees}
								onChange={(e) =>
									setNumberOfAttendees(Number(e.target.value))
								}
								step={1}
								min={0}
								required
							/>
						</LabelInputContainer>
					</div>
					<button
						className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 w-full text-white rounded-md h-10 font-medium mt-6"
						onClick={handleSubmit}
					>
						Continue &rarr;
						<BottomGradient />
					</button>
				</div>
			</div>
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
