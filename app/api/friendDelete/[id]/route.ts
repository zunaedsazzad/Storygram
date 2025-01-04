import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoDB';
import { currentUser } from '@clerk/nextjs/server';
import Friend from '@/models/Friend';
import User from '@/models/User';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
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

        if (!dbUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        const { id: friendId } = await params;

        const friendRequest = await Friend.findByIdAndDelete(friendId);
        console.log('Friend Request Updated:', friendRequest);

        if (!friendRequest) {
            return NextResponse.json({ message: 'Friend request not found' }, { status: 404 });
        }

       
        return NextResponse.json({ message: 'Unfriend successfully' });
    } catch (error) {
        console.error('Error updating friend request:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}