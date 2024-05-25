const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
        chatId: {
            type: String
        },
        senderId: {
            type: String,
        },
        text: {
            type: String,
        },
        type: {
            type: String,
        },
        isDelete: {
            type: Boolean
        },
        mediaUrl: [{
            url: {
                type: String,
                require: false
            }
        }],
        deleteByMembers: {
            type: Array
        },
        replyTo: {
            type: String,
            require: false
        },
        isRead: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
    
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Message', MessageSchema)