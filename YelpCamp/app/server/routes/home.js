const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('YelpCamp server running');
});

module.exports = router;
