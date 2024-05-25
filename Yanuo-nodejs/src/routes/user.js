const express = require('express');
const {check} = require('express-validator');
const multer = require('multer');
// const sharp = require('sharp');
const path = require('path');

const router = express.Router();
const {createUser, userSignIn, uploadProfile, updateDateOfBirth, updateGender, updateDateAndBirth, findUserByPhoneNumber, findUserInfoById} = require('../controllers/user');
const { validateUserSignUp, userVlidation, validateUserSignIn } = require('../validation/user');
const { isAuth } = require('../middleware/auth');
const User = require('../models/User');

const storage = multer.memoryStorage();
// const storage = multer.memoryStorage({
//     destination(req, file, callback)
//     {
//         callback(null, "");
//     }
// });


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

const uploads = multer({storage, fileFilter})

// const upload = multer({
//     storage,
//     limits: {fileSize: 2000000},
//     fileFilter(req, file, cb)
//     {
//         checkFileType(file, cb);
//     }
// });

function checkFileType(file, cb)
{
    const fileTypes = /jpeg|jpg|png|gif|heic/;

    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extName && mimetype)
    {
        return cb(null, true);
    }
    return cb("Error: please upload image /jpeg|jpg|png|gif/ only!");
}


router.post('/create-user', validateUserSignUp, userVlidation ,createUser);
router.post('/sign-in',validateUserSignIn, userSignIn);
// router.post('/create-post', isAuth, (req, res) => {
//     res.send('welcome you are in secret route');
// })
router.post('/upload-profile', isAuth, uploads.single('profile'), uploadProfile);
router.post('/updateGenderOfBirth', isAuth, updateDateAndBirth);
// 
router.post('/sign-token', isAuth, (req, res) => {
    // Nếu xác thực thành công, req.user sẽ chứa thông tin người dùng
    res.json({ success: true, message: 'You have accessed a protected route!', user: req.user });
});
router.get('/search/:phoneNumber', findUserByPhoneNumber);
router.get('/user/:userId', findUserInfoById);

module.exports = router;