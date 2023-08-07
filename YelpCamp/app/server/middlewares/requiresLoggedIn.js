const YelpcampError = require('../utilities/YelpcampError');

module.exports = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next(new YelpcampError(401, 'Unauthorized!'));
    }
    next();
};
