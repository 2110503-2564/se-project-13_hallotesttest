const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    CoWorkingId : {
        type : mongoose.Schema.ObjectId,
        ref : 'CoWorking',
        required : true
    },
    UserId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        requried : true
    },
    rating : {
        type : Number,
        default : 0
    },
    comment : {
        type : String
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('Review',ReviewSchema);