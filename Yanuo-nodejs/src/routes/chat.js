const express = require('express');
const router = express.Router();
const { createChat, userChats, findChat, getListByUserId, getConversition, createGroupChat, addMemberToGroup, removeMemberFromGroup } = require('../controllers/chat');
const { isAuth } = require('../middleware/auth');

router.post("/", createChat);
router.get("/:userId", userChats);
router.get("/find/:firstId/:secondId", findChat);
router.get("/getUser/:userId", getListByUserId); //lấy user
router.get("/genConversition/:userId", getConversition);

// Group
// create group
router.post('/group', createGroupChat);
router.post('/group/addMembers', isAuth, addMemberToGroup);
router.post('/group/removeMember', isAuth, removeMemberFromGroup);

module.exports = router;