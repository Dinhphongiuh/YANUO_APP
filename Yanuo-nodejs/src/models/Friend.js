const mongoose = require('mongoose');
const NotFoundError = require('../exception/NotFoundError');
const ObjectId = mongoose.Types.ObjectId;

const friendSchema = new mongoose.Schema({
    userIds: [ObjectId],
});

friendSchema.statics.existsByIds = async (userId1, userId2) => {
    const isExists = await Friend.findOne({
        userIds: {$all: [userId1, userId2]},
    });
    if (isExists)
        return true;
    return false;
};

friendSchema.statics.checkByIds = async(userId1, userId2, message = 'Friend') => {
    const isExists = await Friend.findOne({
        userIds: {$all: [userId1, userId2]},
    });
    if (!isExists)
        throw new NotFoundError(message);
};

friendSchema.statics.deleteByIds = async (userId1, userId2, message = 'Friend') => {
    const queryResult = await Friend.deleteOne({
        userIds: {$all: [userId1, userId2]},
    });

    const {deletedCount} = queryResult;
    if (deletedCount === 0)
        throw new NotFoundError(message);
};

const Friend = mongoose.model('Friend', friendSchema);
module.exports = Friend;
