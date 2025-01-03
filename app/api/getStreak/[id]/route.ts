import { connectToDB } from "@/lib/mongoDB";
import Streak from "@/models/streak";
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (_: NextRequest, context: { params: { id: string } }) => {
    try {
        const { id: userId } = await context.params;
        console.log(userId);

        if (!userId) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        // Connect to the database
        await connectToDB();

        // Find all streaks for the user
        const streaks = await Streak.find({ user_id: userId }).select("timestamp page_count").exec();
        

        if (!streaks || streaks.length === 0) {
            return NextResponse.json(
                { message: "No streaks found for the user" },
                { status: 404 }
            );
        }

        // Extract only the date part from the timestamp
        const streaksWithDateOnly = streaks.map(streak => ({
            date: streak.timestamp.toISOString().split('T')[0],
            page_count: streak.page_count
        }));
        console.log(streaksWithDateOnly);

        return NextResponse.json(streaksWithDateOnly, { status: 200 });
    } catch (error) {
        console.error("Error fetching streaks:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
};
