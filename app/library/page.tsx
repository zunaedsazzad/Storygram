"use client";
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Modal from "./modal";

import { FocusCards } from "@/components/ui/focus-cards";

interface Book {
  _id: string;
  photo: string;
  bookname: string;
  bookauthor: string;
}

const NewPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);

  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getLibrary");
        const data = await response.json();
        setBooks(data);
        const tempCards: any[] = [];
        for (let i = 0; i < data.length; i++) {
          tempCards.push({
            id: data[i]._id,
            title: data[i].bookname,
            src: `data:image/jpeg;base64,${data[i].photo}`,
            author: data[i].bookauthor,
          });
        }
        setCards(tempCards);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative p-4 bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-900 dark:to-gray-900 min-h-screen flex">
      {/* Left Section: Filter Menu */}
      <div className="w-[200px] mt-3 bg-gray-800 dark:bg-gray-800 p-4 rounded">
        <h2 className="text-2xl font-bold text-white dark:text-gray-100">Filter</h2>
        <label htmlFor="genre" className="block text-gray-100 dark:text-gray-300">
          Genre
        </label>
        <select
          id="genre"
          className="mt-2 p-2 w-full bg-gray-700 text-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded"
        >
          <option value="all">All</option>
          <option value="history">History</option>
          <option value="fiction">Fiction</option>
          <option value="nonfiction">Nonfiction</option>
          <option value="scifi">Sci-Fi</option>
          <option value="biography">Biography</option>
        </select>
        <ul className="mt-8 text-md">
          <li className="mb-2 text-gray-100 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer">
            Mine
          </li>
          <li className="mb-2 text-gray-100 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer">
            Latest
          </li>
          <li className="mb-2 text-gray-100 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer">
            Popular
          </li>
          <li className="mb-2 text-gray-100 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer">
            Antic
          </li>
        </ul>
      </div>

      {/* Main Content Section */}
      <div className="flex-1 py-8 relative">
        <div className="abosulte justify-start">
          {cards.length > 0 && (<FocusCards cards={cards} /> )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-6 right-6 bg-gradient-to-r from-sky-700 to-gray-600 scale-110 text-white px-3 py-2 font-sm rounded hover:bg-blue-600 flex items-center"
        >
          <Plus className="mr-2" />
          Add New
        </button>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default NewPage;
