"use client";
import { Pencil, CheckCircle, XCircle, DollarSign, Clock } from "lucide-react";
import { Spin } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../add/style.css";

interface Budget {
	_id: string;
	name: string;
	proposedAmount: number;
	approvedAmount?: number;
	spentAmount?: number;
}

export default function Events() {
	const [budgets, setBudget] = useState<Budget[]>([]);
	const { eventId } = useParams();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchEvents() {
			setLoading(true);
			const response = await fetch(
				`/api/dashboard/clubs/add-event/${eventId}`
			);
			const data = await response.json();

			if (response.status === 200) {
				setBudget(data.event.budget);
			} else {
				toast.error(data.message);
			}
			setLoading(false);
		}
		fetchEvents();
	}, []);
	return (
		<div className="w-full h-full overflow-hidden pb-16">
			{loading ? (
				<Spin fullscreen size="large" />
			) : (
				<ul className="flex flex-col h-full container-class overflow-y-scroll gap-4 p-4 w-full">
					{budgets.map((budget) => (
						<BudgetCard
							key={budget._id}
							budget={budget}
							setBudget={setBudget}
						/>
					))}
				</ul>
			)}
		</div>
	);
}

function BudgetCard({ budget, setBudget }: { budget: Budget; setBudget: any }) {
	const { eventId } = useParams();
	const [editOpen, setEditOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState(budget.name);
	const [proposedAmount, setProposedAmount] = useState<number>(
		budget.proposedAmount
	);
	const [approvedAmount, setApprovedAmount] = useState<number | undefined>(
		budget.approvedAmount
	);
	const [spentAmount, setSpentAmount] = useState<string>(
		budget.spentAmount ? budget.spentAmount.toString() : ""
	);

	async function saveBudget() {
		setLoading(true);
		const tempSpentAmount = spentAmount === "" ? 0 : +spentAmount;
		const response = await fetch(`/api/dashboard/clubs/add-event`, {
			method: "PUT",
			body: JSON.stringify({
				budget: {
					_id: budget._id,
					name,
					proposedAmount,
					approvedAmount,
					spentAmount: tempSpentAmount,
				},
				eventId: eventId,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		if (response.status === 200) {
			toast.success(data.message);
			setEditOpen(false);
			setBudget(data.event.budget);
		} else {
			toast.error(data.message);
		}
		setLoading(false);
	}

	return (
		<li className="bg-gray-800 bg-opacity-50 h-fit rounded-lg p-6 w-full">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-xl font-semibold text-gray-100">{name}</h3>
				<div className="flex gap-2">
					<button
						title="Edit"
						onClick={() => setEditOpen(!editOpen)}
						className="text-indigo-500 hover:text-indigo-400 p-2"
					>
						<Pencil className="h-5 w-5" />
					</button>
				</div>
			</div>
			<div className="flex flex-col gap-4 lg:flex-row lg:gap-6 text-gray-100">
				<div className="flex items-center justify-between lg:justify-start lg:gap-4 p-2 bg-gray-900 rounded-lg shadow-md">
					<div className="flex items-center gap-2">
						<DollarSign className="text-green-500 w-5 h-5" />
						<p className="text-gray-400">Proposed Amount</p>
					</div>
					<p className="font-semibold text-gray-100">
						BDT {proposedAmount.toLocaleString()}
					</p>
				</div>

				<div className="flex items-center justify-between lg:justify-start lg:gap-4 p-2 bg-gray-900 rounded-lg shadow-md">
					<div className="flex items-center gap-2">
						{approvedAmount ? (
							<CheckCircle className="text-blue-500 w-5 h-5" />
						) : (
							<Clock className="text-yellow-500 w-5 h-5" />
						)}
						<p className="text-gray-400">Approved Amount</p>
					</div>
					{approvedAmount ? (
						<p className="font-semibold text-gray-100">
							BDT {approvedAmount.toLocaleString()}
						</p>
					) : (
						<p className="font-semibold text-gray-100">Pending</p>
					)}
				</div>

				<div className="flex items-center justify-between lg:justify-start lg:gap-4 p-2 bg-gray-900 rounded-lg shadow-md">
					<div className="flex items-center gap-2">
						<DollarSign className="text-red-500 w-5 h-5" />
						<p className="text-gray-400">Spent Amount</p>
					</div>
					{spentAmount ? (
						<p className="font-semibold text-gray-100">
							BDT {spentAmount.toLocaleString()}
						</p>
					) : (
						<p className="font-semibold text-gray-100">
							Not Reported
						</p>
					)}
				</div>
			</div>

			{editOpen && (
				<div className="mt-4 bg-gray-950 p-4 rounded-lg transition-all duration-300">
					{editOpen && (
						<div className="flex flex-col lg:flex-row gap-4 lg:items-center">
							<div className="gap-2 flex flex-col w-full">
								<label className="text-nowrap" htmlFor="name">
									Proposed Amount
								</label>
								<input
									name="name"
									placeholder="Proposed Amount"
									type="number"
									className="w-full p-2 rounded-lg bg-gray-600 text-gray-200"
									value={proposedAmount}
									onChange={(e) =>
										setProposedAmount(+e.target.value)
									}
									disabled
								/>
							</div>
							<div className="gap-2 flex flex-col w-full">
								<label
									className="text-nowrap"
									htmlFor="Approved Amount"
								>
									Approved Amount
								</label>
								<input
									name="Approved Amount"
									placeholder={`${
										approvedAmount
											? approvedAmount
											: "Pending"
									}`}
									type="number"
									className="w-full p-2 rounded-lg bg-gray-600 text-gray-200"
									value={approvedAmount}
									onChange={(e) =>
										setApprovedAmount(+e.target.value)
									}
									disabled
								/>
							</div>
							<div className="gap-2 flex flex-col w-full">
								<label
									className="text-nowrap"
									htmlFor="Spent Amount"
								>
									Spent Amount
								</label>
								<input
									placeholder={`${
										spentAmount
											? spentAmount
											: "Not Reported"
									}`}
									type="number"
									className={`w-full p-2 rounded-lg  text-gray-200
                                    ${
										approvedAmount
											? "bg-gray-900"
											: "bg-gray-600"
									}
                                    `}
									value={spentAmount}
									onChange={(e) =>
										setSpentAmount(e.target.value)
									}
									autoFocus={true}
									disabled={approvedAmount ? false : true}
								/>
							</div>
						</div>
					)}

					<div className="flex justify-end gap-2 mt-4">
						<button
							title="Close"
							onClick={() => {
								setEditOpen(false);
							}}
							className="bg-gray-700 hover:bg-gray-600 rounded-lg p-2"
						>
							Cancel
						</button>
						<button
							onClick={saveBudget}
							className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg"
							disabled={loading}
						>
							{loading ? <Spin /> : "Save"}
						</button>
					</div>
				</div>
			)}
		</li>
	);
}
