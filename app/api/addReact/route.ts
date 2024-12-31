import { connectToDB } from "@/lib/mongoDB";
import BookReview from "@/models/Review";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { postId } = body;

        if (!postId) {
            return NextResponse.json(
                { message: "Review ID is required" },
                { status: 400 }
            );
        }

        // Connect to the database
        await connectToDB();

        // Increment the react_count for the specified review
        const updatedReview = await BookReview.findByIdAndUpdate(
            postId,
            { $inc: { react_count: 1 } },
            { new: true } // Return the updated document
        );

        if (!updatedReview) {
            return NextResponse.json(
                { message: "Review not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedReview, { status: 200 });
    } catch (error) {
        console.error("Error updating react count:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}
