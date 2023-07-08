function wrapAsync(fn) {
    return function(err, req, res, next) {
        fn().catch(err => res.send(err));
    }
}