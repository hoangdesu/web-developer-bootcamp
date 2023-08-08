const express = require('express');
const router = express.Router();

const requiresLoggedIn = require('../middlewares/requiresLoggedIn');
const middlewares = require('../middlewares/campground');
const campgrounds = require('../controllers/campground');

router.route('/').get(campgrounds.getAllCamgrounds);

router.get(`/make-campground`, campgrounds.addMockCampground);

// router.route('/:id')
// .get()
// .put()
// .delete()

router.get(`/:id`, campgrounds.getACampground);

// POST /api/v1/campgrounds
router.post(`/`, requiresLoggedIn, middlewares.validateCampground, campgrounds.createCampground);

// PUT /api/v1/campgrounds/:id
router.put(
    `/:id`,
    requiresLoggedIn,
    middlewares.isCampgroundAuthor,
    middlewares.validateCampground,
    campgrounds.editCampground,
);

router.delete(
    `/:id`,
    requiresLoggedIn,
    middlewares.isCampgroundAuthor,
    campgrounds.deleteCampground,
);



module.exports = router;
