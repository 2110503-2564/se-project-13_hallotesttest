const express = require('express');

const {getAllUsers} = require('../controllers/user');

const {protect, authorize} = require('../middleware/auth');

const router = express.Router({ mergeParams: true });
const {checkBanned} = require('../middleware/banning');

router.route('/')
    .get(protect,checkBanned, getAllUsers)

    
module.exports = router;