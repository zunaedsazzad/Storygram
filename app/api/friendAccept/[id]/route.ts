import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoDB';
import { currentUser } from '@clerk/nextjs/server';
import Friend from '@/models/Friend';
import User from '@/models/User';

export async function GET(req: Request, { params }: { params: { id: string } }) {
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
        const { id: userId } = params;
        console.log(userId);
        console.log(dbUser._id);

        const friendRequest = await Friend.findOneAndUpdate(
            {
                friend_one: userId,
                friend_two: dbUser._id,
                is_requested: true,
            },
            { is_requested: false },
            { new: true }
        );

        if (!friendRequest) {
            return NextResponse.json({ message: 'Friend request not found' }, { status: 404 });
        }

        console.log('Friend Request Accepted:', friendRequest);
        return NextResponse.json({ message: 'Friend request accepted' });
    } catch (error) {
        console.error('Error accepting friend request:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
