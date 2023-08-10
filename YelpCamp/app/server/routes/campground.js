const express = require('express');
const router = express.Router();

const requiresLoggedIn = require('../middlewares/requiresLoggedIn');
const middlewares = require('../middlewares/campground');
const controller = require('../controllers/campground');

router
    .route('/')
    .get(controller.getAllCamgrounds)
    .post(requiresLoggedIn, middlewares.validateCampground, controller.createCampground);

router.get(`/makecampground`, controller.addMockCampground);

router
    .route('/:id')
    .get(controller.getACampground)
    .put(
        requiresLoggedIn,
        middlewares.isCampgroundAuthor,
        middlewares.validateCampground,
        controller.editCampground,
    )
    .delete(requiresLoggedIn, middlewares.isCampgroundAuthor, controller.deleteCampground);

module.exports = router;
