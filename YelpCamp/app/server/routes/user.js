const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const controller = require('../controllers/user');
const requiresLoggedIn = require('../middlewares/requiresLoggedIn');

router.route('/').get(controller.getAllUsers).post(controller.createUser);

router.get('/username/:username', controller.getUserByUsername);

router.get('/:id', controller.getUserById);

router.get('/:id/favorited-campgrounds', controller.getAllFavoritedCampgrounds);

router.post(
    '/:id/favorite-campground',
    requiresLoggedIn,
    controller.toggleFavoriteCampground,
);

router.post('/login', passport.authenticate('local'), controller.login);

router.post('/logout', controller.logout);

module.exports = router;
