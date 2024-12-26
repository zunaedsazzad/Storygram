"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Book, Users, Calendar, LogIn, LogOut, User, Library } from "lucide-react"; // Import relevant icons
import { useAuth, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, signOut } = useAuth(); // Authentication state
  const { user } = useUser(); // User details

  return (
    <nav className="bg-gray-900 text-gray-100 shadow-lg">
      <div className="mx-auto px-6">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 text-2xl font-extrabold tracking-wide text-blue-400 animate-bounce hover:scale-110 hover:text-blue-300 transition-all duration-300"
            >
              <Book size={32} className="text-blue-400 hover:rotate-12 transition-transform duration-300" />
              <span>Storygram</span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/clubs" className="hover:text-gray-400 flex items-center space-x-2 transition-transform hover:scale-105 duration-300">
              <Users size={20} />
              <span>Clubs</span>
            </Link>

            <Link href="/events" className="hover:text-gray-400 flex items-center space-x-2 transition-transform hover:scale-105 duration-300">
              <Calendar size={20} />
              <span>Events</span>
            </Link>

            <Link href="/library" className="hover:text-gray-400 flex items-center space-x-2 transition-transform hover:scale-105 duration-300">
              <Library size={20} />
              <span>Library</span>
            </Link>

            {isSignedIn && user && (
              <Link
                href="/dashboard"
                className="hover:text-gray-400 flex items-center space-x-2 transition-transform hover:scale-105 duration-300"
              >
                <User size={20} />
                <span>{user.firstName || "Profile"}</span>
              </Link>
            )}
            {isSignedIn && (
              <button
                onClick={() => signOut()}
                className="bg-blue-600 flex items-center space-x-2 text-white px-4 py-2 rounded hover:bg-blue-700 hover:scale-105 transition-transform duration-300"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            )}
            {!isSignedIn && (
              <Link
                href="/sign-in"
                className="bg-blue-600 flex items-center space-x-2 text-white px-4 py-2 rounded hover:bg-blue-700 hover:scale-105 transition-transform duration-300"
              >
                <LogIn size={20} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          <Link href="/clubs" className="block px-4 py-2 hover:bg-gray-700 flex items-center space-x-2 transition-transform hover:scale-105 duration-300">
            <Users size={20} />
            <span>Clubs</span>
          </Link>
          <Link href="/events" className="block px-4 py-2 hover:bg-gray-700 flex items-center space-x-2 transition-transform hover:scale-105 duration-300">
            <Calendar size={20} />
            <span>Events</span>
          </Link>
          <Link href="/library" className="block px-4 py-2 hover:bg-gray-700 flex items-center space-x-2 transition-transform hover:scale-105 duration-300">
            <Library size={20} />
            <span>Library</span>
          </Link>
          {isSignedIn && user && (
            <Link
              href="/dashboard"
              className="block px-4 py-2 hover:bg-gray-700 flex items-center space-x-2 transition-transform hover:scale-105 duration-300"
            >
              <User size={20} />
              <span>{user.firstName || "Profile"}</span>
            </Link>
          )}
          {isSignedIn && (
            <button
              onClick={() => signOut()}
              className="w-full bg-blue-600 flex items-center space-x-2 text-white px-4 py-2 mt-2 hover:bg-blue-700 hover:scale-105 transition-transform duration-300"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          )}
          {!isSignedIn && (
            <Link
              href="/sign-in"
              className="w-full bg-blue-600 flex items-center space-x-2 text-white px-4 py-2 mt-2 hover:bg-blue-700 hover:scale-105 transition-transform duration-300"
            >
              <LogIn size={20} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

