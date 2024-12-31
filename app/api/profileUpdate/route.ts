import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";

export const POST = async (req: Request) => {
    const { photo, email, name, address, division, district, age, role, genres, clerkId, avatar, description } = await req.json();

    if (!email) {
        return NextResponse.json(
            { message: "Email is required" },
            { status: 400 }
        );
    }

    connectToDB();

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        user.name = name || user.name;
        user.address = address || user.address;
        user.division = division || user.division;
        user.district = district || user.district;
        user.age = age || user.age;
        user.role = role || user.role;
        user.genres = genres || user.genres;
        user.clerkId = clerkId || user.clerkId;
        user.photo = photo || user.photo; // Update photo field
        user.description = description || user.description;

        await user.save();

        return NextResponse.json({ user_info: user });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to update profile" },
            { status: 500 }
        );
    }
};

export const GET = async (req: Request) => {
    return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
    );
};