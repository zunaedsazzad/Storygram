const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
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

const Friend = mongoose.models.Friend || mongoose.model('Friend', friendSchema);
export default Friend;