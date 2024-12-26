"use client"; // Ensure this line is the first

import React, { useEffect, useState, useRef } from "react";

const EventScrollBar = () => {
  const [events, setEvents] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null); // Reference to the scrolling text container

  // Fetch events from API and update every minute
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  // Define keyframes for the scrolling effect
  useEffect(() => {
    const keyframes = `
      @keyframes scroll {
        0% {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(-100%);
        }
      }
    `;

    const styleElement = document.createElement("style");
    styleElement.innerHTML = keyframes;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Pause scrolling on hover
  const handleMouseEnter = () => {
    if (scrollRef.current) {
      scrollRef.current.style.animationPlayState = "paused"; // Pause scrolling on hover
    }
  };

  // Resume scrolling when mouse leaves
  const handleMouseLeave = () => {
    if (scrollRef.current) {
      scrollRef.current.style.animationPlayState = "running"; // Resume scrolling when mouse leaves
    }
  };

  return (
    <div style={containerStyle}>
      <div
        ref={scrollRef}
        style={scrollingTextStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {events.length > 0 ? (
          events.map((event, index) => (
            <span key={index} style={eventItemStyle}>
              {event} |&nbsp;
            </span>
          ))
        ) : (
          <span style={eventItemStyle}>Loading events...</span>
        )}
      </div>
    </div>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#2a2a2a", // Classic dark gray
  padding: "8px 0",
  overflow: "hidden",
  position: "relative",
  whiteSpace: "nowrap",
  border: "1px solid #444", // Subtle border
  borderRadius: "8px",
};

const scrollingTextStyle: React.CSSProperties = {
  display: "inline-block",
  animation: "scroll 30s linear infinite",
  animationPlayState: "running", // Ensure animation is running by default
  whiteSpace: "nowrap",
  color: "#e0e0e0", // Soft off-white for text
  fontSize: "16px",
  fontFamily: "'Georgia', serif", // Classic serif font for elegance
  letterSpacing: "0.5px", // Slight letter spacing for readability
};

const eventItemStyle: React.CSSProperties = {
  marginRight: "15px",
  color: "#f1c40f", // Muted gold for emphasis
  fontWeight: "600",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)", // Minimal shadow for depth
};

export default EventScrollBar;
