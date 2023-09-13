const express = require('express');
const router = express.Router({ mergeParams: true });
const requiresLoggedIn = require('../middlewares/requiresLoggedIn');

const middlewares = require('../middlewares/review');
const controller = require('../controllers/review');

/*
/* @Route: /api/v1/campgrounds/:campgroundId/reviews
*/

router.route('/').post(requiresLoggedIn, middlewares.validateReview, controller.addReview);

router
    .route('/:reviewId')
    .put(requiresLoggedIn, middlewares.isReviewAuthor, controller.editReview)
    .delete(requiresLoggedIn, middlewares.isReviewAuthor, controller.deleteReview);

module.exports = router;
