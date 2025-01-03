import { connectToDB } from "@/lib/mongoDB";
import { currentUser } from "@clerk/nextjs/server";
import Streak from "@/models/streak";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { pagesRead } = body;

        if (typeof pagesRead !== "number" || pagesRead <= 0) {
            return NextResponse.json(
                { message: "Invalid pagesRead value" },
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

        // Find the corresponding user in MongoDB
        const mongoUser: any = await User.findOne({ clerkId: user_id });

        if (!mongoUser) {
            return NextResponse.json(
                { message: "User not found in database" },
                { status: 404 }
            );
        }

        const userObjectId = mongoUser._id;

        // Get the current date in UTC (start of the day)
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        // Check if a streak already exists for today
        const existingStreak = await Streak.findOne({
            user_id: userObjectId,
            timestamp: {
                $gte: today, // From the start of today
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Until the start of the next day
            },
        });

        if (existingStreak) {
            return NextResponse.json(
                { message: "Streak already updated for today" },
                { status: 400 }
            );
        }

        // Create a new streak
        const newStreak = new Streak({
            user_id: userObjectId,
            page_count: pagesRead,
        });

        await newStreak.save();

        return NextResponse.json(newStreak, { status: 201 });
    } catch (error) {
        console.error("Error updating streak:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}
