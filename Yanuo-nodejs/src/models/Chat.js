const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
    {
        members: {
            type: Array
        },
        groupName: {
            type: String,
        },
        groupAvatar: {
            type: String,
            require: true,
            default: 'https://demoyanuo1.s3.ap-southeast-1.amazonaws.com/groupT1.png',
        },
        type: {
            type: String
        },
        isAdmin: {
            type: String,
        },
        pinnedMessages: [{
            messageId: String, // Lưu messageId dưới dạng String
            userId: String, // Lưu userId dưới dạng String
        }], 
    },
    {
        timestamps: true,
    }
    
);

ChatSchema.statics.getListByUserId = async function(userId) {
    return await this.find({
        members: { $in: [userId] },
    }).sort({ updatedAt: -1 });
};


module.exports = mongoose.model("Chat", ChatSchema);
// module.exports = mongoose.model('User', userSchema);
