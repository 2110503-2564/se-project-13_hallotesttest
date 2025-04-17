import {Banned} from '../models/Banned'

export default async function handler(req,res) {
    if(req.method !== 'POST') {
        return res.status(405),json({message : 'Method not allowed'});
    }

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
    } catch (error) {
        return res.status(500).json({message : 'Error unbanning users'});
    }
}