const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

// const io = require('../index');
const server = require('../index');
const {
    Server
} = require('socket.io');
const Friend = require("../models/Friend");
const io = new Server(server);
exports.sendFriendRequest = async (req, res) => {
    const {senderId, receiverId } = req.body;
    io.on("connection", (socket) => {
        console.log('Có người vừa kết nối');
    });

    const check1 = await User.checkById(senderId);
    const check2 = await User.checkById(receiverId);    
    if (!check1 || !check2)
    {
        return res.status(404).json({success: false, message: 'One of the users not found.'});
    }

    // check đã là bạn bè
    if (await Friend.existsByIds(receiverId, senderId))
    {
        return res.status(409).json({success: false, message: 'is Friend.'});
    }

    
    const alreadyExists = await FriendRequest.existsByIds(senderId, receiverId);
    if (alreadyExists)
    {
        // io.sockets.emit("friendRequestNotification", 'Ok');
        return res.status(409).json({success: false, message: 'Friend request already sent.'});
    }

    const newFriendRequest = new FriendRequest({
        senderId, 
        receiverId,
    });

    try
    {
        await newFriendRequest.save();
        res.status(201).json({success: true, message: 'Friend request sent successfully.'});
    }
    catch (error)
    {
        res.status(500).json({success: false, message: 'Error sending friend request.'});
    }
};

exports.getFriendRequests = async (req, res) => {
    const { userId } = req.params;
    try {
        const friendRequests = await FriendRequest.find({ receiverId: userId }).select('senderId createdAt -_id');
        const requestsData = friendRequests.map(request => {
            return { senderId: request.senderId, createdAt: request.createdAt };
        });
        res.status(200).json({ success: true, requestsData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving friend requests.' });
    }
};

// delete lời mời kb
exports.deleteFriendInvite = async(req, res) => {
    const {_id, senderId} = req.body;
    try
    {
        const result = await FriendRequest.deleteByIds(senderId, _id);
    }
    catch (error)
    {
        res.status(500).json({ success: false, message: 'Error delete friend requests.' });
    }
}

//lời mời kết bạn đã gửi -> mảng
exports.getListFriendInvitesWasSend = async (req, res) => {
    const { senderId } = req.params;
    try {
        const sentFriendRequests = await FriendRequest.find({ senderId: senderId }).select('receiverId createdAt -_id');
        const sentRequestsData = sentFriendRequests.map(request => {
            return { receiverId: request.receiverId, createdAt: request.createdAt };
        });
        res.status(200).json({ success: true, sentRequestsData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving sent friend requests.' });
    }
};