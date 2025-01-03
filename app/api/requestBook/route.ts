import { connectToDB } from "@/lib/mongoDB";
import { currentUser } from "@clerk/nextjs/server";
import LendReq from "@/models/LendReq";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { bookId, email, contactNumber, fromDate, toDate, deliveryMethod } = body;

        // Validate required fields
        if (!bookId || !email || !contactNumber || !fromDate || !toDate) {
            return NextResponse.json(
                { message: "All fields are required." },
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

        // Find the user in MongoDB
        const mongoUser: any = await User.findOne({ clerkId: user_id });

        if (!mongoUser) {
            return NextResponse.json(
                { message: "User not found in database" },
                { status: 404 }
            );
        }

        // Create a new lending request
        const newLendReq = new LendReq({
            book_id: bookId,
            user_id: mongoUser._id,
            from_date: new Date(fromDate),
            to_date: new Date(toDate),
        });

        await newLendReq.save();

        return NextResponse.json(newLendReq, { status: 201 });
    } catch (error) {
        console.error("Error creating lending request:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}
