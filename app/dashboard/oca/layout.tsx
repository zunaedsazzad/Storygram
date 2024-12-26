"use client";
import { User, Users, House, Calendar } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const router = useRouter();
	return (
		<div className="h-full text-white flex flex-col lg:flex-row">
			<aside className="bg-slate-900 bg-opacity-60 lg:w-64 p-4 lg:h-full fixed bottom-0 lg:static w-full lg:flex flex-col items-center lg:items-start lg:space-y-6">
				<div className="hidden lg:block text-2xl font-bold text-center mb-6">
					Dashboard
				</div>
				<nav className="flex lg:flex-col font-bold justify-around w-full lg:w-auto">
					<div
						onClick={() => router.push("/dashboard/oca/add-club")}
						className={`flex cursor-pointer flex-col lg:flex-row items-center gap-2 text-gray-300 p-2 ${
							pathname.startsWith("/dashboard/oca/add-club")
								? "text-violet-600"
								: "hover:text-white"
						}`}
					>
						<Users className="w-6 h-6" />
						<span className="hidden lg:inline">Add Club</span>
					</div>
					<div
						onClick={() => router.push("/dashboard/oca/profile")}
						className={`flex cursor-pointer flex-col lg:flex-row items-center gap-2 text-gray-300 p-2 ${
							pathname.startsWith("/dashboard/oca/profile")
								? "text-violet-600"
								: "hover:text-white"
						}`}
					>
						<User className="w-6 h-6" />
						<span className="hidden lg:inline">Profile</span>
					</div>
					<div
						onClick={() => router.push("/dashboard/oca/events")}
						className={`flex cursor-pointer flex-col lg:flex-row items-center gap-2 text-gray-300 p-2 ${
							pathname.startsWith("/dashboard/oca/events")
								? "text-violet-600"
								: "hover:text-white"
						}`}
					>
						<Calendar className="w-6 h-6" />
						<span className="hidden lg:inline">Events</span>
					</div>
					<div
						onClick={() => router.push("/dashboard/oca/rooms")}
						className={`flex cursor-pointer flex-col lg:flex-row items-center gap-2 text-gray-300 p-2 ${
							pathname.startsWith("/dashboard/oca/rooms")
								? "text-violet-600"
								: "hover:text-white"
						}`}
					>
						<House className="w-6 h-6" />
						<span className="hidden lg:inline">Rooms</span>
					</div>
				</nav>
			</aside>
			{children}
		</div>
	);
}
