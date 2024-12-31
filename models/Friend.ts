import mongoose, { Schema, Document, Model } from 'mongoose';

interface IFriend extends Document {
    friend_one: mongoose.Schema.Types.ObjectId;
    friend_two: mongoose.Schema.Types.ObjectId;
    who_requested: mongoose.Schema.Types.ObjectId;
    is_requested: boolean;
}

const friendSchema: Schema = new Schema({
    friend_one: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    friend_two: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    who_requested: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    is_requested: {
        type: Boolean,
        required: true,
    }
}, {
    timestamps: true
});

const Friend: Model<IFriend> = mongoose.models.Friend || mongoose.model<IFriend>('Friend', friendSchema);
export default Friend;