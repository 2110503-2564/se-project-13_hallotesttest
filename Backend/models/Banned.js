const mongoose = require('mongoose');

const BannedSchema=new mongoose.Schema({
   
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required:true
    },
    reason : {
        type : String,
        required : [true,'Please provide the reason']
    },
    unbanDate : {
        type : Date
    }
});

module.exports = mongoose.model('Banned',BannedSchema);