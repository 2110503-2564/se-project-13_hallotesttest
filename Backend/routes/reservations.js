const express = require("express");

const {
  getReservations,
  getReservation,
  addReservation,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservations");
const router = express.Router({ mergeParams: true });

const { checkBanned } = require("../middleware/banning");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(protect, checkBanned, getReservations)
  .post(protect, checkBanned, authorize("admin", "user"), addReservation);

router
  .route("/:id")
  .get(protect, checkBanned, getReservation)
  .put(protect, checkBanned, authorize("admin", "user"), updateReservation)
  .delete(protect, checkBanned, authorize("admin", "user"), deleteReservation);

module.exports = router;

//add swagger documentation for the routes

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Manage reservations for co-working spaces
 *
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - reservDate
 *         - coWorking
 *       properties:
 *         _id:
 *           type: string
 *         reservDate:
 *           type: string
 *           format: date-time
 *         coWorking:
 *           type: string
 *         user:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/coworkings/{coWorkingId}/reservations:
 *   get:
 *     summary: Get all reservations for a co-working space or current user
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coWorkingId
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional CoWorking ID to filter
 *     responses:
 *       200:
 *         description: List of reservations
 *       401:
 *         description: Unauthorized
 *
 *   post:
 *     summary: Create a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Reservation created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/reservations/{id}:
 *   get:
 *     summary: Get a reservation by ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *
 *   put:
 *     summary: Update a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Updated reservation
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *
 *   delete:
 *     summary: Delete a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */