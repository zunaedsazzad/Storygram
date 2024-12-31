"use client";

import Link from "next/link";
import { useAuth, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { User, Menu, X, Handshake, SunMoon } from "lucide-react";
import { useState } from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { useTheme } from "next-themes";
import { Drawer } from 'antd';

function SparklesPreview() {
	return (
	  <div className="h-[40px] w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
		<h1 className="md:text-xl text-md lg:text-2xl font-bold text-center text-white relative z-20">
		Storygram
		</h1>
		<div className="w-[10rem] h-[20px] relative">
		  {/* Gradients */}
		  <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
		  <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
		  <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
		  <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
   
		  {/* Core component */}
		  <SparklesCore
			background="transparent"
			minSize={0.4}
			maxSize={1}
			particleDensity={1200}
			className="w-full h-full"
			particleColor="#FFFFFF"
		  />
   
		  {/* Radial Gradient to prevent sharp edges */}
		  <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
		</div>
	  </div>
	);
}

export default function Nav() {
	const { isSignedIn, signOut } = useAuth();
	useUser();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { theme, setTheme } = useTheme();
	const [drawerOpen, setDrawerOpen] = useState(false);

	const showDrawer = () => {
		setDrawerOpen(true);
	};

	const onClose = () => {
		setDrawerOpen(false);
	};

	return (
		<nav className="bg-gray-800 text-white shadow-lg">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<Link
						href="/"
						className="text-2xl font-bold hover:text-gray-400"
					>
						<SparklesPreview />
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
							Library
						</Link>
						<Link
							href="/pricing"
							className="hover:text-gray-400 flex items-center"
						>
							Review
						</Link>
						<Link
							href="/about"
							className="hover:text-gray-400 flex items-center"
						>
							Store
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
						<button
							onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							className="px-4 py-2 text-sm bg-gray-700 rounded hover:bg-gray-600"
						>
							<SunMoon className="w-6 h-6" />
						</button>
						<button onClick={showDrawer} className="px-4 py-2 text-sm bg-gray-700 rounded hover:bg-gray-600">
							<Handshake className="w-6 h-6" />
						</button>
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
			<Drawer title="Basic Drawer" onClose={onClose} open={drawerOpen}>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
			</Drawer>
		</nav>
	);
}
