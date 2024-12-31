import { connectToDB } from "@/lib/mongoDB";
import { currentUser } from "@clerk/nextjs/server";
import Friend from "@/models/Friend";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const body = await req.json(); 
        const frnd_id = body.id;

        const user = await currentUser();
        const my_id = user?.id;

        if (!my_id || !frnd_id) {
            return NextResponse.json(
                { message: "Both my_id and frnd_id are required" },
                { status: 400 }
            );
        }

        

        await connectToDB();

        const mongoUser:any = await User.findOne({ clerkId: my_id });

        const existingRequest = await Friend.findOne({
            $or: [
                { friend_one: mongoUser._id, friend_two: frnd_id },
                { friend_one: frnd_id, friend_two: mongoUser._id },
            ],
        });

        if (existingRequest) {
            return NextResponse.json(
                {
                    message:
                        "Friend request already exists or you are already friends.",
                },
                { status: 400 }
            );
        }

        const newFriendRequest = new Friend({
            friend_one: mongoUser._id,
            friend_two: frnd_id,
            who_requested: mongoUser._id,
            is_requested: true,
        });

        await newFriendRequest.save();

        return NextResponse.json(newFriendRequest, { status: 201 });
    } catch (error) {
        console.error("Error creating friend request:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}
