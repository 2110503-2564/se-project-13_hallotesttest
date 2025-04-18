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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving banned users'
    });
  }
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

// @desc    Ban a user
// @route   PUT /api/v1/banned/:id
// @access  Private/Admin
exports.banUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with id of ${req.params.id}`
      });
    }

    let bannedUser = await Banned.findOne({ user: req.params.id });
    
    if (bannedUser) {
      return res.status(400).json({
        success: false,
        message: `User with ID ${req.params.id} is already banned`
      });
    }
    const { reason, unbanDate} = req.body;
    bannedUser = await Banned.create({ 
      user: req.params.id,
      reason : reason,
      unbanDate : unbanDate 
    });

    res.status(200).json({
      success: true,
      data: bannedUser
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error banning user'
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


// @desc    Update a banned user
// @route   PUT /api/v1/banned/:id
// @access  Private/Admin
exports.updateBannedUser = async (req, res, next) => {
  try {
    const bannedUser = await Banned.findById(req.params.id);

    if (!bannedUser) {
      return res.status(404).json({
        success: false,
        message: `Banned user not found with id of ${req.params.id}`
      });
    }

    const { reason, unbanDate } = req.body;
    bannedUser.reason = reason || bannedUser.reason;
    bannedUser.unbanDate = unbanDate || bannedUser.unbanDate;

    await bannedUser.save();

    res.status(200).json({
      success: true,
      data: bannedUser
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating banned user'
    });
  }
};