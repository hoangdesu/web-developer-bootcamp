const { catchAsync } = require('../utilities/helpers');
const YelpcampError = require('../utilities/YelpcampError');

const User = require('../models/user');
const Campground = require('../models/campground');

// GET /api/v1/users
const getAllUsers = async (req, res) => {
    // const users = await User.find({}).select('+salt +hash'); // salt and hash fields are not returned by default
    const users = await User.find({}).exec();
    res.status(200).json(users);
};

// POST /api/v1/users
const createUser = catchAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, plainPassword: password });

        // use the static method from passport-local-mongoose to create a new user and save into db
        // this will not return a null object, but rather throw error if username already exists
        await User.register(user, password);

        // establish a login session after user resigter successfully
        req.login(user, function (err) {
            if (err) return next(err);
            return res.sendStatus(200);
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
});

// GET /api/v1/users/username/:username
const getUserByUsername = catchAsync(async (req, res, next) => {
    const { username } = req.params;
    const user = await User.findOne({ username })
        .select('_id username email')
        .populate('campgrounds', '_id title price')
        .populate('favoritedCampgrounds', '_id title images location')
        .populate('reservations')
        .exec();

    if (!user) return next(new YelpcampError(404, 'User not found'));

    res.status(200).send(user);
});

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.json(user);
    } catch (e) {
        console.error(e);
        res.send(e);
    }
};

const login = (req, res, next) => {
    console.log('User logged in:', req.user.username);
    // console.log('req.user', req.user);
    res.cookie('express:D', `this_cookie_is_sent_from_server_${Math.round(Math.random() * 10)}`);
    res.sendStatus(200);
};

const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        console.log('logging out...');
        res.sendStatus(200);
    });
};

const getAllFavoritedCampgrounds = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id)
        // .select('')
        .populate('favoritedCampgrounds', '_id title')
        .exec();
    if (!user) return next(new YelpcampError(404, 'User not found'));

    res.status(200).json(user.favoritedCampgrounds);
});

const toggleFavoriteCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(new YelpcampError(404, 'User not found'));

    const { campgroundId } = req.body;
    const campground = await Campground.findById(campgroundId);

    if (!campground) return next(new YelpcampError(404, 'Campground not found'));

    let campgroundExisted = false;
    user.favoritedCampgrounds.forEach(favCampground => {
        if (campground._id.equals(favCampground._id)) {
            campgroundExisted = true;
        }
    });

    // toggle favoriting campground
    // if not exists, add to favorite list
    // if exists, remove from the list by filtering the list
    if (!campgroundExisted) {
        user.favoritedCampgrounds.push(campground);
        await user.save();
        return res.status(200).send({
            message: 'added campground to favorite',
            isFavorited: true,
        });
    } else {
        user.favoritedCampgrounds = user.favoritedCampgrounds.filter(
            favCampground => !favCampground._id.equals(campground._id),
        );
        await user.save();
        return res.status(200).send({
            message: 'removed campground from favorite',
            isFavorited: false,
        });
    }
});

const updatePersonalInformation = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { email, currentPassword, newPassword } = req.body;

    const user = await User.findById(id);

    const auth = await user.authenticate(currentPassword);
    if (!auth.user)
        return next(new YelpcampError(401, 'Invalid password. User information is NOT updated.'));

    if (email) {
        user.email = email;
    }

    if (newPassword) {
        if (newPassword !== currentPassword) {
            user.plainPassword = newPassword;
            await user.setPassword(newPassword);
        }
    }

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
});

const resetPassword = catchAsync(async (req, res, next) => {
    const { username, email, newPassword } = req.body;

    const user = await User.findByUsername(username);
    if (!user) return next(new YelpcampError(404, 'Username not found'));

    if (user.email !== email) return next(new YelpcampError(403, 'Error. Unauthorized!'));

    await user.setPassword(newPassword);
    await user.save();
    return res.sendStatus(200);
});

module.exports = {
    getAllUsers,
    createUser,
    getUserByUsername,
    getUserById,
    login,
    logout,
    getAllFavoritedCampgrounds,
    toggleFavoriteCampground,
    updatePersonalInformation,
    resetPassword,
};
