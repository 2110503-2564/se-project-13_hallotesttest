const express = require('express');

const { getReservations, getReservation, addReservation, updateReservation, deleteReservation} = require('../controllers/reservations');
const router = express.Router({ mergeParams: true });

const {checkBanned} = require('../middleware/banning');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect,checkBanned, getReservations)
    .post(protect,checkBanned, authorize('admin', 'user'), addReservation);

router.route('/:id')
    .get(protect,checkBanned, getReservation)
    .put(protect,checkBanned, authorize('admin', 'user'), updateReservation)
    .delete(protect,checkBanned, authorize('admin', 'user'), deleteReservation);

module.exports = router;