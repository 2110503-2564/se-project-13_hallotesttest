const Review = require('../models/Review');

exports.getReviews = async (req,res,next) => {
    let query;
    if(req.params.coWorkingId) {
        query = Review.find({CoWorkingId : req.params.coWorkingId});
    }
    else query = Review.find({});
    try {
        const reviews = await query;
        return res.status(200).json({
            success : true,
            count : reviews.length,
            data : reviews
        });
    }
    catch (error) {
        res.status(400).json({
            success : false,
            msg : err
        });
    }
}

exports.addReview = async (req,res,next) => {
    try {
        if(!req.params.coWorkingId) {
            return res.status(404).json({
                success : false,
                message : 'Please provide the Co-Working Id'
            })
        }
        req.body.CoWorkingId = req.params.coWorkingId
        if(!req.user.id) {
            return res.status(404).json({
                success : false,
                message : 'Invalid User Id'
            })
        }
        req.body.UserId = req.user.id;
        const existed = await Review.find({CoWorkingId : req.params.coWorkingId,UserId : req.user.id});
        if(existed.length >= 1) {
            return res.status(400).json({
                success : false,
                message : 'You can only create 1 rating review per 1 Co-Working Space'
            })
        }
        const review = await Review.create(req.body);
        
        res.status(201).json({
            success : true,
            data : review
        });
    } catch (error) {
        res.status(400).json({
            success : false,
            message : 'Cannot create Review'
        })
    }
}

exports.updateReview = async (req,res,next) => {
    try {
        let review = await Review.findById(req.params.id);
        if(!review) {
            return res.status(404).json({
                success : false,
                message : `No review with the id of ${req.params.id}`
            })
        }

        if (review.UserId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this review`
            });
        }

        review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success : true,
            data : review
        });
    } catch (error) {
        res.status(400).json({
            success : false,
            message : "Cannot Update Review"
        })
    }
}

exports.deleteReview = async (req,res,next) => {
    try {
        let review = await Review.findById(req.params.id);
        if(!review) {
            return res.status(404).json({
                success : false,
                message : `No review with the id of ${req.params.id}`
            })
        }

        if (review.UserId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this review`
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success : false,
            message : 'Cannot Delete Review'
        })
    }
}