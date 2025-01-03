"use client";
import React, { useState, useRef, useEffect } from "react";
import { Heart } from 'lucide-react';
import { Spin } from 'antd';

const ReviewPage = () => {
    const [text, setText] = useState('');
    const [bookName, setBookName] = useState('');
    const [loading, setLoading] = useState(false);

    interface Review {
        _id: number;
        user_id: {
            name: string;
            photo: string;
        };
        react_count: number;
        book_name: string;
        text: string;
    }
    
    const [reviews, setReviews] = useState<Review[]>([]);
    const [likedReviews, setLikedReviews] = useState<{ [key: number]: boolean }>({});
    const bookNameRef = useRef<HTMLTextAreaElement>(null);
    const textRef = useRef<HTMLTextAreaElement>(null);
    const fetchReviews = async () => {
        try {
            const response = await fetch('/api/showReviews');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setReviews(data);
            console.log(data);
        } catch (error) {
            console.error("Error fetching reviews:", (error as any).message);
        }
    };
    
    useEffect(() => {
        fetchReviews();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBookName(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = `${event.target.scrollHeight}px`;
    };

    const handleChangetext = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = `${event.target.scrollHeight}px`;
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/saveRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookName, text }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setBookName('');
            setText('');
            if (bookNameRef.current) {
                bookNameRef.current.style.height = 'auto';
            }
            if (textRef.current) {
                textRef.current.style.height = 'auto';
            }

            // Refresh the reviews list after submitting a new review
            await fetchReviews();
        } catch (error) {
            console.error("Error saving review:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReact = async (reviewId: number) => {
        try {
            const response = await fetch('/api/addReact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId: reviewId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setLikedReviews((prev) => ({
                ...prev,
                [reviewId]: true,
            }));
            fetchReviews();
        } catch (error) {
            console.error("Error adding react:", error);
        }
    };

    return (
        <div className="relative px-12 py-1 bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-900 dark:to-gray-900 min-h-screen flex">
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <Spin size="large" />
                </div>
            )}
            <div className="w-[200px] mt-3 bg-gray-800 dark:bg-gray-800 p-4 rounded">
                <h2 className="text-2xl font-bold text-white dark:text-gray-100">Filter</h2>
                <ul className="mt-8 text-md">
                    <li className="mb-2 text-gray-100 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer">Oldest</li>
                    <li className="mb-2 text-gray-100 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer">Latest</li>
                    <li className="mb-2 text-gray-100 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer">Popular</li>
                    <li className="mb-2 text-gray-100 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer">Mine</li>
                </ul>
            </div>
            <div className="w-[300px] container p-4 flex flex-col items-left">
                <h1 className="text-3xl ml-20 font-bold text-gray-900 dark:text-gray-100">Reviews</h1>
                <p className="ml-20 text-gray-700 dark:text-gray-300">
                    Get the best one
                </p>
            </div>
            <div className="flex flex-col items-center">
                <div className="mt-5 w-[600px] bg-opacity-5 ml-20 bg-gradient-to-r from-slate-500 to-gray-950  dark:from-grey-800 dark:to-grey-900 container mx-auto p-4 flex flex-col justify-center border-2 border-gray-300 dark:border-gray-700 rounded-lg">
                    <h1 className="text-md font- text-gray-900 dark:text-yellow-100">Create one...</h1>
                    <textarea 
                        placeholder="Book name" 
                        className="mt-3 w-[200px] font-bold font-mono text-lg border-b-2 border-yellow-100 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none resize-none overflow-hidden placeholder-grey-600 dark:placeholder-gray-400"
                        value={bookName}
                        onChange={handleChange}
                        ref={bookNameRef}
                        style={{ height: 'auto', paddingBottom: '0px' }}
                    />

                    <textarea 
                        placeholder="Say whatever you think" 
                        className="mt-3 w-full font-semibold border-b-2 border-yellow-100 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none resize-none overflow-hidden placeholder-grey-600 dark:placeholder-gray-400"
                        value={text}
                        onChange={handleChangetext}
                        ref={textRef}
                        style={{ height: 'auto', paddingBottom: '0px' }}
                    />
                    <button 
                        className="mt-4 font-insightMelody self-end bg-gradient-to-r from-sky-700 to-gray-600 scale-110 text-white text-sm px-2 py-1 rounded hover:gradient-to-r hover:from-green-600 hover:to-teal-600 hover:text-black"
                        onClick={handleSubmit}
                    >
                        Upload
                    </button>
                </div>
                <div className="mt-5 w-[600px]  ml-20 bg-gradient-to-r from-slate-500 to-slate-800  dark:from-gray-900 dark:to-gray-900 container mx-auto p-4 flex flex-col justify-center border-2 border-gray-300  dark:border-gray-700 rounded-lg dark:bg-transparent">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            
                        </div>
                    ) : (
                        <ul>
                            {reviews.map((review, index) => (
                                <li key={index} className="relative text-gray-900 dark:text-gray-100 mb-6 border-b border-gray-300 dark:border-gray-700 pb-4 pr-10">
                                    <div className="flex items-center mb-2">
                                        <img src={review.user_id.photo} alt="Profile" className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 mr-3" />
                                        <div>
                                            <div className="font-bold">{review.user_id.name}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                                <Heart className="w-4 h-4 mr-1" /> {review.react_count}
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" font-semibold mb-3 text-yellow-100">{review.book_name}</div>
                                    <div className="mb-8 font-extralight">{review.text}</div>
                                    <button 
                                        className="absolute bottom-1 right-3 mb-1"
                                        onClick={() => handleReact(review._id)}
                                    >
                                        <Heart className={`w-6 h-6 ${likedReviews[review._id] ? 'text-red-400' : 'text-gray-500'}`} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewPage;
