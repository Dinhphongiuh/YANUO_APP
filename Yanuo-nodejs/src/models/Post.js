const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        content: {
            type: String,
        },
        userId: {
            type: String,
            require: true,
        },
        mediaUrl: [{
            url: {
                type: String,
                require: false,
            }
        }],
        tagUser: {
            type: Array
        },
        objectType: {
            type: String,
            require: true,
            enum: ['public', 'friend', 'private']
        }
    },
    {
        timestamps: true,
    }
);

// 

module.exports = mongoose.model("Post", PostSchema);