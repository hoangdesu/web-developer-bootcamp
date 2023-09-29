const { catchAsync } = require('../utilities/helpers');
const YelpcampError = require('../utilities/YelpcampError');

const User = require('../models/user');

// GET /api/v1/auth

module.exports.getCurrentUser = (req, res) => {
    if (req.user) {
        res.status(200).json({
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
        });
    } else {
        res.status(200).json(null);
    }
};

module.exports.checkMatchingUsernamePassword = catchAsync(async (req, res, next) => {
    const { username, email } = req.body;

    const user = await User.findByUsername(username);
    if (!user) return next(new YelpcampError(404, 'Error. This user does not exist'));

    if (user.email !== email)
        return next(
            new YelpcampError(403, "Error. The username and password you entered don't match"),
        );

    res.sendStatus(200);
});
