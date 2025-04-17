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
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:coWorkingId/reservations', reservationRouter);

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
 *         id:
 *           type: string
 *           description: The auto-generated id of the Co-Working space
 *         name:
 *           type: string
 *           description: The name of the Co-Working space
 *         address:
 *           type: string
 *           description: The address of the Co-Working space
 *         district:
 *           type: string
 *           description: The district where the space is located
 *         province:
 *           type: string
 *           description: The province where the space is located
 *         postalcode:
 *           type: string
 *           description: The postal code
 *         tel:
 *           type: string
 *           description: Telephone number
 *         time:
 *           type: string
 *           description: Open-close time
 *       example:
 *         id: 60f7c9d5b54764421b7156c1
 *         name: "Tech Hub Coworking"
 *         address: "123 Tech Street"
 *         district: "Central"
 *         province: "CA"
 *         postalcode: "12345"
 *         tel: "123-456-7890"
 *         time: "09:00-18:00"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: CoWorkings
 *   description: Co-Working space management
 */

/**
 * @swagger
 * /coworkings:
 *   get:
 *     summary: Get all Co-Working spaces
 *     tags: [CoWorkings]
 *     responses:
 *       200:
 *         description: List of Co-Working spaces
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CoWorking'
 *
 *   post:
 *     summary: Create a new Co-Working space
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
 *         description: The Co-Working space was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoWorking'
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /coworkings/{id}:
 *   get:
 *     summary: Get a Co-Working space by id
 *     tags: [CoWorkings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Co-Working space id
 *     responses:
 *       200:
 *         description: Co-Working space information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoWorking'
 *       404:
 *         description: Co-Working space not found
 *
 *   put:
 *     summary: Update a Co-Working space
 *     tags: [CoWorkings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Co-Working space id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CoWorking'
 *     responses:
 *       200:
 *         description: The Co-Working space was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoWorking'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Co-Working space not found
 *
 *   delete:
 *     summary: Delete a Co-Working space
 *     tags: [CoWorkings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Co-Working space id
 *     responses:
 *       200:
 *         description: The Co-Working space was deleted successfully
 *       404:
 *         description: Co-Working space not found
 */