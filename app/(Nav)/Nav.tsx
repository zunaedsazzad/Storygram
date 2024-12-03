"use client";

import Link from "next/link";
import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
import { User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Nav() {
	const { isSignedIn, signOut } = useAuth();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<nav className="bg-gray-800 text-white shadow-lg">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<Link
						href="/"
						className="text-2xl font-bold hover:text-gray-400"
					>
						MySite
					</Link>
					<div className="flex items-center space-x-4 md:hidden">
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="text-white focus:outline-none"
						>
							{mobileMenuOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</button>
					</div>
					<div className="hidden md:flex space-x-6">
						<Link
							href="/features"
							className="hover:text-gray-400 flex items-center"
						>
							Features
						</Link>
						<Link
							href="/pricing"
							className="hover:text-gray-400 flex items-center"
						>
							Pricing
						</Link>
						<Link
							href="/about"
							className="hover:text-gray-400 flex items-center"
						>
							About
						</Link>
					</div>
					<div className="hidden md:flex items-center space-x-4">
						{isSignedIn ? (
							<div className="flex items-center space-x-2">
								<Link
									href="/profile"
									className="flex items-center space-x-2 hover:text-gray-400"
								>
									<User className="w-5 h-5" />
									<span>Profile</span>
								</Link>
								<button
									onClick={() => signOut()}
									className="text-gray-400 hover:text-gray-200"
								>
									Sign Out
								</button>
							</div>
						) : (
							<>
								<SignInButton>
									<button className="px-4 py-2 text-sm bg-gray-700 rounded hover:bg-gray-600">
										Sign In
									</button>
								</SignInButton>
								<SignUpButton>
									<button className="px-4 py-2 text-sm bg-blue-600 rounded hover:bg-blue-500">
										Sign Up
									</button>
								</SignUpButton>
							</>
						)}
					</div>
				</div>
			</div>
			{mobileMenuOpen && (
				<div className="md:hidden bg-gray-700 text-white space-y-2 py-4 px-6">
					<Link
						href="/features"
						className="block hover:text-gray-400"
						onClick={() => setMobileMenuOpen(false)}
					>
						Features
					</Link>
					<Link
						href="/pricing"
						className="block hover:text-gray-400"
						onClick={() => setMobileMenuOpen(false)}
					>
						Pricing
					</Link>
					<Link
						href="/about"
						className="block hover:text-gray-400"
						onClick={() => setMobileMenuOpen(false)}
					>
						About
					</Link>
					{isSignedIn ? (
						<Link
							href="/profile"
							className="flex items-center space-x-2 hover:text-gray-400"
							onClick={() => setMobileMenuOpen(false)}
						>
							<User className="w-5 h-5" />
							<span>Profile</span>
						</Link>
					) : (
						<div className="space-y-2">
							<SignInButton>
								<button className="w-full px-4 py-2 text-sm bg-gray-700 rounded hover:bg-gray-600">
									Sign In
								</button>
							</SignInButton>
							<SignUpButton>
								<button className="w-full px-4 py-2 text-sm bg-blue-600 rounded hover:bg-blue-500">
									Sign Up
								</button>
							</SignUpButton>
						</div>
					)}
				</div>
			)}
		</nav>
	);
}
