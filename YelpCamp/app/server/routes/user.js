const express = require('express');
const router = express.Router({ mergeParams: true });
const { catchAsync } = require('../utilities/helpers');
const User = require('../models/user');
const YelpcampError = require('../utilities/YelpcampError');

router.get('/', async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
});

router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, plainPassword: password });
        const newUser = await User.register(user, password);
        console.log(newUser);
        res.send(newUser);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.json(user);
        console.log()
    } catch (e) {
        console.error(e);
        res.send(e);
    }
});

module.exports = router;
