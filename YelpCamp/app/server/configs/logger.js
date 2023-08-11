// const morgan = require('morgan');

// //creating user token
// morgan.token('user', req => {
//     return req.user?.username || null;
// });

// morgan.token('time', req => {
//     const now = new Date();
//     const time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
//     return time;
// });

// module.exports = morgan;

// custom logger
const logger = (req, res, next) => {
    return function logger(req, res, next) {
        const now = new Date();
        const time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();

        const user = req.user?.username || null;
        console.log(`\n[${time}] req.user: ${user}`);
        next();
    };
};

module.exports = logger;
