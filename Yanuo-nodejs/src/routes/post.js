const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createPost, getListPost } = require('../controllers/post');

router.post('/', createPost);
router.get('/getListPost/:userId', getListPost);

module.exports = router;