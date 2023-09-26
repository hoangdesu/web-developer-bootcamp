const express = require('express');
const router = express.Router();

const controller = require('../controllers/reservation');

/**
 * @Route: /api/v1/reservation
 */

router.get('/all', controller.getAllReservations);

router.post('/new', controller.createReservation);

router.get('/discount', controller.getDiscountCodes);

router.get('/:id', controller.getReservationById);

router.get('/:id/status', controller.checkStatus);

router.get('/:id/pay', controller.pay);

router.post('/:id/qr', controller.getQRCode);

router.get('/:id/pending', controller.pending);

module.exports = router;
