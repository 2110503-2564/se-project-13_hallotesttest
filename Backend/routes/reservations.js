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
 *   description: Reservation related endpoints
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reservations
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /coworkings/{coWorkingId}/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coWorkingId
 *         schema:
 *           type: string
 *         required: true
 *         description: Co-Working Space ID
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
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Get a single reservation by ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation details
 *       404:
 *         description: Reservation not found
 *       401:
 *         description: Unauthorized
 *
 *   put:
 *     summary: Update a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservDate:
 *                 type: string
 *                 format : date-time
 *               coWorking:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reservation updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Reservation not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 *   delete:
 *     summary: Delete a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation deleted
 *       404:
 *         description: Reservation not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         reservDate:
 *           type: string
 *           format: date-time
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
