"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Twitter, Facebook, Instagram, Mail } from "lucide-react";

const Footer = () => {
	return (
		<footer className="text-gray-300 py-10">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* About Section */}
					<div className="space-y-4">
						<h2 className="text-xl font-semibold text-white">
							About Us
						</h2>
						<p className="text-sm text-gray-400">
							We are a vibrant community dedicated to organizing
							exciting events, fostering club connections, and
							showcasing engaging galleries. Join us and be a part
							of our journey.
						</p>
					</div>

					{/* Quick Links */}
					<div className="space-y-4">
						<h2 className="text-xl font-semibold text-white">
							Quick Links
						</h2>
						<div className="flex flex-col space-y-2">
							{[
								"Home",
								"Events",
								"Clubs",
								"Gallery",
								"Contact",
							].map((link) => (
								<motion.div
									key={link}
									whileHover={{ x: 4, color: "#fff" }}
									className="text-gray-400 hover:text-gray-100 transition-colors"
								>
									<Link href={`/${link.toLowerCase()}`}>
										{link}
									</Link>
								</motion.div>
							))}
						</div>
					</div>

					{/* Contact & Social Media */}
					<div className="space-y-4">
						<h2 className="text-xl font-semibold text-white">
							Contact Us
						</h2>
						<p className="text-sm text-gray-400">
							Feel free to reach out via email or follow us on
							social media.
						</p>
						<div className="flex space-x-4 text-gray-400">
							<motion.a
								href="mailto:contact@community.com"
								whileHover={{ scale: 1.1, color: "#fff" }}
								className="hover:text-gray-100 transition-colors"
								aria-label="Email"
							>
								<Mail size={24} />
							</motion.a>
							<motion.a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								whileHover={{ scale: 1.1, color: "#fff" }}
								className="hover:text-gray-100 transition-colors"
								aria-label="Twitter"
							>
								<Twitter size={24} />
							</motion.a>
							<motion.a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								whileHover={{ scale: 1.1, color: "#fff" }}
								className="hover:text-gray-100 transition-colors"
								aria-label="Facebook"
							>
								<Facebook size={24} />
							</motion.a>
							<motion.a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								whileHover={{ scale: 1.1, color: "#fff" }}
								className="hover:text-gray-100 transition-colors"
								aria-label="Instagram"
							>
								<Instagram size={24} />
							</motion.a>
						</div>
					</div>
				</div>
				<hr className="my-8 border-gray-700" />
				<div className="text-center text-gray-500 text-sm">
					&copy; {new Date().getFullYear()} Community. All rights
					reserved.
				</div>
			</div>
		</footer>
	);
};

export default Footer;
