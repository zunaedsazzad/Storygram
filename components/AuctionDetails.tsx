import React, { useEffect, useState } from "react";
import axios from "axios";

const AuctionDetails = ({ auctionId }: { auctionId: string }) => {
  const [auction, setAuction] = useState<any>(null); // State for auction details
  const [bidAmount, setBidAmount] = useState(""); // State for bid input
  const [error, setError] = useState(""); // State for error messages
  const [success, setSuccess] = useState(""); // State for success messages

  // Fetch auction details when the component loads
  useEffect(() => {
    axios
      .get(`/api/auctions/${auctionId}`)
      .then((response) => {
        setAuction(response.data); // Set auction data
      })
      .catch((error) => {
        setError("Failed to load auction details.");
      });
  }, [auctionId]);

  // Handle bid submission
  const handleBid = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    axios
      .post("/api/auctions/bid", { auctionId, bidAmount: parseFloat(bidAmount) })
      .then((response) => {
        setSuccess("Bid placed successfully!");
        setAuction(response.data); // Update auction with new bid data
        setBidAmount(""); // Clear the bid input
      })
      .catch((error) => {
        setError(error.response?.data?.error || "Failed to place bid.");
      });
  };

  if (!auction) {
    return <div>Loading auction details...</div>;
  }

  return (
    <div>
      <h1>Auction Details</h1>
      <h2>{auction.bookId?.title}</h2>
      <p><strong>Seller:</strong> {auction.sellerId?.email}</p>
      <p><strong>Starting Price:</strong> ${auction.startingPrice}</p>
      <p><strong>Current Bid:</strong> ${auction.currentBid || "No bids yet"}</p>
      <p><strong>Ends At:</strong> {new Date(auction.endTime).toLocaleString()}</p>

      <h3>Place a Bid</h3>
      <form onSubmit={handleBid}>
        <label>
          Your Bid:
          <input
            type="number"
            step="0.01"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            required
          />
        </label>
        <button type="submit">Place Bid</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default AuctionDetails;


