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
  .get(getStat)
  .delete(protect, authorize("admin"), deleteStat);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: CoWorkingStats
 *   description: Manage co-working space statistics
 *
 * components:
 *   schemas:
 *     CoWorkingStat:
 *       type: object
 *       required:
 *         - CoWorkingId
 *       properties:
 *         _id:
 *           type: string
 *         CoWorkingId:
 *           type: string
 *         reviewCount:
 *           type: integer
 *         averageRating:
 *           type: number
 */

/**
 * @swagger
 * /api/v1/stats:
 *   get:
 *     summary: Get all co-working space stats
 *     tags: [CoWorkingStats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CoWorkingStat'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 */

/**
 * @swagger
 * /api/v1/stats/{id}:
 *   get:
 *     summary: Get a stat for a specific co-working space
 *     tags: [CoWorkingStats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: CoWorking ID
 *     responses:
 *       200:
 *         description: Stat retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CoWorkingStat'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 */

/**
 * @swagger
 * /api/v1/stats/{id}:
 *   delete:
 *     summary: Delete a co-working space stat
 *     tags: [CoWorkingStats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stat document ID
 *     responses:
 *       200:
 *         description: Stat deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example: {}
 *       401:
 *         description: Unauthorized (not logged in or not admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       404:
 *         description: Stat not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
