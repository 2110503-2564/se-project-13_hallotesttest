const Banned = require('../models/Banned')

exports.unban = async (req,res,next) => {
    try {
        const now = new Date();
        const bannedUsers = await Banned.find({});
        for(const banned of bannedUsers) {
            if(banned.unbanDate) {
                if(now >= banned.unbanDate) {
                    await banned.deleteOne();
                }
            }
        }
        res.status(200).json({message : 'Unbanned completed'});
    } catch (error) {
        return res.status(500).json({message : 'Error unbanning users'});
    }
};


