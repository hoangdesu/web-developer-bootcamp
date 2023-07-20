const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    if (req.query.user.toLowerCase() === 'doroke') {
        return next();
    }
    throw new Error('Unauthorized!');
});

router.get('/', (req, res) => {
    // GET /admin?user=doroke
    res.send('Welcome back, Doroke!');
});

module.exports = router;
