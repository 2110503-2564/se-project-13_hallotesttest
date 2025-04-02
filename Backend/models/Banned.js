const mongoose = require('mongoose');

const BannedSchema=new mongoose.Schema({
   
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required:true
    }
});

module.exports = mongoose.model('Banned',BannedSchema);