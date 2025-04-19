const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    CoWorkingId : {
        type : mongoose.Schema.ObjectId,
        ref : 'CoWorking',
        required : true
    },
    rating : {
        type : Number,
        default : 0
    },
    comment : {
        type : String
    }
});

module.exports = mongoose.model('Review',ReviewSchema);