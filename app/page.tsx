'use client';
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import React from "react";
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';

export const useOutsideClick = (
	ref: React.RefObject<HTMLDivElement>,
	callback: Function
) => {
	useEffect(() => {
		const listener = (event: any) => {
			if (!ref.current || ref.current.contains(event.target)) {
				return;
			}
			callback(event);
		};

		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [ref, callback]);
};

export default function Home() {
	const [data, setData] = useState<any[]>([]);
	const cardRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	useOutsideClick(cardRef, () => {
		console.log("Clicked outside");
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("https://wolnelektury.pl/api/books");
				let result = await response.json();
				
				// Shuffle and slice the first 14 books
				result = result.sort(() => 0.5 - Math.random()).slice(0, 14);
				
				setData(result);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	const handleWishlistClick = async (book: any) => {
		try {
			const response = await fetch('/api/addwishlist', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ bookId: book.slug }),
			});
			if (response.ok) {
				console.log('Book added to wishlist');
			} else {
				console.error('Failed to add book to wishlist');
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
		}
	};

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
		}
	};

	return (
		<div className="h-screen bg-gradient-to-r from-gray-400 to-gray-600 p-4 dark:from-gray-900 dark:to-gray-900">
			<h1 className="text-2xl font-bold text-white mb-4">Trending Books of this week</h1>
			{data.length > 0 ? (
				<div className="relative">
					<button
						className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full z-10"
						onClick={scrollLeft}
					>
						<ChevronLeft className="text-gray-500 hover:text-black" />
					</button>
					<div
						ref={scrollContainerRef}
						className="flex overflow-x-hidden space-x-4"
					>
						{data.map((book) => (
							<div
								key={book.slug}
								ref={cardRef}
								className="relative bg-white shadow-md rounded-lg overflow-hidden"
								style={{ aspectRatio: '2 / 3', minWidth: '200px' }} // Set aspect ratio to 2:3 and min-width
							>
								<Image
									src={book.simple_thumb}
									alt={book.title}
									width={200}
									height={300} // Adjust height to maintain 2:3 ratio
									className="w-full h-full object-cover"
								/>
								<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
									<h3 className="text-lg font-bold">{book.title}</h3>
									<p className="text-sm">{book.author}</p>
								</div>
								<button
									className="absolute top-2 right-2 p-1 bg-white rounded-full"
									onClick={() => handleWishlistClick(book)}
								>
									<Heart className="text-gray-500 hover:text-red-500" />
								</button>
							</div>
						))}
					</div>
					<button
						className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full z-10"
						onClick={scrollRight}
					>
						<ChevronRight className="text-gray-500 hover:text-black" />
					</button>
				</div>
			) : (
				"Loading..."
			)}
		</div>
	);
}
