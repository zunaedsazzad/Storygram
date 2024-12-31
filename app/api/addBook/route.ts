import { connectToDB } from "@/lib/mongoDB"; // Assuming you have a MongoDB connection utility
import { currentUser } from "@clerk/nextjs/server";
import Book from "@/models/books"; // Your Book model
import User from "@/models/User"; // Your User model, if you need to reference users
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { bookName, bookAuthor, genre, imageBase64 } = body;

        // Validate required fields
        if (!bookName || !bookAuthor || !genre || !imageBase64) {
            return NextResponse.json(
                { message: "Book name, author, genre, and image are required" },
                { status: 400 }
            );
        }

        // Get the current user (if needed, e.g., for tracking which user added the book)
        const user = await currentUser();
        const user_id = user?.id;

        // You can check if you want to track who added the book (optional)
        if (!user_id) {
            return NextResponse.json(
                { message: "User not authenticated" },
                { status: 401 }
            );
        }

        // Connect to the database
        await connectToDB();

        // Decode the base64 image
        const imageBuffer = Buffer.from(imageBase64.split(',')[1], 'base64'); // Remove the base64 prefix before decoding

        // Get MongoDB user reference (optional, if you want to associate the book with the user)
        const mongoUser: any = await User.findOne({ clerkId: user_id });

        if (!mongoUser) {
            return NextResponse.json(
                { message: "User not found in database" },
                { status: 404 }
            );
        }

        // Create a new book
        const newBook = new Book({
            bookname: bookName,
            bookauthor: bookAuthor,
            genre: genre,
            photo: imageBuffer.toString('base64'), // Save the image as a base64 string
            users: mongoUser ? [mongoUser._id] : [], // Optional: Associate the book with the current user
        });

        // Save the new book to the database
        await newBook.save();

        return NextResponse.json(newBook, { status: 201 });
    } catch (error) {
        console.error("Error saving book:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}
