const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const NotFoundError = require('../exception/NotFoundError');
const MyError = require('../exception/MyError');

// const user = {
//     userName: '',
//     phoneNumber: '', 
//     password: '',
    // avatar: '',
    // gender: '',
    // dateOfBirth: '',
// }

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        require: true,
    },
    phoneNumber: {
        type: String,
        require: true,
        // unique: true,
    },
    email: {
        type: String,
        require: true,
    },
    avatar: {
        type: String,
        require: true,
        default: 'https://i.stack.imgur.com/l60Hf.png',
    },
    coverImage: {
        type: String,
        require: true,
        default: function() {
            const images = [
                'https://demoyanuo1.s3.ap-southeast-1.amazonaws.com/coverImageDefault.png',
                'https://demoyanuo1.s3.ap-southeast-1.amazonaws.com/defaultCoverImage2.png'
            ];
            // Chọn ngẫu nhiên một đường link từ mảng
            return images[Math.floor(Math.random() * images.length)];
        }
        // default: 'https://demoyanuo1.s3.ap-southeast-1.amazonaws.com/defaultCoverImage2.png'
    },
    gender: {
        type: String,
        // require: true,
    },
    dateOfBirth: {
        type: String,
        // re
    },
    isAdmin: {
        type: Boolean,
        require: true,
        default: false,
    },
    phoneBooks: {
        type: [{name: String, phoneNumber: String}],
        default: [],
    },
    isActived: {
        type: Boolean,
        default: false,
    },
    isDelete: {
        type: Boolean,
        default: false,
    }
    // textStory: String,
});

userSchema.pre('save', function(next) {
    if (this.isModified('password'));
    {
        bcrypt.hash(this.password, 8, (err, hash) => {
            if (err)
                return next(err);
            this.password = hash;
            next();
        })
    }
});

userSchema.methods.comparePassword = async function (password){
    if (!password) throw new Error('Password is mission, can not compare!');

    try
    {
        const result = await bcrypt.compare(password, this.password);
        return result;
    }
    catch (error)
    {
        console.log('Error while comparing password!', error.message);
    }
}   

userSchema.statics.isThisPhoneInUse = async function(phoneNumber) {
    try
    {
        const user = await this.findOne({phoneNumber: phoneNumber});
        if (user)
            return false;
        return true;
    }
    catch (error)
    {
        console.log('error inside isThisEmail in use method', error.message);
        return false;
    }
}

userSchema.statics.getById = async function(_id, message = 'User') {
    const user = await this.findOne({_id});//isActived: true
    if (!user)
        throw new NotFoundError(message);
    const {
        userName,
        phoneNumber,
        avatar,
    } = user;
    return {
        _id,
        userName,
        phoneNumber,
        avatar,
    };
};

userSchema.statics.findByPhoneNumber = async function(phoneNumber) {
    try
    {
        const user = await this.findOne({phoneNumber: phoneNumber});
        if (!user)
        {
            return null;
        }
        return user;
    }
    catch (error)
    {
        console.log("Error inside findByPhoneNumber method", error.message);
        throw new MyError('Server error during the search by phone number')
    }
};

userSchema.statics.findPhoneNumber = async function(phoneNumber) {
    try
    {
        const user = await this.findOne({phoneNumber: phoneNumber});
        if (!user)
        {
            return null;
        }
        return {
            _id,
            userName,
            dateOfBirth: dateUtils.toObject(dateOfBirth),
            gender,
            avatar,
            coverImage,
        };
    }
    catch (error)
    {
        console.log("Error inside findByPhoneNumber method", error.message);
        throw new MyError('Server error during the search by phone number')
    }
};

userSchema.statics.checkByIds = async(ids, message = 'User') => {
    for (const idEls of ids)
    {
        const user = await this.findOne({
            _id: idEls,
            isDelete: false,
        });

        if (!user)
            throw new NotFoundError(message);
    }
};

userSchema.statics.checkById = async function(_id) {
    const user = await this.findOne({ _id });
    if (!user) {
        throw new NotFoundError('No user found with this _id.');
    }
    return user;
};


module.exports = mongoose.model('User', userSchema);
