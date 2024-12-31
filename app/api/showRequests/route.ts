import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoDB';
import { currentUser } from '@clerk/nextjs/server';
import Friend from '@/models/Friend';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        await connectToDB();
        console.log('Connected to MongoDB');

        // Get the current user's ID from Clerk
        const user = await currentUser();
        const clerkId = user?.id;

        if (!clerkId) {
            return NextResponse.json(
                { message: 'Unauthorized: User not authenticated' },
                { status: 401 }
            );
        }

        const dbUser = await User.findOne({ clerkId });
        console.log('DB User:', dbUser);

        if (!dbUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const friendRequests = await Friend.find({
            friend_two: dbUser._id,
            is_requested: true,
        }).populate('friend_one', 'name email photo district');
        
        console.log('Friend Requests:', friendRequests);
        return NextResponse.json({ friendRequests });
    } catch (error) {
        console.error('Error fetching friend requests:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
