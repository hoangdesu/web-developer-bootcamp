const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');

const { catchAsync } = require('../utilities/helpers');
const YelpcampError = require('../utilities/YelpcampError');

const User = require('../models/user');

// GET /api/v1/users
router.get('/', async (req, res) => {
    // const users = await User.find({}).select('+salt +hash'); // salt and hash fields are not returned by default
    const users = await User.find({}).exec();
    res.status(200).json(users);
});

// POST /api/v1/users
router.post(
    '/',
    catchAsync(async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const user = new User({ username, email, plainPassword: password });

            // use the static method from passport-local-mongoose to create a new user and save into db
            const newUser = await User.register(user, password);

            // establish a login session after user resigter successfully
            req.login(user, function (err) {
                if (err) return next(err);
                return res.sendStatus(200);
            });
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }),
);

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.json(user);
        console.log();
    } catch (e) {
        console.error(e);
        res.send(e);
    }
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
    console.log('Logged in!');
    res.sendStatus(200);
});

router.post('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        console.log('logging out...');
        res.sendStatus(200);
    });
});

module.exports = router;
