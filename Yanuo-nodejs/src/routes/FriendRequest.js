const express = require('express');
const router = express.Router();
const { sendFriendRequest, getFriendRequests, deleteFriendInvite, getListFriendInvitesWasSend,  } = require('../controllers/requestFriend');
// const io = require('../app/socket');

router.post('/send-friend-request', sendFriendRequest);//gửi lời mời kb
router.get('/friend-requests/:userId', getFriendRequests);
router.post('/deleteRequestFriend', deleteFriendInvite);//xóa lời mời kb
router.get('/invite-was-send/:senderId', getListFriendInvitesWasSend)//lời mời kết bạn đã gửi

module.exports = router;