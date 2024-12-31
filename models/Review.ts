import mongoose, { Schema, Document, Model } from 'mongoose';

interface IBookReview extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    book_name: string;
    text: string;
    react_count: number;
}

const bookReviewSchema: Schema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    book_name: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    react_count: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true
});

const BookReview: Model<IBookReview> = mongoose.models.BookReview || mongoose.model<IBookReview>('BookReview', bookReviewSchema);
export default BookReview;
