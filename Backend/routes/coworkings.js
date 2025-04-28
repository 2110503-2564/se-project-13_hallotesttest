const express = require('express');
const {
    getCoWorkings,
    getCoWorking,
    createCoWorking,
    updateCoWorking,
    deleteCoWorking
} = require('../controllers/coworkings');

// Include other resource routers
const reservationRouter = require('./reservations');
const reviewRouter = require('./reviews');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:coWorkingId/reservations', reservationRouter);
router.use('/:coWorkingId/reviews',reviewRouter);
router.route('/')
    .get(getCoWorkings)
    .post(protect, authorize('admin'), createCoWorking);
router.route('/:id')
    .get(getCoWorking)
    .put(protect, authorize('admin'), updateCoWorking)
    .delete(protect, authorize('admin'), deleteCoWorking);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: CoWorkings
 *   description: Manage co-working spaces
 *
 * components:
 *   schemas:
 *     CoWorking:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - district
 *         - province
 *         - postalcode
 *         - time
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         district:
 *           type: string
 *         province:
 *           type: string
 *         postalcode:
 *           type: string
 *         tel:
 *           type: string
 *         picture:
 *           type: string
 *         time:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/coworkings:
 *   get:
 *     summary: Get all co-working spaces
 *     tags: [CoWorkings]
 *     parameters:
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         description: Fields to select (comma separated)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort order (comma separated)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Pagination limit
 *     responses:
 *       200:
 *         description: List of co-working spaces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CoWorking'
 *
 *   post:
 *     summary: Create a new co-working space
 *     tags: [CoWorkings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CoWorking'
 *     responses:
 *       201:
 *         description: Created co-working space
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/v1/coworkings/{id}:
 *   get:
 *     summary: Get a co-working space by ID
 *     tags: [CoWorkings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: CoWorking ID
 *     responses:
 *       200:
 *         description: Co-working space data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoWorking'
 *       404:
 *         description: Not found
 *
 *   put:
 *     summary: Update a co-working space
 *     tags: [CoWorkings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: CoWorking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CoWorking'
 *     responses:
 *       200:
 *         description: Updated co-working space
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 *
 *   delete:
 *     summary: Delete a co-working space
 *     tags: [CoWorkings]
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
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */