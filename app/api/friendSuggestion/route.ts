import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";
import Friend from "@/models/Friend";
import { currentUser } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export const GET = async () => {
    try {
        
        connectToDB();
        

        
        const clerkUser = await currentUser();
        
        if (!clerkUser) {
            return NextResponse.json({ message: "Not signed in" }, { status: 401 });
        }

        const currentUserId: string = clerkUser.id;
        

        
        const dbUser = await User.findOne({ clerkId: currentUserId });
        if (!dbUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        

        const userId = dbUser._id;

        
        const friends = await Friend.aggregate([
            {
                $match: {
                    $or: [
                        { friend_one: userId },
                        { friend_two: userId },
                    ],
                },
            },
            {
                $project: {
                    friendId: {
                        $cond: [
                            { $eq: ["$friend_one", userId] },
                            "$friend_two",
                            "$friend_one",
                        ],
                    },
                },
            },
        ]);

        
        const friendIds = friends.map((friend: { friendId: mongoose.Types.ObjectId }) => friend.friendId);

        
        const suggestedFriends = await User.aggregate([
            {
                $match: {
                    _id: { $nin: [userId, ...friendIds] },
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    area: 1,
                    district: 1,
                },
            },
        ]);

        return NextResponse.json({ suggested_friends: suggestedFriends });
    } catch (error) {
        console.error("Error fetching friend suggestions:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
};
