const Reservation = require('../models/Reservation.js');
const CoWorking = require('../models/CoWorking.js');
const Review = require('../models/Review');

exports.getCoWorkings = async (req, res, next) => {
    try {
        let query;
        const reqQuery = { ...req.query };

        const removeFields = ['select', 'sort', 'page', 'limit'];

        removeFields.forEach((param) => delete reqQuery[param]);
        console.log(reqQuery);
        let queryStr = JSON.stringify(reqQuery);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        query = CoWorking.find(JSON.parse(queryStr)).populate('reservations');

        // Select fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await CoWorking.countDocuments();

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const coWorkings = await query;

        // Pagination result
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }
        res.status(200).json({
            success: true,
            count: coWorkings.length,
            pagination,
            data: coWorkings
        });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

exports.getCoWorking = async (req, res, next) => {
    try {
        const coWorking = await CoWorking.findById(req.params.id);
        if (!coWorking) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: coWorking });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

exports.createCoWorking = async (req, res, next) => {
    const coWorking = await CoWorking.create(req.body);
    res.status(201).json({
        success: true,
        data: coWorking
    });
};

exports.updateCoWorking = async (req, res, next) => {
    try {
        const coWorking = await CoWorking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!coWorking) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: coWorking });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

exports.deleteCoWorking = async (req, res, next) => {
    try {
        const coWorking = await CoWorking.findById(req.params.id);
        if (!coWorking) {
            return res.status(400).json({ success: false, message: `CoWorking not found with id of ${req.params.id}` });
        }
        await Reservation.deleteMany({ coWorking: req.params.id });
        await CoWorking.deleteOne({ _id: req.params.id });
        await Review.deleteMany({CoWorkingId : req.params.id});
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};