"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import React from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { NextPage } from "next";

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

const Home: NextPage = () => {
	const [data, setData] = useState<any[]>([]);
	const [pagesRead, setPagesRead] = useState<number>(0);
	const cardRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const countupPagesRef = useRef<HTMLHeadingElement>(null);
	const countupBooksRef = useRef<HTMLHeadingElement>(null);
	let countUpPagesAnim: any;
	let countUpBooksAnim: any;

	useOutsideClick(cardRef, () => {
		console.log("Clicked outside");
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					"https://wolnelektury.pl/api/books"
				);
				let result = await response.json();

				// Shuffle and slice the first 14 books
				result = result.sort(() => 0.5 - Math.random()).slice(0, 14);

				setData(result);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
		initCountUp();
	}, []);

	const initCountUp = async () => {
		const countUpModule = await import("countup.js");
		if (countupPagesRef.current) {
			countUpPagesAnim = new countUpModule.CountUp(
				countupPagesRef.current,
				1000
			);
			if (!countUpPagesAnim.error) {
				countUpPagesAnim.start();
			} else {
				console.error(countUpPagesAnim.error);
			}
		}
		if (countupBooksRef.current) {
			countUpBooksAnim = new countUpModule.CountUp(
				countupBooksRef.current,
				50
			);
			if (!countUpBooksAnim.error) {
				countUpBooksAnim.start();
			} else {
				console.error(countUpBooksAnim.error);
			}
		}
	};

	const handleWishlistClick = async (book: any) => {
		try {
			const response = await fetch("/api/addwishlist", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ bookId: book.slug }),
			});
			if (response.ok) {
				console.log("Book added to wishlist");
			} else {
				console.error("Failed to add book to wishlist");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleUpdateClick = async () => {
		try {
			const response = await fetch("/api/newStreak", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ pagesRead }),
			});
			if (response.ok) {
				console.log("Streak updated");
			} else {
				console.error("Failed to update streak");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({
				left: -300,
				behavior: "smooth",
			});
		}
	};

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({
				left: 300,
				behavior: "smooth",
			});
		}
	};

	return (
		<div className="h-screen p-12 bg-gradient-to-r from-gray-400 to-gray-600  dark:from-gray-900 dark:to-gray-900">
			<h1 className="text-2xl font-bold text-white mb-4">
				Trending Books of this week
			</h1>
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
								style={{
									aspectRatio: "2 / 3",
									minWidth: "200px",
								}} // Set aspect ratio to 2:3 and min-width
							>
								<Image
									src={book.simple_thumb}
									alt={book.title}
									width={200}
									height={300} // Adjust height to maintain 2:3 ratio
									className="w-full h-full object-cover"
								/>
								<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
									<h3 className="text-lg font-bold">
										{book.title}
									</h3>
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
			<div className="flex w-full mt-12 space-x-4 justify-between">
				<div className="text-white font-semibold text-4xl flex flex-col items-center justify-center">
					<h1
						ref={countupBooksRef}
						onClick={() => {
							if (countUpBooksAnim) {
								countUpBooksAnim.reset();
								countUpBooksAnim.start();
							}
						}}
						className="bg-gradient-to-r from-red-200 to-indigo-300 text-transparent bg-clip-text"
					>
						0
					</h1>
					<p className="bg-gradient-to-r from-green-200 to-blue-500 text-transparent bg-clip-text">
						You read (count) books
					</p>
				</div>
				<div className="border-[0.5px] border-white p-6 rounded-lg w-full max-w-md">
					<div className="text-center">
						<h2 className="text-xl font-bold bg-gradient-to-r from-green-200 to-blue-500 text-transparent bg-clip-text mb-8">
							What's your today's reading update
						</h2>
					</div>
					<div className="mt-4 flex justify-between items-center">
						<input
							type="number"
							placeholder="Enter pages read"
							className="flex-1 p-2 rounded-lg bg-gradient-to-l from-slate-500 to-gray-700 border border-green-500 mr-2"
							value={pagesRead}
							onChange={(e) =>
								setPagesRead(Number(e.target.value))
							}
						/>
						<button
							className="bg-green-600 text-white px-3 py-1 rounded-md text-sm"
							onClick={handleUpdateClick}
						>
							Update
						</button>
					</div>
				</div>
				<div className="text-white font-semibold text-4xl flex flex-col items-center justify-center">
					<h1
						ref={countupPagesRef}
						onClick={() => {
							if (countUpPagesAnim) {
								countUpPagesAnim.reset();
								countUpPagesAnim.start();
							}
						}}
						className="bg-gradient-to-r from-red-300  to-yellow-200 text-transparent bg-clip-text"
					>
						0
					</h1>
					<p className="bg-gradient-to-r from-blue-300 to-green-200 text-transparent bg-clip-text">
						You read (count) pages
					</p>
				</div>
			</div>
		</div>
	);
};

export default Home;
