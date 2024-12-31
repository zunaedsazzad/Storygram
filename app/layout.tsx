import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToasterProvider } from "@/components/Notification/ToasterProvider";
import Nav from "@/app/(Nav)/Nav";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme/theme-provider";

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
			<html lang="en" suppressHydrationWarning>
				<Suspense fallback={<div>Loading...</div>} >
					<body className={`antialiased`}>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							<ToasterProvider />
							<Nav />
							{children}
						</ThemeProvider>
					</body>
				</Suspense>
			</html>
		</ClerkProvider>
	);
}
