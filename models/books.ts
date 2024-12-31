import mongoose, { Schema, Document, Model } from 'mongoose';

interface IBook extends Document {
    bookname: string;
    bookauthor: string;
    genre: string;
    photo: string;
    users: mongoose.Schema.Types.ObjectId[];
}

const bookSchema: Schema = new Schema({
    photo: {
		type: String,
		
	},
    bookname: {
        type: String,
        required: true,
    },
    bookauthor: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, {
    timestamps: true,
});

const Book: Model<IBook> = mongoose.models.Book || mongoose.model<IBook>('Book', bookSchema);
export default Book;
