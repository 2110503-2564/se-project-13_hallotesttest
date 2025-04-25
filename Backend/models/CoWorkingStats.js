const mongoose = require('mongoose');

const CoWorkingStatsSchema = new mongoose.Schema({
    CoWorkingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoWorking',
        required: true,
        unique: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('CoWorkingStats', CoWorkingStatsSchema);