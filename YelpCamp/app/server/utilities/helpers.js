function catchAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => {
            console.error(err);
            next(err);
        });
    };
}

module.exports = {
    catchAsync,
};
