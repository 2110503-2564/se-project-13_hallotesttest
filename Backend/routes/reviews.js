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
 *           description: Auto-generated review ID
 *         CoWorkingId:
 *           type: string
 *           description: ID of the co-working space reviewed
 *         UserId:
 *           type: string
 *           description: ID of the user who wrote the review
 *         comment:
 *           type: string
 *           description: Review content
 *         rating:
 *           type: integer
 *           description: Rating score (0-5)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the review was created
 */

/**
 * @swagger
 * /coworkings/{coWorkingId}/reviews:
 *   get:
 *     summary: Get all reviews for a Co-Working space
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: coWorkingId
 *         schema:
 *           type: string
 *         required: true
 *         description: Co-working space ID
 *     responses:
 *       200:
 *         description: Array of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *
 *   post:
 *     summary: Add a review to a Co-Working space
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coWorkingId
 *         schema:
 *           type: string
 *         required: true
 *         description: Co-working space ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - rating
 *             properties:
 *               comment:
 *                 type: string
 *               rating:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Review created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
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
 *         description: Review updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Review not found
 *
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   description: Empty object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Review not found
 */