"use client";
import { use, useEffect, useState } from "react";
import { Spin } from "antd";
import toast from "react-hot-toast";
import { UserRoundPen } from 'lucide-react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import "./style.css";
import { Handshake } from "lucide-react";

interface Profile {
    name: string;
    email: string;
    address: string;
    division: string;
    district: string;
    age: number;
    role: string;
    genres: string[];
    clerkId?: string;
    _id: string;
    photo?: string;
    description?: string;
}
interface User {
    friend_one: string;
    _id: string;
    name: string;
    district: string;
    friend_two: any;

}

export default function ProfilePage() {
    const [id, setId] = useState<string>('');
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<any[]>([]); // Holds the friend requests
    const [streakValues, setStreakValues] = useState<any[]>([]);
    const [activeButton, setActiveButton] = useState<string>(''); // Track active button

    const fetchProfile = async () => {
        try {
            const response = await fetch("/api/profile");
            const data = await response.json();
            if (response.status === 200) {
                setProfile(data.user_info);
            } else {
                toast.error("Failed to load profile");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Error loading profile");
        } finally {
            setLoading(false);
        }
    };

    const fetchStreakData = async (id: string) => {
        try {
            console.log("fetching streak data for user", id);
            const response = await fetch(`/api/getStreak/${id}`);
            if (response.status === 200) {
                const streakData = await response.json();
                const formattedData = streakData.map((streak: { timestamp: string; page_count: number }) => ({
                    date: streak.timestamp.split("T")[0],
                    count: streak.page_count,
                }));
                setStreakValues(formattedData);
            } else {
                toast.error("No streak data found");
            }
        } catch (error) {
            toast.error("Failed to fetch streak data");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (profile?._id) {
            fetchStreakData(profile._id);
        }
    }, [profile]);
    

    const handleSave = async (updatedProfile: Partial<Profile>) => {
        const newProfile = { ...profile, ...updatedProfile };
        const response = await fetch('/api/profileUpdate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProfile),
        });

        if (response.status === 200) {
            toast.success("Profile updated successfully");
            fetchProfile(); 
        } else {
            toast.error("Failed to update profile");
        }
    };

    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        // Convert the image file to a base64 string
        const toBase64 = (file: File) =>
            new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = (error) => reject(error);
            });
    
        try {
            const base64String = await toBase64(file);
    
            // Send the base64 string to the server
            const response = await fetch('/api/profilePhoto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ photo: base64String }),
            });
    
            if (response.status === 200) {
                toast.success("Photo uploaded successfully");
                fetchProfile(); // Refresh the profile to reflect the uploaded photo
            } else {
                toast.error("Failed to upload photo");
            }
        } catch (error) {
            console.error("Error uploading photo:", error);
            toast.error("Failed to upload photo");
        }
    };

    const handleShowRequests = async () => {
        console.log('Show Requests');
        const response = await fetch('/api/showRequests');
        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            setRequests(data.friendRequests); // Update the requests state
            console.log(requests);
            toast.success("Requests loaded successfully");
        } else {
            toast.error("Failed to load requests");
        }
    };

    if (loading) return <Spin size="large" fullscreen />;

    return (
        <div className="text-gray-100 w-full bg-gray-900 h-full container-class overflow-y-scroll flex">
            <div className="w-5/8 p-8 flex flex-col items-center justify-center mx-auto">
                <div className="relative w-full h-72 md:h-96">
                    {profile?.photo && (
                        <img
                            src={profile.photo}
                            alt={profile.name}
                            className="w-full rounded-lg h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                        <h1 className="2xl:text-8xl font-rogan tracking-wider xl:text-7xl lg:text-6xl md:text-5xl sm:text-4xl text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            {profile?.name}
                        </h1>
                    </div>
                    <label className="absolute right-4 bottom-4 cursor-pointer hover:bg-gray-700 bg-opacity-50 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-3 py-1 rounded-md">
                        Upload Photo
                        <input type="file" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                </div>

                <div style={{ width: '650px', height: '150px', margin: '20px 0' }}>
                    <CalendarHeatmap
                    startDate={new Date('2024-01-01')}
                    endDate={new Date('2024-10-01')}
                    values={streakValues}
                />
                </div>

                <div className="p-6 w-full space-y-6 container-class">
                    <EditableSection title="About Me" content={profile?.description} onSave={handleSave} className="bg-gradient-to-t from-slate-600 to-gray-800"/>
                    <Section title="Contact Information" content={profile?.email} />
                    <div className="flex space-x-6">
                        <EditableSection title="Area" content={profile?.address} onSave={handleSave} className="flex-1 bg-gradient-to-t from-slate-600 to-gray-800" />
                        <EditableSection title="District" content={profile?.district} onSave={handleSave} className="flex-1 bg-gradient-to-t from-slate-600 to-gray-800" />
                        <EditableSection title="Division" content={profile?.division} onSave={handleSave} className="flex-1 bg-gradient-to-t from-slate-600 to-gray-800" />
                    </div>
                    <div className="flex space-x-6 ">
                        <EditableSection title="Age" content={`Age: ${profile?.age}`} onSave={handleSave}  className="bg-gradient-to-t from-slate-600 to-gray-800" />
                        <Section title="User Type" content={profile?.role}  />
                    </div>
                </div>
            </div>

            <div className="w-1/4 p-6 bg-gray-800 mt-6 rounded-lg shadow-md">
                <div className="flex justify-between mb-5">
                    <button
                        className={`px-3 py-1 rounded-lg transform transition-transform ${activeButton === 'friends' ? 'bg-gradient-to-r from-sky-700 to-gray-800 scale-110' : 'bg-gray-600'} text-sm text-white hover:bg-gray-800`}
                        onClick={() => setActiveButton('friends')}
                    >
                        Friends
                    </button>
                    <button
                        className={`px-3 py-1 rounded-lg transform transition-transform ${activeButton === 'clubs' ? 'bg-gradient-to-r from-sky-700 to-gray-800 scale-110' : 'bg-gray-600'} text-sm text-white hover:bg-gray-800`}
                        onClick={() => setActiveButton('clubs')}
                    >
                        Clubs
                    </button>
                    <button
                        className={`px-3 py-1 rounded-lg transform transition-transform ${activeButton === 'requests' ? ' bg-gradient-to-r from-sky-700 to-gray-800 scale-110' : 'bg-gray-600'} text-sm text-white hover:bg-gray-800`}
                        onClick={() => {
                            setActiveButton('requests');
                            handleShowRequests();
                        }}
                    >
                        Request
                    </button>
                </div>

                {/* Render friend requests as cards */}
                <div className="space-y-4">
                    {requests.map((request) => (
                        <div key={request._id} className="bg-gradient-to-r from-slate-500 to-slate-700 p-1 rounded-md shadow-md">
                            <div className="flex items-center space-x-4">
                                <img
                                    // src={request.avatar || '/default-avatar.png'} // Use a placeholder if no photo is provided
                                    alt={request.name}
                                    className="w-12 h-12 rounded-full border-2 border-dotted border-black p-2"
                                />
                                <div className="flex-1">
                                    <h3 className="text-md font-semibold text-black">{request.friend_one.name}</h3>
                                    <p className="text-sm text-white">{request.friend_one.district}</p>
                                </div>
                                <button
                                    className="text-white px-3 py-1 rounded-md hover:text-green-700 flex items-center"
                                    onClick={() => console.log('Accepted request for', request.friend_one.name)}
                                >
                                    <Handshake className="mr-2" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function EditableSection({ title, content, onSave, className }: { title: string, content?: string, onSave: (updatedProfile: Partial<Profile>) => void, className?: string }) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(content || "");

    const handleSave = () => {
        let updatedProfile: Partial<Profile> = {};
        switch (title) {
            case "About Me":
                updatedProfile = { description: value };
                break;
            case "Area":
                updatedProfile = { address: value };
                break;
            case "District":
                updatedProfile = { district: value };
                break;
            case "Division":
                updatedProfile = { division: value };
                break;
            case "Age":
                const age = parseInt(value.split(': ')[1]);
                updatedProfile = { age };
                break;
            default:
                break;
        }
        onSave(updatedProfile);
        setIsEditing(false);
    };

    const handleDiscard = () => {
        setValue(content || "");
        setIsEditing(false);
    };

    return (
        <div className={`bg-gray-800 rounded-lg p-6 shadow-md relative ${className}`}>
            <h2 className="text-1xl font-semibold mb-4">{title}</h2>
            {isEditing ? (
                <>
                    <textarea value={value} onChange={(e) => setValue(e.target.value)} className="w-full p-2 rounded-md h-12 text-black" />
                    <div className="flex space-x-2 mt-4">
                        <button className="bg-gray-400 text-black px-3 py-1 rounded-md hover:bg-gray-500" onClick={handleSave}>Save</button>
                        <button className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700" onClick={handleDiscard}>Discard</button>
                    </div>
                </>
            ) : (
                <>
                    <p>{content || "No information provided."}</p>
                    <UserRoundPen className="absolute right-4 top-4 cursor-pointer hover:text-gray-400" onClick={() => setIsEditing(true)} />
                </>
            )}
        </div>
    );
}

function Section({ title, content }: { title: string, content?: string }) {
    return (
        <div className="bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-1xl font-semibold mb-4">{title}</h2>
            <p>{content || "No information provided."}</p>
        </div>
    );
}
