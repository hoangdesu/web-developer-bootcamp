const { catchAsync } = require('../utilities/helpers');
const YelpcampError = require('../utilities/YelpcampError');

const User = require('../models/user');

// GET /api/v1/users
const getAllUsers = async (req, res) => {
    // const users = await User.find({}).select('+salt +hash'); // salt and hash fields are not returned by default
    const users = await User.find({}).exec();
    res.status(200).json(users);
};

// POST /api/v1/users\
const createUser = catchAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, plainPassword: password });

        // use the static method from passport-local-mongoose to create a new user and save into db
        await User.register(user, password);

        // establish a login session after user resigter successfully
        req.login(user, function (err) {
            if (err) return next(err);
            return res.sendStatus(200);
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

const getUserByUsername = async (req, res, next) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username })
            .select('_id username email')
            .populate('campgrounds', '_id title price')
            .exec();

        if (!user) return next(new YelpcampError(404, 'User not found'));

        // console.log(user);
        res.status(200).send(user);
    } catch (err) {
        console.error(err);
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.json(user);
        console.log();
    } catch (e) {
        console.error(e);
        res.send(e);
    }
};

const login = (req, res, next) => {
    console.log('User logged in:', req.user.username);
    res.sendStatus(200);
};

const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        console.log('logging out...');
        res.sendStatus(200);
    });
};

module.exports = {
    getAllUsers,
    createUser,
    getUserByUsername,
    getUserById,
    login,
    logout,
};
