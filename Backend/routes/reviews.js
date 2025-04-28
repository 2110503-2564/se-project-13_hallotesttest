const express = require('express');

const {
    getReviews,
    addReview,
    updateReview,
    deleteReview,
} = require('../controllers/reviews');

const router = express.Router({ mergeParams: true });

const { checkBanned } = require("../middleware/banning");
const { protect, authorize } = require("../middleware/auth");

router
    .route("/")
    .get(getReviews)
    .post(protect,checkBanned,authorize("admin","user"),addReview)

router
    .route("/:id")
    .put(protect,checkBanned,authorize("admin","user"),updateReview)
    .delete(protect,checkBanned,authorize("admin","user"),deleteReview)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Manage reviews for co-working spaces
 *
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - comment
 *         - rating
 *       properties:
 *         _id:
 *           type: string
 *         CoWorkingId:
 *           type: string
 *         UserId:
 *           type: string
 *         comment:
 *           type: string
 *         rating:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/coworkings/{coWorkingId}/reviews:
 *   get:
 *     summary: Get all reviews for a co-working space
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: coWorkingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of reviews
 *
 *   post:
 *     summary: Add a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coWorkingId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *               - rating
 *             properties:
 *               comment:
 *                 type: string
 *               rating:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created review
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
/**
 * @swagger
 * /api/v1/coworkings/{coWorkingId}/reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coWorkingId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *               rating:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated review
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coWorkingId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */