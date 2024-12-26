"use client"; // Ensures the file is treated as a client component

import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, User } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import Footer from "@/components/Footer/Footer";
import Nav from "@/components/Navbar/Navbar";
import EventScrollBar from "../components/EventScrollBar";
import EventCarousel from "../components/EventCarousel/EventCarousel";

// Define Event and Club interfaces
interface Event {
  _id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  cover: string;
}

interface Club {
  _id: string;
  clubName: string;
  description?: string;
  logo?: string;
}

const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [gallery, setGallery] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch events, clubs, and gallery data
        const [eventsRes, clubsRes, galleryRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/clubs"),
          fetch("/api/gallery"),
        ]);

        const eventsData = await eventsRes.json();
        const clubsData = await clubsRes.json();
        const galleryData = await galleryRes.json();

        console.log("Fetched Events:", eventsData);
        console.log("Fetched Clubs:", clubsData);
        console.log("Fetched Gallery:", galleryData);

        // Safely set state with fallback to empty arrays
        setEvents(Array.isArray(eventsData) ? eventsData : []);
        setClubs(Array.isArray(clubsData) ? clubsData : []);
        setGallery(Array.isArray(galleryData) ? galleryData : []);
      } catch (error) {
        toast.error("Failed to load data. Check console for details.");
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handlePrevImage = () =>
    setCurrentImage((prev) => (prev - 1 + gallery.length) % gallery.length);
  const handleNextImage = () =>
    setCurrentImage((prev) => (prev + 1) % gallery.length);

  if (loading) return <Spin size="large" fullscreen />;

  // Custom styles
  const welcomeContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "180px",
    backgroundColor: "#1e272e",
    borderRadius: "12px",
    margin: "20px 10px",
    padding: "20px 30px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
    position: "relative",
    overflow: "hidden",
  };

  const welcomeTextStyle: React.CSSProperties = {
    fontSize: "2.5rem",
    fontWeight: "600",
    color: "#ecf0f1",
    textAlign: "center",
    margin: "0",
  };

  const highlightStyle: React.CSSProperties = {
    color: "#f39c12",
  };

  const subTextStyle: React.CSSProperties = {
    fontSize: "1rem",
    fontWeight: "400",
    color: "#bdc3c7",
    textAlign: "center",
    marginTop: "10px",
    maxWidth: "700px",
  };

  // CSS animations
  const styles = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes subtleGlow {
      0% { text-shadow: 0 0 10px #f39c12, 0 0 20px #f39c12; }
      50% { text-shadow: 0 0 15px #f39c12, 0 0 30px #f39c12; }
      100% { text-shadow: 0 0 10px #f39c12, 0 0 20px #f39c12; }
    }

    .welcome-container {
      animation: gradientShift 8s ease-in-out infinite;
      background: linear-gradient(90deg, #34495e, #2c3e50, #1e272e);
      background-size: 200% 200%;
    }

    .welcome-title {
      animation: fadeIn 1s ease-out;
    }

    .welcome-title span {
      animation: subtleGlow 2s infinite;
    }

    .welcome-subtitle {
      animation: fadeIn 1.5s ease-out;
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 30px;
      background-color: #2c3e50;
      color: #ecf0f1;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .navbar .left {
      font-size: 1.5rem;
      font-weight: 700;
    }

    .navbar .right {
      display: flex;
      gap: 20px;
    }

    .navbar .right a {
      color: #ecf0f1;
      text-decoration: none;
      font-weight: 500;
    }
  `;

  // Inject animation styles
  if (typeof document !== "undefined") {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }

  return (
    <div className="text-gray-100 container-class p-8 h-full space-y-20 overflow-y-auto">
      {/* Navigation and welcome section */}
      <Nav />
      <EventScrollBar />
      
      <div style={welcomeContainerStyle} className="welcome-container">
        <h1 style={welcomeTextStyle} className="welcome-title">
          Welcome to <span style={highlightStyle}>Storygram</span>
        </h1>
        <p style={subTextStyle} className="welcome-subtitle">
          A vibrant, interactive platform where readers connect, lend and borrow books, attend events, and engage in meaningful conversations.
        </p>
      </div>

      {/* Event Carousel */}
      <EventCarousel />

      {/* Upcoming Events Section */}
      <motion.section
        className="space-y-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-semibold text-center">Upcoming Events</h2>
        {events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {events.map((event) => (
              <motion.div
                key={event._id}
                className="bg-gray-800 rounded-lg shadow-md overflow-hidden"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={event.cover}
                  alt={event.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2">
                  <Link href={`/events/${event._id}`}>
                    <h3 className="text-2xl font-semibold text-white cursor-pointer hover:text-gray-300">
                      {event.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-300 line-clamp-3">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No events available at the moment.</p>
        )}
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
