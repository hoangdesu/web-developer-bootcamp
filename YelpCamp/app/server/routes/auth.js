const express = require('express');
const router = express.Router();

// GET /api/v1/auth/currentuser
router.get('/currentuser', (req, res) => {
    if (req.user) {
        res.status(200).json({
            user: req.user._id,
            username: req.user.username,
            email: req.user.email,
        });
    } else {
        res.status(200).json(null);
    }
});

module.exports = router;