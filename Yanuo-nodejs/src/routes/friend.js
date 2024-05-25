const express = require('express');
const router = express.Router();
const { acceptFriend, getListFriends } = require('../controllers/friend');
const { isAuth } = require('../middleware/auth');

router.post('/accept-friend', acceptFriend);//chấp nhận kb
router.get('/friends',isAuth ,getListFriends);//list bạn bè

module.exports = router;
