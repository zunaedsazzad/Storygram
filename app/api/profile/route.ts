import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";

export const GET = async (req: Request) => {
    connectToDB();
    const clerk_user = await currentUser();
    if (!clerk_user) {
        return NextResponse.json({ message: "Not signed in" }, { status: 401 });
    }
    const user = await User.findOne({clerkId: clerk_user.id});
    return NextResponse.json({user_info: user});
}