import { useState } from "react";
import { UserPlus, User } from "lucide-react"; // Import icons
import { toast } from "react-hot-toast";

interface FriendSuggestionRowProps {
    friend: {
        _id: string;
        name: string;
        district: string;
    };
    addingFriend: string | null;
    handleAddFriend: (friendId: string) => Promise<void>;
}

const FriendSuggestionRow: React.FC<FriendSuggestionRowProps> = ({
    friend,
    addingFriend,
    handleAddFriend,
}) => {
    const [addedFriends, setAddedFriends] = useState<string[]>([]);

    const handleAddFriendClick = async (friendId: string) => {
        await handleAddFriend(friendId);
        setAddedFriends((prev) => [...prev, friendId]);
    };

    return (
        <div
            key={friend._id}
            className="p-3 flex items-center justify-between bg-gradient-to-l from-gray-900 to-gray-400p-4 dark:bg-red-200 rounded-md shadow-sm mb-3"
        >
            <div className="flex items-center gap-4">
                <User className="w-12 h-12 text-gray-400" /> {/* Dummy profile picture */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">{friend.name}</h2>
                    <p className="text-sm text-gray-500">District: {friend.district}</p>
                </div>
            </div>
            <button
                onClick={() => handleAddFriendClick(friend._id)}
                className={`px-3 py-2 rounded-md text-white text-[13px] flex items-center gap-2 ${
                    addingFriend === friend._id || addedFriends.includes(friend._id)
                        ? "bg-gray-400 cursor-not-allowed"
                        : " bg-gray-800 hover:bg-gray-500"
                }`}
                disabled={addingFriend === friend._id || addedFriends.includes(friend._id)}
            >
                <UserPlus size={16} />
                {addingFriend === friend._id
                    ? "Adding..."
                    : addedFriends.includes(friend._id)
                    ? "Added"
                    : "Add Friend"}
            </button>
        </div>
    );
};

export default FriendSuggestionRow;
