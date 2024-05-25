const NotFoundError = require("../exception/NotFoundError");
const User = require("../models/User");

const FRIEND_STATUS = ['FRIEND', 'FOLLOWER', 'YOU_FOLLOW', 'NOT_FRIEND'];

async function getUserSummaryInfo(phoneNumber){
    const user = await User.findOne(
        {phoneNumber},
        '-_id userName avatar isAdmin'
    );

    if (!user)
        throw new NotFoundError('User not found whith provided phone Number.');
    return user;
};

// lấy trạng thái bạn bè
async function getStatusFriendOfUserByPhone(_id, phoneNumber)
{
    await User.checkById(_id);
    const searchUserResult = await User.findByPhoneNumber(phoneNumber);
    // const searchUserId = searchUserResult._id;

    return searchUserResult;
}

module.exports = {
    getUserSummaryInfo,

};