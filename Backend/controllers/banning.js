const Banned = require('../models/Banned');
const User = require('../models/User');

// @desc    Get all banned users
// @route   GET /api/v1/banned
// @access  Private/Admin
exports.getBannedUsers = async (req, res, next) => {
  try {
    const bannedUsers = await Banned.find().populate({
      path: 'user',
      select: 'name email password role'
    });

    res.status(200).json({
      success: true,
      count: bannedUsers.length,
      data: bannedUsers
    });
  } catch (err) {}
};

// @desc    Get a banned user by ID
// @route   GET /api/v1/banned/:id
// @access  Private/Admin
exports.getBannedUser = async (req, res, next) => {
  try {
    const bannedUser = await Banned.findById(req.params.id).populate({
      path: 'user',
      select: 'name email password role'
    });
    
    if (!bannedUser) {
      return res.status(404).json({
        success: false,
        message: `Banned user not found with id of ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: bannedUser
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving banned user'
    });
  }
};
     
// @desc    Unban a user
// @route   DELETE /api/v1/banned/:id
// @access  Private/Admin
exports.unbanUser = async (req, res, next) => {
  try {
    const bannedUser = await Banned.findOne({ user: req.params.id });

    if (!bannedUser) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${req.params.id} is not banned`
      });
    }

    await bannedUser.deleteOne(); 

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error unbanning user'
    });
  }
};

// @desc    Ban a user or update their ban details
// @route   PUT /api/v1/banned/:id
// @access  Private/Admin
exports.banOrUpdateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with ID ${req.params.id}`
      });
    }

    const { reason, unbanDate } = req.body;

    let bannedUser = await Banned.findOne({ user: req.params.id });

    if (bannedUser) {
      bannedUser.reason = reason || bannedUser.reason;
      bannedUser.unbanDate = unbanDate || bannedUser.unbanDate;
      await bannedUser.save();
    } else {
      bannedUser = await Banned.create({
        user: req.params.id,
        reason,
        unbanDate
      });
    }

    res.status(200).json({
      success: true,
      data: bannedUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error banning or updating ban'
    });
  }
};