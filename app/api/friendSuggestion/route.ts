import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";

const getFriendSuggestions = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await connectToDB();
        const clerk_user = await currentUser();

        if (!clerk_user) {
            return NextResponse.json({ message: "Not signed in" }, { status: 401 });
        }

        const { my_id } = req.body;

        if (!my_id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findOne({ clerkId: clerk_user.id });
        const friendlist = db.collection('FriendsList');
        const users = db.collection('Users');

        const friends = await friendlist.aggregate([
            {
                $match: {
                    $or: [
                        { friend_one: new ObjectId(my_id) },
                        { friend_two: new ObjectId(my_id) },
                    ],
                },
            },
            {
                $project: {
                    _id: 0,
                    friendId: {
                        $cond: [
                            { $eq: ["$friend_one", new ObjectId(my_id)] },
                            "$friend_two",
                            "$friend_one",
                        ],
                    },
                },
            },
        ]).toArray();

        const friendIds = friends.map(friend => friend.friendId);

        const suggestions = await users.find({
            _id: { $nin: [new ObjectId(my_id), ...friendIds] },
        }).project({ name: 1, area: 1, district: 1 }).toArray();

        res.status(200).json(suggestions);
    } catch (error) {
        console.error(error); // This will log the error details in the terminal
        res.status(500).json({ message: "Server Error" });
    }
};

export default getFriendSuggestions;
