const express = require('express');
const {getBannedUsers,unbanUser,getBannedUser,banOrUpdateUser} = require('../controllers/banning');

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
 *   description: Ban, update ban or unban users (admin only)
 *
 * components:
 *   schemas:
 *     Banned:
 *       type: object
 *       required:
 *         - user
 *         - reason
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *           description: ID of the banned user
 *         reason:
 *           type: string
 *         unbanDate:
 *           type: string
 *           format: date
 *           description: dd-mm-yyyy at 00:00 when ban expires
 */

/**
 * @swagger
 * /api/v1/banned:
 *   get:
 *     summary: List all banned users
 *     tags: [Banning]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of banned records
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
 * /api/v1/banned/{id}:
 *   get:
 *     summary: Get details of a banned record
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
 *         description: Banned record found
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
 *
 *   put:
 *     summary: Create or update a ban for a user
 *     tags: [Banning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID to ban
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *               unbanDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Ban created or updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banned'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 *   delete:
 *     summary: Unban a user (remove ban)
 *     tags: [Banning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Banned record or User ID
 *     responses:
 *       200:
 *         description: Unbanned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
