const Reservation = require('../models/Reservation');
const CoWorking = require('../models/CoWorking');

//@desc Get all reservations
//@route GET /api/v1/reservations
//@access Public
exports.getReservations = async (req, res, next) => {
    let query;
    if (req.user.role !== 'admin') {
        query = Reservation.find({ user: req.user.id }).populate({
            path: 'coWorking',
            select: 'name province tel'
        }).populate({
            path: 'user',
            select: 'name email role'  // Add fields you want from user, excluding sensitive data
        });
    } else {
        if (req.params.coWorkingId) {
            console.log(req.params.coWorkingId);
            query = Reservation.find().populate({
                path: 'coWorking',
                select: 'name province tel'
            }).populate({
                path: 'user',
                select: 'name email role'  // Add fields you want from user, excluding sensitive data
            });
        } else {
            query = Reservation.find().populate({
                path: 'coWorking',
                select: 'name province tel'
            }).populate({
                path: 'user',
                select: 'name email role'  // Add fields you want from user, excluding sensitive data
            });
        }
    }
    try {
        const reservations = await query;

        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot find Reservation"
        });
    }
};

exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: 'coWorking',
            select: 'name description tel'
        });
        
        if (!reservation) {
            return res.status(404).json({ success: false, message: `No reservation with the id of ${req.params.id}` });
        }
        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot find Reservation" });
    }
};

exports.addReservation = async (req, res, next) => {
    try {
        req.body.coWorking = req.params.coWorkingId;
        const coWorking = await CoWorking.findById(req.params.coWorkingId);

        if (!coWorking) {
            return res.status(404).json({
                success: false,
                message: `No coWorking with the id of ${req.params.coWorkingId}`
            });
        }

        req.body.user = req.user.id;
        const existedDate = await Reservation.find({reservDate: req.body.reservDate,coWorking: req.params.coWorkingId})
        console.log(existedDate)
        console.log(existedDate.length>=1)
        if(existedDate.length>=1) {
            return res.status(400).json({
                success: false,
                message: 'This place has already been reserved'
            })
        }

        const existedReservations = await Reservation.find({ user: req.user.id });
        console.log(existedReservations);
        if (existedReservations.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} has already made 3 reservations`
            });
        }

        const reservation = await Reservation.create(req.body);

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot create Reservation"
        });
    }
};

exports.updateReservation = async (req, res, next) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: `No reservation with the id of ${req.params.id}`
            });
        }

        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this reservation`
            });
        }

        const existedDate = await Reservation.find({reservDate: req.body.reservDate,coWorking: req.body.coWorking})
        console.log(existedDate)
        console.log(existedDate.length>=1)
        if(existedDate.length>=1) {
            return res.status(400).json({
                success: false,
                message: 'This place has already been reserved'
            })
        }

        reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot update Reservation"
        });
    }
};

exports.deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: `No reservation with the id of ${req.params.id}`
            });
        }
        
        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this reservation`
            });
        }
        await reservation.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot delete Reservation"
        });
    }
};