import React, { useState } from 'react';
import { Spin } from 'antd';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookId: string | null; // Accept the book ID as a prop
}

const ModalReq: React.FC<ModalProps> = ({ isOpen, onClose, bookId }) => {
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const [loading, setLoading] = useState(false);

    console.log(bookId);

    const handleAdd = async () => {
        if (!email || !contactNumber || !fromDate || !toDate || !bookId) {
            alert("All fields are required.");
            return;
        }

        // Prepare the data to send to the API
        const body = {
            email,
            contactNumber,
            fromDate,
            toDate,
            deliveryMethod,
            bookId, // Include book ID in the payload
        };

        setLoading(true);

        try {
            const response = await fetch('/api/requestBook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setEmail('');
            setContactNumber('');
            setFromDate('');
            setToDate('');
            setDeliveryMethod('');
            onClose();
        } catch (error) {
            console.error('Error adding booking:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <Spin size="large" />
                </div>
            )}
            <div className="w-full max-w-md p-6 bg-gradient-to-r from-teal-600 to-teal-900 rounded-lg shadow-lg">
                <h2 className="mb-4 text-xl font-bold">Add a New Booking</h2>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                    <input
                        type="text"
                        id="contactNumber"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                        
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">From Date</label>
                    <input
                        type="date"
                        id="fromDate"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">To Date</label>
                    <input
                        type="date"
                        id="toDate"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
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
                        Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalReq;
