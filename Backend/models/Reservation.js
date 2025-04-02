const mongoose = require('mongoose');

const ReservationSchema=new mongoose.Schema({
    reservDate : {
        type : Date,
        required : true
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required:true
    },
    coWorking: {
        type : mongoose.Schema.ObjectId,
        ref: 'CoWorking',
        required:true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }

});

module.exports=mongoose.model('Reservation',ReservationSchema);