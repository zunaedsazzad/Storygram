"use client";
import { CardEffect } from "@/components/CardEffect/CardEffect";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { Spin } from "antd";
import { set } from "mongoose";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Room {
	_id: string;
	roomNumber: string;
}

export default function Rooms() {
	const [addNewClicked, setAddNewClicked] = useState(false);
	const [roomNumber, setRoomNumber] = useState<string>("");
	const [rooms, setRooms] = useState<Room[]>([]);
	const [loading, setLoading] = useState(false);
	const [saveLoading, setSaveLoading] = useState(false);

	useEffect(() => {
		async function fetchRooms() {
			setLoading(true);
			const res = await fetch("/api/dashboard/oca/rooms");
			const data = await res.json();
			setRooms(data.rooms);
			setLoading(false);
		}
		fetchRooms();
	}, []);

	async function addRoom() {
		setSaveLoading(true);
		const res = await fetch("/api/dashboard/oca/rooms", {
			method: "POST",
			body: JSON.stringify({ roomNumber }),
		});
		const data = await res.json();
		if (res.status === 200) {
			setSaveLoading(false);
			toast.success(data.message);
			setAddNewClicked(false);
			setRoomNumber("");
			setRooms([...rooms, data.room]);
		} else {
			setSaveLoading(false);
			toast.error(data.message);
		}
	}

	return (
		<main className="flex-1 p-6 h-screen-no-nav overflow-hidden">
			{loading && <Spin fullscreen size="large" />}
			<header className="rounded-lg p-4 flex justify-between items-center mb-6">
				<h2 className="font-semibold sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
					Rooms
				</h2>
				{!addNewClicked && (
					<button
						onClick={() => setAddNewClicked(true)}
						className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
					>
						Add New
					</button>
				)}
				{addNewClicked && (
					<div className="flex gap-2 font-semibold">
						<input
							type="text"
							placeholder="Room Number"
							value={roomNumber}
							onChange={(e) => setRoomNumber(e.target.value)}
							className="p-2 rounded-lg text-black"
							autoFocus={true}
						/>
						{saveLoading && (
							<div className="flex px-8 items-center gap-2">
								<Spin />
							</div>
						)}
						{!saveLoading && (
							<>
								<button
									onClick={() => addRoom()}
									className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg"
								>
									Save
								</button>
								<button
									onClick={() => setAddNewClicked(false)}
									className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
								>
									Cancel
								</button>
							</>
						)}
					</div>
				)}
			</header>
			<div className="w-full h-full pb-16">
				<div className="w-full h-full mx-auto px-2 md:px-8">
					<CardEffect setRooms={setRooms} rooms={rooms} />
				</div>
			</div>
		</main>
	);
}
