"use client";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import toast from "react-hot-toast";
import { UserRoundPen } from 'lucide-react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import "./style.css";

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
    avatar?: string;
    description?: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        const response = await fetch('/api/profile');
        const data = await response.json();
        if (response.status === 200) {
            setProfile(data.user_info);
            console.log(data.user_info);
        } else {
            toast.error("Failed to load profile");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProfile();
    }, []);

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

        const formData = new FormData();
        formData.append('photo', file);

        const response = await fetch('/api/profilePhoto', {
            method: 'POST',
            body: formData,
        });

        if (response.status === 200) {
            toast.success("Photo uploaded successfully");
            fetchProfile(); 
        } else {
            toast.error("Failed to upload photo");
        }
    };

    if (loading) return <Spin size="large" fullscreen />;

    return (
        <div className="text-gray-100 w-full bg-gray-900 h-full container-class overflow-y-scroll flex">
            <div className="w-3/4 p-6 flex flex-col items-center">
                <div className="relative w-full h-72 md:h-96">
                    {profile?.avatar && (
                        <img
                            src={profile.avatar}
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

                <div style={{ width: '700px', height: '150px', margin: '20px 0' }}>
                    <CalendarHeatmap
                        startDate={new Date('2024-01-01')}
                        endDate={new Date('2024-10-01')}
                        values={[
                            { date: '2024-01-01', count: 115 },
                            { date: '2024-01-10', count: 0 },
                            { date: '2024-01-25', count: 145 },
                            { date: '2024-02-05', count: 28 },
                            { date: '2024-02-15', count: 0 },
                            { date: '2024-03-01', count: 133 },
                            { date: '2024-03-15', count: 0 },
                            { date: '2024-03-25', count: 156 },
                            { date: '2024-04-01', count: 21 },
                            { date: '2024-04-15', count: 0 },
                            { date: '2024-05-01', count: 19 },
                            { date: '2024-05-20', count: 175 },
                            { date: '2024-06-01', count: 0 },
                            { date: '2024-06-15', count: 42 },
                            { date: '2024-07-01', count: 168 },
                            { date: '2024-07-20', count: 0 },
                            { date: '2024-08-01', count: 88 }
                            // ...and so on
                        ]}
                    />
                </div>

                <div className="p-6 w-full space-y-6 container-class">
                    <EditableSection title="About Me" content={profile?.description} onSave={handleSave} />
                    <Section title="Contact Information" content={profile?.email} />
                    <div className="flex space-x-6">
                        <EditableSection title="Area" content={profile?.address} onSave={handleSave} className="flex-1" />
                        <EditableSection title="District" content={profile?.district} onSave={handleSave} className="flex-1" />
                        <EditableSection title="Division" content={profile?.division} onSave={handleSave} className="flex-1" />
                    </div>
                    <div className="flex space-x-6">
                        <EditableSection title="Age" content={`Age: ${profile?.age}`} onSave={handleSave} />
                        <Section title="User Type" content={profile?.role} />
                    </div>
                </div>
            </div>

            <div className="w-1/4 p-6 bg-gray-800 mt-6 rounded-lg shadow-md">
                <div className="flex justify-between mb-4">
                    <button className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700">Genres</button>
                    <button className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700">Friends</button>
                    <button className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700">Clubs</button>
                </div>
                <h2 className="text-2xl font-semibold mb-4">Genres</h2>
                <ul className="list-disc list-inside">
                    {profile?.genres.map((genre, index) => (
                        <li key={index}>{genre}</li>
                    ))}
                </ul>
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
