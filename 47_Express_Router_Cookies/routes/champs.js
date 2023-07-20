const express = require('express');
const morgan = require('morgan');
const router = express.Router();

router.use(morgan('dev'));

// define the home page route
router.get('/', (req, res) => {
    const { name } = req.query;

    if (name) res.send(`Champ NAME: ${name}`); // /champs?name=zed
    else res.send('Champs home page'); // /champs
});

// getting request params
router.get('/:id', (req, res) => {
    const { id } = req.params;
    res.send(`Champ ID: ${id}`); // champs/123
});

router.post('/', (req, res) => {
    res.send('POST /champs');
});

module.exports = router;
