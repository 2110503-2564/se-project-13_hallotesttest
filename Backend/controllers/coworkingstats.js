
const CoWorkingStats = require('../models/CoWorkingStats');

exports.getStats = async (req,res,next) => {
    let query = CoWorkingStats.find().populate('CoWorking');
    try {
        const coworkingstats = await query;
        return res.status(200).json({
            success : true,
            count : coworkingstats.length,
            data : coworkingstats
        });
    }
    catch (error) {
        res.status(400).json({
            success : false,
            msg : error
        });
    }
}

exports.getStat = async (req,res,next) => {
    let query = CoWorkingStats.find({CoWorkingId : req.params.coWorkingId}).populate('CoWorking');
    try {
        const coworkingstats = await query;
        return res.status(200).json({
            success : true,
            data : coworkingstats
        });
    }
    catch (error) {
        res.status(400).json({
            success : false,
            msg : error
        });
    }
}