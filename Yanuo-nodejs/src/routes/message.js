const express = require('express');
const router = express.Router();
const { addMessage, getMessages, sendMessageImage, recallMessage, deleteOneMessage, pinMessage, getPinnedMessagesInfo, getPinnedMessagesDetails, unpinMessage, markAsRead } = require('../controllers/message');
const multer = require('multer');
const path = require('path');

// image
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image'))
    {
        cb(null, true);
    }
    else
    {
        cb('invalid image file!', false);
    }
}
const upload = multer({storage, fileFilter});

const fileFilters = (req, file, cb) => {
    if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only images and videos are allowed!'), false);
    }
};
const uploads = multer({ storage, fileFilters });

router.post('/', addMessage);
// router.get('/:chatId', getMessages);
router.get("/:chatId/:userId", getMessages)
// router.post('/sendImage', upload.single('image'), sendMessageImage);
router.post('/sendImage', uploads.array('mediaUrl', 1000), sendMessageImage);
router.post('/recall', recallMessage);
// xoá đơn message
router.post('/deleteOne', deleteOneMessage);
//pin tin nhắn
router.post('/pin-message', pinMessage);
router.post('/:chatId/pinned-messages', getPinnedMessagesDetails);
router.post('/unPin-message', unpinMessage);
// đánh dấu tin nhắn đã đọc
router.post('/readMessage', markAsRead);
module.exports = router;