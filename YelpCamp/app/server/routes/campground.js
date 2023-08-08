const express = require('express');
const router = express.Router();

const requiresLoggedIn = require('../middlewares/requiresLoggedIn');
const middlewares = require('../middlewares/campground');
const controller = require('../controllers/campground');

router.route('/').get(controller.getAllCamgrounds);

router.get(`/makecampground`, controller.addMockCampground);

router
    .route('/:id')
    .get(controller.getACampground)
    .post(requiresLoggedIn, middlewares.validateCampground, controller.createCampground)
    .put(
        requiresLoggedIn,
        middlewares.isCampgroundAuthor,
        middlewares.validateCampground,
        controller.editCampground,
    )
    .delete(requiresLoggedIn, middlewares.isCampgroundAuthor, controller.deleteCampground);

module.exports = router;
