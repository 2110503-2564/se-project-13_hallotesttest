const express = require('express');

const {getAllUsers} = require('../controllers/user');

const {protect, authorize} = require('../middleware/auth');

const router = express.Router({ mergeParams: true });


router.route('/')
    .get(protect,checkBanned, getAllUsers)

