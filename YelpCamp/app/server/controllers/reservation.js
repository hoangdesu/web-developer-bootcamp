const mongoose = require('mongoose');
const { catchAsync } = require('../utilities/helpers');
const YelpcampError = require('../utilities/YelpcampError');
const QRCode = require('qrcode');

const Reservation = require('../models/reservation');
const Campground = require('../models/campground');
const User = require('../models/user');

const reservationSchema = require('../schemas/reservation');

module.exports.getAllReservations = catchAsync(async (req, res) => {
    const reservations = await Reservation.find({}).exec();
    res.send(reservations);
});

module.exports.createReservation = catchAsync(async (req, res) => {
    const { bookedBy, campground } = req.body.reservation;
    const { error: joiValidationError } = reservationSchema.validate(req.body);
    if (joiValidationError) throw new YelpcampError(500, joiValidationError);

    const user = await User.findById(bookedBy).exec();
    if (!user) throw new YelpcampError(404, 'User not found');

    const reservedCampground = await Campground.findById(campground).exec();
    if (!reservedCampground) throw new YelpcampError(404, 'Campground not found');

    const newReservation = new Reservation({ ...req.body.reservation });
    await newReservation.save();

    user.reservations.push(newReservation);
    await user.save();

    reservedCampground.reservations.push(newReservation);
    await reservedCampground.save();

    res.status(200).json(newReservation);
});

module.exports.getReservationById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const reservation = await Reservation.findById(id)
        .populate('bookedBy', '_id username email')
        .populate('campground', 'title')
        .exec();
    if (!reservation) throw new YelpcampError(404, 'Reservation not found');
    res.status(200).json(reservation);
});

module.exports.getQRCode = catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log('req.hostname', req.hostname);
    console.log('req.headers.host', req.headers.host);
    console.log('request.headers.origin', req.headers.origin);
    var os = require('os');
    const hn = os.hostname();
    console.log('hn', hn);
    const ipAddress = req.socket.remoteAddress;
    console.log('ipAddress', ipAddress);
    const ipAddresses = req.header('x-forwarded-for');
    console.log('ipAddresses', ipAddresses);
    // const url = `https://${req.hostname}:5173/reservation/${id}/confirm`;

    const body = req.body;

    // const url = `${req.headers.origin}/reservation/${id}/confirm`;
    // console.log('QR DATA:'. url);
    const qr = await QRCode.toDataURL(body.url, { errorCorrectionLevel: 'H' });

    console.log('body', body);
    res.send(qr);

    // res.send('ok');
});

module.exports.checkStatus = catchAsync(async (req, res) => {
    const {id}=req.params;
    const resv = await Reservation.findById(id);
    if (resv.status === 'PAID') {
        return res.send('PAID');
    }

    res.send({
        id: resv._id,
        status: resv.status,
    });
});

module.exports.pay = catchAsync(async (req, res) => {
    const { id } = req.params;
    const resv = await Reservation.findById(id);
    console.log(resv);
    resv.status = 'PAID';
    await resv.save();
    res.send(resv.status);
});

module.exports.pending = catchAsync(async (req, res) => {
    const { id } = req.params;
    const resv = await Reservation.findById(id);
    console.log(resv);
    resv.status = 'PENDING';
    await resv.save();
    res.send(resv.status);
});
