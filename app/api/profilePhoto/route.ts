import { connectToDB } from "@/lib/mongoDB";
import { currentUser } from "@clerk/nextjs/server";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { photo } = body;

        if (!photo) {
            return NextResponse.json(
                { message: "Photo is required" },
                { status: 400 }
            );
        }

        // Get the current user
        const user = await currentUser();
        const user_id = user?.id;

        if (!user_id) {
            return NextResponse.json(
                { message: "User not authenticated" },
                { status: 401 }
            );
        }

        // Connect to the database
        await connectToDB();

        // Get MongoDB user reference
        const mongoUser = await User.findOne({ clerkId: user_id });

        if (!mongoUser) {
            return NextResponse.json(
                { message: "User not found in database" },
                { status: 404 }
            );
        }

        // Update the user's photo
        mongoUser.photo = photo;
        await mongoUser.save();

        return NextResponse.json(
            { message: "Photo updated successfully", user: mongoUser },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating photo:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}
