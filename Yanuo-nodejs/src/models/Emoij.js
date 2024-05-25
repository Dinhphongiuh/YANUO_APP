const mongoose = require('mongoose');

const EmoijSchema = new mongoose.Schema(
    {
        postId: {
            type: String,
        },
        emoijType: {
            type: String,
            require: true,
            enum: ['Post', 'Comment', 'Message']
        },
        commentId: {
            type: String,
        },
        userId: {
            type: String,
            require: true,
        },
        emoij: {
            type: String,
            require: true,
            enum: ['like', 'love', 'care', 'haha', 'wow', 'sad', 'angry']
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Emoij", EmoijSchema);