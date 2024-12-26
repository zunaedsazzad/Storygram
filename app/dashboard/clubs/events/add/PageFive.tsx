import { User, CircleCheckBig } from "lucide-react";
import Link from "next/link";

export default function PageFive() {
	return (
		<div className="flex flex-col text-green-500 items-center justify-center h-full w-full">
			<CircleCheckBig size={64} />
			<h1 className="text-2xl font-semibold mt-4">
				Event created successfully
			</h1>
			<p className="text-gray-500 mt-2">
				Your event has been created successfully
			</p>
			<Link
				className="mt-8 bg-primary text-white px-4 py-2 rounded-lg"
				href="/dashboard/clubs/events"
			>
				Return to dashboard
			</Link>
		</div>
	);
}
