import React, { useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [bookName, setBookName] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [genre, setGenre] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };

    const handleAdd = async () => {
        if (!bookName || !authorName || !genre || !photo) {
            alert("All fields are required.");
            return;
        }

        // Convert the image to base64
        const reader = new FileReader();
        reader.readAsDataURL(photo);
        reader.onloadend = async () => {
            const imageBase64 = reader.result as string;

            // Prepare the data to send to the API
            const body = {
                bookName,
                bookAuthor: authorName,
                genre,
                imageBase64,
            };

            try {
                const response = await fetch('/api/addBook', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                setBookName('');
                setAuthorName('');
                setGenre('');
                setPhoto(null);
                onClose();
            } catch (error) {
                console.error('Error adding book:', error);
            }
        };
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-gradient-to-r from-slate-500 to-gray-950 rounded-lg shadow-lg">
                <h2 className="mb-4 text-xl font-bold">Add a New Book</h2>

                <div className="mb-4">
                    <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
                    <select
                        id="genre"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    >
                        <option value="">Select a genre</option>
                        <option value="History">History</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Nonfiction">Nonfiction</option>
                        <option value="Biography">Biography</option>
                        <option value="Scifi">Scifi</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="bookName" className="block text-sm font-medium text-gray-700">Book Name</label>
                    <input
                        type="text"
                        id="bookName"
                        value={bookName}
                        onChange={(e) => setBookName(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="authorName" className="block text-sm font-medium text-gray-700">Author Name</label>
                    <input
                        type="text"
                        id="authorName"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Upload Photo</label>
                    <input
                        type="file"
                        id="photo"
                        onChange={handleFileChange}
                        className="w-full mt-1"
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleAdd}
                        className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-sky-700 to-gray-600 scale-110 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
