import { connectToDB } from "@/lib/mongoDB";
import { currentUser } from "@clerk/nextjs/server";
import BookReview from "@/models/Review";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json(); 
        const { bookName, text } = body;

        if (!bookName || !text) {
            return NextResponse.json(
                { message: "Book name and text are required" },
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
        const mongoUser: any = await User.findOne({ clerkId: user_id });

        if (!mongoUser) {
            return NextResponse.json(
                { message: "User not found in database" },
                { status: 404 }
            );
        }

        // Create a new book review
        const newBookReview = new BookReview({
            user_id: mongoUser._id,
            book_name: bookName,
            text: text,
            react_count: 0,
        });

        await newBookReview.save();

        return NextResponse.json(newBookReview, { status: 201 });
    } catch (error) {
        console.error("Error saving book review:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}
