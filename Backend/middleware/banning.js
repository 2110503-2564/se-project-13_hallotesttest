const Banned = require('../models/Banned');

// Middleware to check if a user is banned
exports.checkBanned = async (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    const banned = await Banned.findOne({ user: req.user.id });

    if (banned) {
      return res.status(403).json({
        success: false,
        message: 'You are banned.'
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error checking ban status'
    });
  }
};
