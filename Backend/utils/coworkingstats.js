
const Review = require('../models/Review');
const CoWorkingStats = require('../models/CoWorkingStats');

const createAverageRating = async (coWorkingId) => {
    const result = await Review.aggregate([
        { $match: { CoWorkingId: coWorkingId } },
        {
            $group: {
                _id: '$CoWorkingId',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 }
            }
        }
    ]);

    const { averageRating = 0, reviewCount = 0 } = result[0] || {};

    await CoWorkingStats.findOneAndUpdate(
        { CoWorkingId: coWorkingId },
        { averageRating, reviewCount },
        { upsert: true, new: true }
    );

    return { averageRating, reviewCount };
};

module.exports = { createAverageRating };
