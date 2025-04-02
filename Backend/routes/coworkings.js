const express = require('express');
const {
    getCoWorkings,
    getCoWorking,
    createCoWorking,
    updateCoWorking,
    deleteCoWorking
} = require('../controllers/coworkings');

// Include other resource routers
const reservationRouter = require('./reservations');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:coWorkingId/reservations', reservationRouter);

router.route('/')
    .get(getCoWorkings)
    .post(protect, authorize('admin'), createCoWorking);
router.route('/:id')
    .get(getCoWorking)
    .put(protect, authorize('admin'), updateCoWorking)
    .delete(protect, authorize('admin'), deleteCoWorking);

module.exports = router;