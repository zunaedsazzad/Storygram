"use client"; // Ensure this is a client component

import React from "react";
import Slider from "react-slick";
import styles from "./EventCarousel.module.css"; // Import the CSS module

const EventCarousel = () => {
  const slides = [
    { 
      title: "Storytelling Night", 
      date: "Dec 25", 
      image: "/Images/events/AdobeStock_212015328.jpeg" 
    },
    { 
      title: "Book Swap", 
      date: "Jan 5", 
      image: "/Images/events/images.jpeg" 
    },
    { 
      title: "Poetry Reading", 
      date: "Jan 15", 
      image: "/Images/events/events_pic.jpg" 
    },
    // Add more events as needed
  ];

  // Slick settings
  const settings = {
    dots: true,            // Enables dots for navigation
    infinite: true,        // Infinite loop
    speed: 500,            // Transition speed (ms)
    slidesToShow: 1,       // Number of slides to show at a time
    slidesToScroll: 1,     // Number of slides to scroll per click
    autoplay: true,        // Auto-slide
    autoplaySpeed: 3000,   // Speed of auto-slide (ms)
    arrows: true,          // Show navigation arrows
  };

  return (
    <div className={styles.sliderContainer}>
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="text-center">
            <img 
              src={slide.image} 
              alt={slide.title} 
              className={styles.image} // Apply the styles
            />
            <h3 className="mt-2 text-lg font-bold">{slide.title}</h3>
            <p className="text-gray-500">{slide.date}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default EventCarousel;
