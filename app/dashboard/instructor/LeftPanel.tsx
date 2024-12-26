"use client";
import { Settings, Users, User, Edit, Calendar } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function LeftPanel() {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<aside className="bg-slate-900 bg-opacity-60 lg:w-64 p-4 lg:h-full fixed bottom-0 lg:static w-full lg:flex flex-col items-center lg:items-start lg:space-y-6">
			<div className="hidden lg:block text-2xl font-bold text-center mb-6">
				Dashboard
			</div>
			<nav className="flex lg:flex-col font-bold justify-around w-full lg:w-auto">
				<div
					onClick={() =>
						router.push("/dashboard/instructor/edit-club")
					}
					className={`flex cursor-pointer flex-col lg:flex-row items-center gap-2 text-gray-300 p-2 ${
						pathname.startsWith("/dashboard/instructor/edit-club")
							? "text-violet-600"
							: "hover:text-white"
					}`}
				>
					<Edit className="w-6 h-6" />
					<span className="hidden lg:inline">Edit Club</span>
				</div>

				<div
					onClick={() =>
						router.push("/dashboard/instructor/add-member")
					}
					className={`flex cursor-pointer flex-col lg:flex-row items-center gap-2 text-gray-300 p-2 ${
						pathname.startsWith("/dashboard/instructor/add-member")
							? "text-violet-600"
							: "hover:text-white"
					}`}
				>
					<Users className="w-6 h-6" />
					<span className="hidden lg:inline">Add Member</span>
				</div>
				<div
					onClick={() =>
						router.push("/dashboard/instructor/manage-members")
					}
					className={`flex cursor-pointer flex-col lg:flex-row items-center gap-2 text-gray-300 p-2 ${
						pathname.startsWith(
							"/dashboard/instructor/manage-members"
						)
							? "text-violet-600"
							: "hover:text-white"
					}`}
				>
					<Settings className="w-6 h-6" />
					<span className="hidden lg:inline">Manage Members</span>
				</div>
				<div
					onClick={() => router.push("/dashboard/instructor/events")}
					className={`flex cursor-pointer flex-col lg:flex-row items-center gap-2 text-gray-300 p-2 ${
						pathname.startsWith("/dashboard/instructor/events")
							? "text-violet-600"
							: "hover:text-white"
					}`}
				>
					<Calendar className="w-6 h-6" />
					<span className="hidden lg:inline">Events</span>
				</div>
				<div
					onClick={() => router.push("/dashboard/instructor/profile")}
					className={`flex cursor-pointer flex-col lg:flex-row items-center gap-2 text-gray-300 p-2 ${
						pathname.startsWith("/dashboard/instructor/profile")
							? "text-violet-600"
							: "hover:text-white"
					}`}
				>
					<User className="w-6 h-6" />
					<span className="hidden lg:inline">Profile</span>
				</div>
			</nav>
		</aside>
	);
}
