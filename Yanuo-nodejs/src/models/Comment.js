const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
    {
        postId: {
            type: String,
            require: true,
        },
        userId: {
            type: String,
            require: true,
        },
        replyTo: {
            type: String,
            require: false,
        },
        content: {
            type: String,
        },
        mediaUrl: [{
            url: {
                type: String,
                require: false,
            }
        }],
        tagUser: {
            type: Array,
            require: false,
        }
    }
);

module.exports = mongoose.model("Comment", CommentSchema);