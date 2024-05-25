const Friend = require("../models/Friend");
const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


exports.acceptFriend = async(_id, senderId) =>
{
    // check có lời mời này không
    await FriendRequest.checkByIds(senderId, _id);

    // check đã là bạn bè
    if (await Friend.existsByIds(_id, senderId))
        throw new MyError('Friend exists');

    // xóa đi lời mời
    await FriendRequest.deleteOne({ senderId, receiverId: _id });

    // thêm bạn bè
    const friend = new Friend({ userIds: [_id, senderId] });
    await friend.save();

    // return await conversationService.createIndividualConversationWhenWasFriend(
    //     _id,
    //     senderId
    // );
};

exports.getList = async(name, _id) => {
    await User.getById(_id);

        const friends = await Friend.aggregate([
            { $project: { _id: 0, userIds: 1 } },
            {
                $match: {
                    userIds: { $in: [new ObjectId(_id)] },
                },
            },
            { $unwind: '$userIds' },
            {
                $match: {
                    userIds: { $ne: new ObjectId(_id) },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userIds',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            { $replaceWith: '$user' },
            
            {
                $project: {
                    _id: 1,
                    userName: 1,
                    avatar: 1,
                    phoneNumber: 1,
                    coverImage: 1,
                    isAdmin: 1,
                },
            },
    ]);

    return friends;
}