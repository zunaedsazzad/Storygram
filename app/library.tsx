"use client";

import { useState, useEffect } from "react";

// Define types for the books
interface Book {
  _id: string;
  title: string;
  author: string;
  publishedYear: number;
}

export default function Library() {
  const [books, setBooks] = useState<Book[]>([]); // Store book list with Book type
  const [searchQuery, setSearchQuery] = useState<string>(""); // Store the search input
  const [sortBy, setSortBy] = useState<string>(""); // Store sorting choice
  const [loading, setLoading] = useState<boolean>(false); // Store loading state
  const [error, setError] = useState<string | null>(null); // Store error state

  // Fetch books from the backend (API)
  const fetchBooks = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset errors
    try {
      const response = await fetch(
        `/api/books?query=${encodeURIComponent(searchQuery)}&sortBy=${sortBy}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setBooks(data); // Update the books state with data
    } catch (err: unknown) {
      console.error("Failed to fetch books:", err);
      // TypeScript: Check if the error is an instance of Error before accessing message
      if (err instanceof Error) {
        setError(err.message); // Set error message
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false); // End loading
    }
  };

  // Fetch books whenever searchQuery or sortBy changes
  useEffect(() => {
    fetchBooks();
  }, [searchQuery, sortBy]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Library</h1>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search for books..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />

      {/* Sort Options */}
      <select
        onChange={(e) => setSortBy(e.target.value)}
        value={sortBy}
        style={{ marginRight: "10px", padding: "5px" }}
      >
        <option value="">Sort by</option>
        <option value="title">Title</option>
        <option value="publishedYear">Year Published</option>
      </select>

      <button onClick={fetchBooks} style={{ padding: "5px 10px" }}>
        Search
      </button>

      {/* Loading and Error States */}
      {loading && <p>Loading books...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Show the Books */}
      <ul style={{ marginTop: "20px" }}>
        {books.map((book) => (
          <li key={book._id}>
            <b>{book.title}</b> by {book.author} ({book.publishedYear})
          </li>
        ))}
      </ul>

      {/* No Books Found */}
      {!loading && books.length === 0 && <p>No books found.</p>}
    </div>
  );
}
