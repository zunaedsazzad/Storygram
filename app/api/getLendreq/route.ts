import { connectToDB } from "@/lib/mongoDB";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from 'next/server';// Replace with your actual DB connection utility
import Book from "@/models/books"; // Path to your Book model
import LendReq from "@/models/LendReq"; // Path to your LendReq model
import User from "@/models/User"; // Path to your User model

export const GET = async () => {
    try {
      // Connect to the database
      await connectToDB();
  
      // Get the current user from Clerk
      const clerk_user = await currentUser();
      if (!clerk_user) {
        return NextResponse.json(
          { message: "Not signed in" },
          { status: 401 }
        );
      }
  
      // Find the user in your database
      const user = await User.findOne({ clerkId: clerk_user.id });
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
  
      const currentUserId = user._id;
  
      // Find books where the user's ID exists in the 'users' array
      const books = await Book.find({ users: currentUserId });
  
      if (!books.length) {
        return NextResponse.json(
          { message: "No books found for this user" },
          { status: 404 }
        );
      }
  
      // Extract book IDs
      const bookIds = books.map((book) => book._id);
  
      // Find lend requests for these books
      const lendRequests = await LendReq.find({ book_id: { $in: bookIds } })
        .populate<{ book_id: { bookname: string } }>("book_id", "bookname")
        .populate<{ user_id: { name: string; email: string } }>("user_id", "name email");
  
      if (!lendRequests.length) {
        return NextResponse.json(
          { message: "No lend requests found for these books" },
          { status: 404 }
        );
      }
  
      // Prepare the response
      const response = lendRequests.map((lendReq) => ({
        bookName: lendReq.book_id.bookname,
        userName: lendReq.user_id.name,
        userEmail: lendReq.user_id.email,
      }));
  
      return NextResponse.json(
        { message: "Data fetched successfully", data: response },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      return NextResponse.json(
        { message: "An error occurred while fetching data" },
        { status: 500 }
      );
    }
  };
