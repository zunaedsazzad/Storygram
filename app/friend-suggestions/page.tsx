'use client';
import { useEffect, useState } from "react";
import FriendSuggestionRow from "./FriendSuggestionRow"; // Update the import path accordingly
import { toast } from "react-hot-toast";

interface User {
    _id: string;
    name: string;
    district: string;
}

const FriendSuggestionsPage = () => {
    const [suggestedFriends, setSuggestedFriends] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [addingFriend, setAddingFriend] = useState<string | null>(null);

    useEffect(() => {
        const fetchFriendSuggestions = async () => {
            try {
                const response = await fetch("/api/friendSuggestion");
                if (!response.ok) {
                    throw new Error("Failed to fetch friend suggestions");
                }
                const data = await response.json();
                setSuggestedFriends(data.suggested_friends);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchFriendSuggestions();
    }, []);

    const handleAddFriend = async (friendId: string) => {
        setAddingFriend(friendId);
        try {
            const response = await fetch("/api/friendRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: friendId }),
            });

            if (!response.ok) {
                throw new Error("Failed to send friend request");
            }

            toast.success("Friend request sent successfully!");
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setAddingFriend(null);
        }
    };

    if (loading) {
        return <div className="text-center py-10 text-gray-600">Loading...</div>;
    }

    if (error) {
        toast.error(error);
        return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen  py-8">
            <h1 className="text-2xl font-bold mb-6">Friend Suggestions</h1>
            <div className="w-full max-w-2xl">
                {suggestedFriends.map((friend) => (
                    <FriendSuggestionRow
                        key={friend._id}
                        friend={friend}
                        addingFriend={addingFriend}
                        handleAddFriend={handleAddFriend}
                    />
                ))}
            </div>
        </div>
    );
};

export default FriendSuggestionsPage;
