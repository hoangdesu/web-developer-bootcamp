const express = require('express');
const router = express.Router();

const controller = require('../controllers/reservation');

/**
 * @Route: /api/v1/reservation
 */

router.get('/all', controller.getAllReservations);

router.get('/:id', controller.getReservationById);

router.post('/new', controller.createReservation);

router.get('/:id/qr', controller.getQRCode);

module.exports = router;
