const CoWorkingStats = require("../models/CoWorkingStats");

exports.getStats = async (req, res, next) => {
  let query = CoWorkingStats.find().populate("CoWorkingId");
  try {
    const coworkingstats = await query;
    return res.status(200).json({
      success: true,
      count: coworkingstats.length,
      data: coworkingstats,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error,
    });
  }
};

exports.getStat = async (req, res, next) => {
  let query = CoWorkingStats.find({
    CoWorkingId: req.params.coWorkingId,
  }).populate("CoWorkingId");
  try {
    const coworkingstats = await query;
    return res.status(200).json({
      success: true,
      data: coworkingstats,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error,
    });
  }
};

exports.deleteStat = async (req, res, next) => {
  try {
    const coworkingstats = await CoWorkingStats.findById(req.params.id);

    if (!coworkingstats) {
      return res.status(404).json({
        success: false,
        message: `No CoWorking with the id of ${req.params.id}`,
      });
    }

    if (req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this CoWorking Status`,
      });
    }
    await coworkingstats.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot delete CoWorking Status",
    });
  }
};
