const Review = require("../models/Review");
const CoWorkingStats = require("../models/CoWorkingStats");

//if no avg rn
const createAverageRating = async (coWorkingId) => {
  const result = await Review.aggregate([
    { $match: { CoWorkingId: coWorkingId } },
    {
      $group: {
        _id: "$CoWorkingId",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const { averageRating = 0, reviewCount = 0 } = result[0] || {};

  await CoWorkingStats.findOneAndUpdate(
    { CoWorkingId: coWorkingId },
    { averageRating, reviewCount },
    { upsert: true, new: true }
  );

  return { averageRating, reviewCount };
};

//if user call delete review
const updateDeletedAverageRating = async (coWorkingId, reviewId, oldRating) => {
  const stats = await CoWorkingStats.findOne({ CoWorkingId: coWorkingId });

  if (!stats || stats.reviewCount === 0) {
    return { averageRating: 0, reviewCount: 0 };
  }

  const newReviewCount = stats.reviewCount - 1;

  let newAverage = 0;

  if (newReviewCount > 0) {
    newAverage =
      (stats.averageRating * stats.reviewCount - OldRating) / newReviewCount;
  }

  await CoWorkingStats.findOneAndUpdate(
    { CoWorkingId: coWorkingId },
    { averageRating: newAverage, reviewCount: newReviewCount },
    { new: true }
  );

  return { averageRating: newAverage, reviewCount: newReviewCount };
};

//if user call add review
const updateAddedAverageRating = async (coWorkingId, reviewId) => {
  const stats = await CoWorkingStats.findOne({ CoWorkingId: coWorkingId });

  if (!stats || stats.reviewCount === 0) {
    return { averageRating: 0, reviewCount: 0 };
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  const newReviewCount = stats.reviewCount + 1;

  let newAverage = 0;

  if (newReviewCount > 0) {
    newAverage =
      (stats.averageRating * stats.reviewCount + review.rating) /
      newReviewCount;
  }

  await CoWorkingStats.findOneAndUpdate(
    { CoWorkingId: coWorkingId },
    { averageRating: newAverage, reviewCount: newReviewCount },
    { new: true }
  );

  return { averageRating: newAverage, reviewCount: newReviewCount };
};

//if user call update review
const updateEditedAverageRating = async (coWorkingId, reviewId, oldRating) => {
  const stats = await CoWorkingStats.findOne({ CoWorkingId: coWorkingId });

  if (!stats || stats.reviewCount === 0) {
    return { averageRating: 0, reviewCount: 0 };
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  let newAverage = 0;

  newAverage =
    (stats.averageRating * stats.reviewCount + (review.rating - oldRating)) /
    stats.reviewCount;

  await CoWorkingStats.findOneAndUpdate(
    { CoWorkingId: coWorkingId },
    { averageRating: newAverage, reviewCount: newReviewCount },
    { new: true }
  );

  return { averageRating: newAverage, reviewCount: newReviewCount };
};

module.exports = {
  createAverageRating,
  updateDeletedAverageRating,
  updateAddedAverageRating,
  updateEditedAverageRating,
};
