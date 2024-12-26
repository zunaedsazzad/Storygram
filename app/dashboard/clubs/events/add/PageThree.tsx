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

export default function BudgetForm({
	event,
	setEvent,
	setCurrentPage,
}: {
	event: Event;
	setEvent: (event: Event) => void;
	setCurrentPage: (page: number) => void;
}) {
	const handleSubmit = () => {
		if (budgets.length === 0) {
			toast.error("Please add at least one category");
			return;
		}
		setEvent({ ...event, budget: budgets });
		setCurrentPage(4);
	};
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [name, setName] = useState<string>("");
	const [proposedAmount, setProposedAmount] = useState<number>(0);

	const handleAddBudget = () => {
		if (!name || !proposedAmount) {
			toast.error("Please fill all the fields");
			return;
		}
		setBudgets([...budgets, { name, proposedAmount }]);
		toast.success("Budget added successfully");
		setName("");
		setProposedAmount(0);
	};

	return (
		<div className="h-full flex justify-center pb-16">
			<div className="w-full h-full px-4 flex items-center justify-center text-white">
				<div className="p-8 rounded-lg h-full shadow-lg w-full  overflow-y-auto container-class">
					<h2 className="text-2xl font-bold mb-6 text-center">
						Add Budget Details
					</h2>
					<div className="flex flex-col md:flex-row gap-4 ">
						<LabelInputContainer>
							<Label htmlFor="event-name">Category Name</Label>
							<Input
								placeholder="Enter Category Name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</LabelInputContainer>
						<LabelInputContainer>
							<Label htmlFor="attendees">
								Proposed Amount (in BDT)
							</Label>
							<Input
								type="number"
								placeholder="Enter Proposed Amount"
								value={proposedAmount}
								onChange={(e) =>
									setProposedAmount(Number(e.target.value))
								}
								step={1}
								min={0}
								required
							/>
						</LabelInputContainer>
						<button
							className="bg-gradient-to-br relative group/btn from-violet-900 to-violet-900 w-full md:w-fit text-nowrap px-4 text-white rounded-md h-10 font-medium mt-6"
							onClick={handleAddBudget}
						>
							Add
							<BottomGradient />
						</button>
					</div>
					{budgets.map((budget, index) => (
						<div
							key={index}
							className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded-md mt-4"
						>
							<div className="flex flex-col gap-2">
								<p className="text-2xl font-semibold">
									{budget.name}
								</p>
								<p className="text-sm">
									BDT {budget.proposedAmount}
								</p>
							</div>
							<button
								onClick={() => {
									setBudgets(
										budgets.filter((_, i) => i !== index)
									);
									toast.success(
										"Budget removed successfully"
									);
								}}
								className="bg-gradient-to-br relative group/btn from-red-900 to-red-900 text-white rounded-md  font-medium px-4 py-2"
							>
								Remove
								<BottomGradient />
							</button>
						</div>
					))}
					<div className="flex justify-between items-center bg-violet-800 px-4 py-2 rounded-md mt-4">
						<div className="flex justify-between w-full gap-2">
							<p className="text-3xl font-semibold">Total</p>
							<p className="text-3xl font-semibold">
								BDT{" "}
								{budgets.reduce(
									(acc, cur) => acc + cur.proposedAmount,
									0
								)}
							</p>
						</div>
					</div>
					<div className="flex gap-4">
						<button
							className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 w-full text-white rounded-md h-10 font-medium mt-6"
							onClick={() => setCurrentPage(2)}
						>
							&larr; Back
							<BottomGradient />
						</button>
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
