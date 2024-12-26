import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar/Navbar";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { ToasterProvider } from "@/components/Notification/ToasterProvider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Local font imports
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for the page
export const metadata: Metadata = {
  title: "OCAplus_IntraHacktive_T7",
  description: "OCAplus_IntraHacktive_T7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <head>
          {/* You can add custom fonts in the head here */}
          <style>
            {`
              body {
                font-family: var(--font-geist-sans), sans-serif;
              }
            `}
          </style>
        </head>
        <body className="font-rogan antialiased">
          {/* Navbar Component */}
          <Navbar />
          
          {/* HeroHighlight section */}
          <HeroHighlight className="h-screen-no-nav w-full">
            <ToasterProvider />
            {children}
          </HeroHighlight>
        </body>
      </html>
    </ClerkProvider>
  );
}
