import React, { useState } from "react";
import axios from "axios";

const CreateAuction = () => {
  const [bookId, setBookId] = useState(""); // Input for book ID
  const [startingPrice, setStartingPrice] = useState(""); // Input for starting price
  const [endTime, setEndTime] = useState(""); // Input for auction end time

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    // Send data to the backend
    axios
      .post("/api/auctions", { bookId, startingPrice, endTime })
      .then((response) => {
        alert("Auction created!"); // Notify success
      })
      .catch((error) => {
        alert(error.response?.data?.error || "Failed to create auction"); // Show error message
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Auction</h1>
      <label>
        Book ID:
        <input
          type="text"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)} // Update state
        />
      </label>
      <label>
        Starting Price:
        <input
          type="number"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)} // Update state
        />
      </label>
      <label>
        End Time:
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)} // Update state
        />
      </label>
      <button type="submit">Create Auction</button>
    </form>
  );
};

export default CreateAuction;
