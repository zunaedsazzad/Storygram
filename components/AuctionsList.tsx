import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client"; // Default import for Socket.IO client

// Define the type for an auction item
interface Auction {
  _id: string;
  bookId: {
    title: string;
  };
  currentBid: number;
  endTime: string;
}

const AuctionsList = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]); // State to store auction data

  // Fetch active auctions when the component loads
  useEffect(() => {
    axios
      .get<Auction[]>("/api/auctions")
      .then((response) => {
        setAuctions(response.data); // Set auction data
      })
      .catch((error) => {
        console.error("Failed to load auctions", error);
      });
  }, []);

  // Setup Socket.IO for real-time updates
  useEffect(() => {
    const socket = io("http://localhost:3000"); // Connect to the WebSocket server

    // Listen for real-time auction updates
    socket.on("auction-update", (updatedAuction: Auction) => {
      setAuctions((prev) =>
        prev.map((auction) =>
          auction._id === updatedAuction._id ? updatedAuction : auction
        )
      );
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection when the component unmounts
    };
  }, []);

  return (
    <div>
      <h1>Active Auctions</h1>
      {auctions.length > 0 ? (
        <div>
          {auctions.map((auction) => (
            <div key={auction._id} className="auction-card">
              <h2>{auction.bookId.title}</h2>
              <p>Current Bid: ${auction.currentBid}</p>
              <p>Ends: {new Date(auction.endTime).toLocaleString()}</p>
              <a href={`/auction/${auction._id}`}>View Details</a>
            </div>
          ))}
        </div>
      ) : (
        <p>No active auctions at the moment.</p>
      )}
    </div>
  );
};

export default AuctionsList;
