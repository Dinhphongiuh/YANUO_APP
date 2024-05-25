const mongoose = require('mongoose');
const NotFoundError = require('../exception/NotFoundError');
const ObjectId = mongoose.Types.ObjectId;

const friendRequestSchema = new mongoose.Schema(
    {
        senderId: ObjectId,
        receiverId: ObjectId,
    },
    {timestamps: true}
);

friendRequestSchema.statics.existsByIds = async function(senderId, receiverId) {
    const isExists = await this.findOne({
        senderId,
        receiverId,
    });
    if (isExists)
        return true;
    return false;
};

friendRequestSchema.statics.checkByIds = async function(senderId, receiverId, message = 'Invite') {
    const isExists = await this.findOne({
        senderId,
        receiverId,
    });
    if (!isExists)
        // throw new NotFoundError(message);
        return null;
};

friendRequestSchema.statics.deleteByIds = async function(senderId, receiverId, message = 'Invite') {
    const queryResult = await this.deleteOne({senderId, receiverId});
    const { deleteCount } = queryResult;
    if (deleteCount === 0)
        throw new NotFoundError(message); 
    // else
        // return true;
}

module.exports = mongoose.model('friendRequest', friendRequestSchema);