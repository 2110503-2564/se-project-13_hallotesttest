const express = require("express");

const {
  deleteStat,
  getStats,
  getStat,
} = require("../controllers/coworkingstats");

const CoWorkingStats = require("../models/CoWorkingStats");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/auth");

router.route("/").get(protect, getStats);

router
  .route("/:id")
  .get(protect, getStat)
  .delete(protect, authorize("admin"), deleteStat);

module.exports = router;
