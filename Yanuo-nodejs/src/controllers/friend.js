const Friend = require('../models/Friend');
const MyError = require('../exception/MyError');
const friendService = require('../services/friend');
const FriendRequest = require('../models/FriendRequest');

exports.acceptFriend = async(req, res, next) => {
    try {
        const { _id, senderId } = req.body; // Lấy _id và senderId từ request body

        // Kiểm tra xem có lời mời kết bạn từ senderId không
        await FriendRequest.checkByIds(senderId, _id);

        // Kiểm tra xem đã là bạn bè chưa
        const alreadyFriends = await Friend.existsByIds(_id, senderId);
        if (alreadyFriends) {
            // throw new MyError('Friend exists');
            return res.status(409).json({success: false, message: 'is Friend'});
        }

        // Xóa lời mời kết bạn
        await FriendRequest.deleteOne({ senderId, receiverId: _id });

        // Thêm vào danh sách bạn bè
        const friend = new Friend({ userIds: [_id, senderId] });
        await friend.save();

        // Tạo cuộc trò chuyện cá nhân (nếu cần)
        // const conversation = await conversationService.createIndividualConversationWhenWasFriend(_id, senderId);

        // Trả về response thành công
        res.status(200).json({
            success: true,
            message: 'Friend request accepted',
            // conversation: conversation // Nếu bạn muốn trả về thông tin cuộc trò chuyện
        });
    } catch (error) {
        next(error); // Chuyển lỗi cho middleware xử lý lỗi
    }
}

exports.getListFriends = async(req, res, next) => {
    try {
        const { name } = req.query; // Lấy tên từ query params
        const { _id } = req.user; // Giả sử _id của người dùng được lấy từ session hoặc token

        // Gọi service để lấy danh sách bạn bè
        const friendsList = await friendService.getList(name, _id);

        // Trả về danh sách bạn bè
        res.status(200).json({
            success: true,
            data: friendsList
        });
    } catch (error) {
        next(error); // Chuyển lỗi cho middleware xử lý lỗi
    }
}