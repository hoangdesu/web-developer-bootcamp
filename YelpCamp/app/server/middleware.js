module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log('authenticated:', req.user);
        return next();
    } else {
        console.log('unauth')
        return res.redirect('/');
    }
};
