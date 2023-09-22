const express = require('express');
const router = express.Router();

const requiresLoggedIn = require('../middlewares/requiresLoggedIn');
const middlewares = require('../middlewares/campground');
const controller = require('../controllers/campground');

const { upload } = require('../configs/cloudinary');

/*
/* @Route: /api/v1/campgrounds 
*/

router
    .route('/')
    .get(controller.getAllCamgrounds)
    .post(
        requiresLoggedIn,
        upload.array('campground[images]', 10),
        middlewares.validateCampground,
        controller.createCampground,
    );

router.get('/search', controller.searchCampgrounds);

router
    .route('/:id')
    .get(controller.getACampground)
    .put(
        requiresLoggedIn,
        middlewares.isCampgroundAuthor,
        upload.array('campground[images]'),
        middlewares.validateCampground,
        controller.editCampground,
    )
    .delete(requiresLoggedIn, middlewares.isCampgroundAuthor, controller.deleteCampground);

module.exports = router;
