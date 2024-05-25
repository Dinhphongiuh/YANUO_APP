const MeService = require('../services/meService');
const redisDb = require('../app/redis');
const meService = require('../services/meService');

class MeController {
    constructor()
    {
        // this.io = io;
        // this.revokeToken = this.revokeToken.bind(this);
    }

    // GET/profile
    async profile(req, res, next) {
        const {_id} = req;

        try
        {
            const  isExtsCached = await redisDb.exists(_id);
            if (!isExtsCached)
                await redisDb.set(_id, await meService.getProfile(_id));
            res.json(await redisDb.get(_id));
        }
        catch (err)
        {
            next(err);
        }
    }

    // [PUT] / Profile
    // async updateProfile(req, res, next)
    // {
    //     const {_id} = req;

    //     try
    //     {
    //         await meService.
    //     }
    // }
}