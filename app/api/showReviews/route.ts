import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";
import "@/models/User"; 
import { NextResponse } from "next/server";
import BookReview from "@/models/Review";

export async function GET() {
    try {
        console.log("api called");
        // Connect to the database
        await connectToDB();

        // Fetch all books and populate user details
        const booksreview = await BookReview.find()
            .populate(
                 "user_id",
                "name email photo", // Fields to include from User model
            )
            .sort({ createdAt: -1 }); // Sort by most recent first
            console.log(booksreview);
        return NextResponse.json(booksreview , { status: 200 });
    } catch (error) {
        console.error("Error fetching books:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}
