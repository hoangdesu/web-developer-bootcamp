const express = require('express');
const router = express.Router();

const controller = require('../controllers/reservation');

/**
 * @Route: /api/v1/reservations
 */

router.get('/', controller.getAllReservations);

router.post('/', controller.createReservation);

router.get('/discount', controller.checkDiscountCode);

router.get('/:id', controller.getReservationById);

router.get('/:id/status', controller.checkStatus);

router.post('/:id/pay', controller.pay);

router.get('/:id/pending', controller.pending);

router.post('/:id/cancel', controller.cancelReservation)

module.exports = router;
