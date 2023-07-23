const express = require('express');
const route = express.Router();
const { catchAsync } = require('../utilities/helpers');

const YelpcampError = require('../utilities/YelpcampError');

// Models
const Review = require('../models/review');

route.get(
    '/',
    catchAsync(async (req, res, next) => {
        res.status(200).json(await Review.find({}));
    }),
);

module.exports = route;