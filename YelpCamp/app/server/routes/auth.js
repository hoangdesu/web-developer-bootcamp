const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');

/* @ GET /api/v1/auth/
 */

router.get('/currentuser', controller.getCurrentUser);

router.post('/matching-username-password', controller.checkMatchingUsernamePassword);

module.exports = router;
