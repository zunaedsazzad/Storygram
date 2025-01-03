import { connectToDB } from "@/lib/mongoDB"; // MongoDB connection utility
import Book from "@/models/books"; // Your Book model
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Connect to the database
        await connectToDB();

        // Fetch all books
        const books = await Book.find(); // Populating user fields if necessary

        return NextResponse.json(books, { status: 200 });
    } catch (error) {
        console.error("Error fetching books:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}
