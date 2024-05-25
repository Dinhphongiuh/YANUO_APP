const MyError = require('../exception/MyError');
const User = require('../models/User');

class MeService {
    async getProfile(_id)
    {
        const user = await User.getById(_id);

        return user;
    }
}
    // async updateProfile(_id, profile)
    // {
    //     if (!profile)  
    //         throw new MyError('Profile ivalid');
    //     const profileWasvalidate = userVa
    // }

module.exports = new MeService();