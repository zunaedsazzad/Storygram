import mongoose, { Schema, Document, Model } from 'mongoose';

interface ILendReq extends Document {
    book_id: mongoose.Schema.Types.ObjectId;
    user_id: mongoose.Schema.Types.ObjectId;
    from_date: Date;
    to_date: Date;
}

const lendReqSchema: Schema = new Schema({
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Book'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    from_date: {
        type: Date,
        required: true,
    },
    to_date: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true
});

const LendReq: Model<ILendReq> = mongoose.models.LendReq || mongoose.model<ILendReq>('LendReq', lendReqSchema);
export default LendReq;