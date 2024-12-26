import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToasterProvider } from "@/components/Notification/ToasterProvider";
import Nav from "@/app/(Nav)/Nav";

export const metadata: Metadata = {
	title: "Storygram",
	description: "A social media platform for sharing books.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider dynamic>
			<html lang="en">
				<body className={`antialiased`}>
					<ToasterProvider />
					<Nav />
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
