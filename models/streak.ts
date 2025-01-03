import mongoose, { Schema, Document, Model } from 'mongoose';

interface IStreak extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    page_count: number;
    timestamp: Date;
}

const streakSchema: Schema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    page_count: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
});

const Streak: Model<IStreak> = mongoose.models.Streak || mongoose.model<IStreak>('Streak', streakSchema);
export default Streak;