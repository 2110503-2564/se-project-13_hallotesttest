const express = require('express');
const {getBannedUsers,banUser,unbanUser, getBannedUser, updateBannedUser, banOrUpdateUser} = require('../controllers/banning');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All banned routes require admin authorization
router
  .route('/')
  .get(protect, authorize('admin'), getBannedUsers);

router
  .route('/:id')
  .put(protect, authorize('admin'), banOrUpdateUser)
  .delete(protect, authorize('admin'), unbanUser)
  .get(protect, authorize('admin'), getBannedUser);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Banning
 *   description: Ban and unban users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Banned:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Banned record ID
 *         user:
 *           type: string
 *           description: The ID of the banned user
 *         reason:
 *           type: string
 *           description: Reason for the ban
 *         unbanDate:
 *           type: string
 *           format: date
 *           description: Date (at 00:00) when the user will be unbanned
 *       required:
 *         - user
 *         - reason
 */

/**
 * @swagger
 * /banned:
 *   get:
 *     summary: Get all banned users
 *     tags: [Banning]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of banned users
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
 *                     $ref: '#/components/schemas/Banned'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /banned/{id}:
 *   get:
 *     summary: Get a banned user by ID
 *     tags: [Banning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Banned record ID
 *     responses:
 *       200:
 *         description: Banned user retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Banned'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *   put:
 *     summary: Ban or update ban details for a user
 *     tags: [Banning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *               unbanDate:
 *                 type: string
 *                 format: date
 *                 description: dd-mm-yyyy format at 00:00
 *             required:
 *               - reason
 *     responses:
 *       200:
 *         description: User banned or ban updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Banned'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   delete:
 *     summary: Unban a user
 *     tags: [Banning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User unbanned successfully
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
 *         description: Not found
 */
