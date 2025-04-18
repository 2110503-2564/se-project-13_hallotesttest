const express = require('express');
const {getBannedUsers,banUser,unbanUser, getBannedUserbyID} = require('../controllers/banning');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All banned routes require admin authorization
router
  .route('/')
  .get(protect, authorize('admin'), getBannedUsers);

router
  .route('/:id')
  .put(protect, authorize('admin'), banUser)
  .delete(protect, authorize('admin'), unbanUser)
  .get(protect, authorize('admin'), getBannedUserbyID);

module.exports = router;