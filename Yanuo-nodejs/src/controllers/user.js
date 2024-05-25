const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sharp = require('sharp');
const {bucketName, s3} = require('../helper/imageUpload');
const MyError = require('../exception/MyError');

exports.createUser = async (req, res) => {
    const {userName, password, phoneNumber, email} = req.body;
    const isNewUser = await User.isThisPhoneInUse(phoneNumber);
    if (!isNewUser)
    {
        return res.json({
            success: false,
            message: 'This phoneNumber is already in use, try sign-in',
        });
    }
    const user = await User({
        userName, 
        password, 
        phoneNumber,
        email,
    });
    await user.save();
    // res.json(user);
    res.json({user, success: true});
};

exports.userSignIn = async (req, res) => {
    const {phoneNumber, password} = req.body;
    const user = await User.findOne({phoneNumber});

    if (!user) return res.json({success: false, message: 'user not found, with the given email!'});

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.json({success: false, message: 'email / password does not match!'});

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, 
        {expiresIn: '1d'});
    
    const userInfo = {
        _id: user._id,
        userName: user.userName,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar ? user.avatar: '',
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        coverImage: user.coverImage,
        isAdmin: user.isAdmin,
    }
    
    res.json({success: true, user: userInfo, token});
};

exports.uploadProfile = async (req, res) => {
    const {user} = req;
    console.log('us', user);
    if (!user)
    {
        // return res
        //     .status(401)
        //     .json({success: false, message: 'unauthorized access2!'});
        throw new MyError('unauthorized access11');
    }
    //upload lên s3
    
    try
    {
        console.log('load1', req.file);
        console.log('load2', req.file.buffer);
        const fileBuffer = req.file.buffer;
        console.log(bucketName)
        const params = {
            Bucket: bucketName,
            Key: `${user._id}_profile`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        }   
        const result = await s3.upload(params).promise();
        
        await User.findByIdAndUpdate(user._id, {avatar: result.Location});
        res.status(201).json({success: true, message: 'Your profile has updated!'});
    }
    catch (error)
    {
        res.status(500).json({success: false, message: 'server error, try after some time'});
        console.log("Error while uploading profile image", error.message);
    }
};

exports.updateDateAndBirth = async(req, res) => {
    const {user} = req;
    if (!user)
    {
        throw new MyError('unauthorized access');
    }
    try
    {
        await User.findByIdAndUpdate(user._id, {gender: req.body.gender, dateOfBirth: req.body.dateOfBirth, isActived: true});
        res.status(201).json({success: true, message: 'Your gender and dateOfBirth has updated!'});
    }
    catch (error)
    {
        res.status(500).json({success: false, message: 'server error, try after some time'});
        console.log("Error while uploading profile image", error.message);
    }
};

// find phonenumber
exports.findUserByPhoneNumber = async (req, res) => {
    try
    {
        const {phoneNumber} = req.params;
        const user = await User.findByPhoneNumber(phoneNumber);
        if (!user)
        {
            return res.json({success: false, message: 'user not found, with the given email!'});
            // return res.status(404).json({success: false, message: 'User not found'});
        }
        const userInfo = {
            _id: user._id,
            userName: user.userName,
            phoneNumber: user.phoneNumber,
            avatar: user.avatar,
            coverImage: user.coverImage,
            isAdmin: user.isAdmin
        }
        return res.status(200).json({success: true, user: userInfo});
    }
    catch (error)
    {
        console.log('Error in findUserByPhoneNumber:', error.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.findUserInfoById = async (req, res) => {
    try
    {
        const { userId } = req.params;
        const user = await User.checkById(userId);
        if (!user)
        {
            return res.json({success: false, message: 'user not found'});
        }
        const userInfo = {
            _id: user._id,
            userName: user.userName,
            phoneNumber: user.phoneNumber,
            avatar: user.avatar,
            coverImage: user.coverImage,
            isAdmin: user.isAdmin
        }
        return res.status(200).json({success: true, user: userInfo});
    }
    catch (error)
    {
        console.log('Error in findUserByPhoneNumber:', error.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};