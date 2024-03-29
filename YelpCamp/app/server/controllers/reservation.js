const mongoose = require('mongoose');
const { catchAsync } = require('../utilities/helpers');
const YelpcampError = require('../utilities/YelpcampError');

const Reservation = require('../models/reservation');
const Campground = require('../models/campground');
const User = require('../models/user');

const fs = require('node:fs/promises');
const path = require('path');

const reservationSchema = require('../schemas/reservation');

module.exports.getAllReservations = catchAsync(async (req, res) => {
    const reservations = await Reservation.find({}).populate('campground').exec();
    res.status(200).json(reservations);
});

module.exports.createReservation = catchAsync(async (req, res) => {
    const { bookedBy, campground } = req.body.reservation;
    const { error: joiValidationError } = reservationSchema.validate(req.body);
    if (joiValidationError) throw new YelpcampError(500, joiValidationError);

    const user = await User.findById(bookedBy).exec();
    if (!user) throw new YelpcampError(404, 'User not found');

    const reservedCampground = await Campground.findById(campground).exec();
    if (!reservedCampground) throw new YelpcampError(404, 'Campground not found');

    const newReservation = new Reservation({ ...req.body.reservation, status: 'PENDING' });
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
        // .populate('campground')
        .populate({
            path: 'campground',
            select: ['images', 'location', 'price', 'title', 'description'],
            populate: {
                path: 'author',
                model: 'User',
                select: ['_id', 'username'],
            },
        })
        .populate({
            path: 'campground',
            populate: {
                path: 'reviews',
                model: 'Review',
            },
        })
        .exec();
    if (!reservation) throw new YelpcampError(404, 'Reservation not found');
    res.status(200).json(reservation);
});

module.exports.checkStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const resv = await Reservation.findById(id);

    if (!resv) throw new YelpcampError(404, 'Reservation not found');

    if (resv.status === 'PAID') {
        return res.send('PAID');
    }

    res.send({
        id: resv._id,
        status: resv.status,
    });
});

module.exports.pay = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { password } = req.body;

    const resv = await Reservation.findById(id);
    if (!resv) return next(new YelpcampError(404, 'Invalid Reservation ID'));

    const author = await User.findById(resv.bookedBy);

    const auth = await author.authenticate(password);

    if (!auth.user) return next(new YelpcampError(401, 'Wrong password'));

    resv.status = 'PAID';
    await resv.save();
    return res.status(200).json(resv.status);
});

module.exports.checkDiscountCode = catchAsync(async (req, res) => {
    const { discountCode: discountCodeParam } = req.query;
    const discountCode = discountCodeParam.toUpperCase();

    const data = await fs.readFile(path.join(__dirname, '../utilities/DISCOUNT_CODES.json'), {
        encoding: 'utf8',
    });
    const DISCOUNT_CODES = JSON.parse(data);

    if (discountCode in DISCOUNT_CODES) {
        return res.status(200).json({
            valid: true,
            percentage: DISCOUNT_CODES[discountCode],
        });
    } else {
        return res.status(200).json({
            valid: false,
            percentage: 0,
        });
    }
});

module.exports.cancelReservation = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const resv = await Reservation.findOneAndUpdate(
        { _id: id },
        { status: 'CANCELLED' },
        {
            new: true,
        },
    );

    if (!resv) return next(new YelpcampError(404, 'Error: invalid Reservation ID'));
    res.sendStatus(200);
});
