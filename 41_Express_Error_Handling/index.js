const express = require('express');
const morgan = require('morgan');

const AppCustomError = require('./AppCustomError');

const PORT = 3001;
const app = express();

app.use(morgan('dev'));


// middleware function requestTime
const requestTime = (req, res, next) => {
    req.requestTime = Date.now(); // field becomes available in every request below
    return next();
}

app.use(requestTime);

// re-creating morgan logger middleware
app.use((req, res, next) => {
    // req.method = 'POST'; // override EVERY request to POST => dumbass idea, but possible
    const msg = `ERROR LOG: ${req.method} ${req.path}`;
    console.log(msg);
    return next();
});

// matching a particular path, regarless the method
app.use('/cats', (req, res, next) => {
    console.log('meoowwwww');
    return next();
});


const verifyPasswordMiddleware = (req, res, next) => {
    const { code } = req.query;
    if (code === 'ahihi') {
        return next();
    }
    // res.send('WHERE DA CODE BRO??');

    // simple approach:
    // res.status()
    // throw new Error('WHERE DA CODE BRO??');

    // better approach:
    throw new AppCustomError(401, 'WHERE DA CODE BRU??');
}


// -- ROUTE HANDLERS
app.get('/', (req, res) => {
    const { name } = req.query;
    console.log(req.requestTime);
    if (name) {
        res.send('hello ' + name);
    } else {
        res.send('hello world');
    }
});

app.get('/time', (req, res) => {
    // using requestTime middleware
    res.send('requested at ' + new Date(req.requestTime).toString()); 
});

app.get('/error', verifyPasswordMiddleware, (req, res) => {
    chicken.fly(); // chicken is not defined -> error!
});

// using custom middleware to verify password
// http://localhost:3001/secret?password=meoww&code=ahihi -> passing the first middleware, passing the second middeware will display this line
app.get('/secret', verifyPasswordMiddleware, (req, res, next) => {
    res.send('I stopped this course for more than 2 months :(');
});

app.get('/notadmin', (req, res) => {
    throw new AppCustomError(403, 'You are not an admin');
});

// placed last, if no path matched, then call this middleware
app.use((req, res, next) => {
    res.status(404).send('NOT FOUND!!!');
});


// custom error handler: must place after everything
app.use((err, req, res, next) => {
    console.log('*** ERROR!! ***');

    // sending back a custom message
    // res.status(500).send('*** WE GOT AN ERROR !! ***');

    // using built-in error handler: must pass in the err object to next, otherwise won't work
    next(err);
});


// responding with the fields from the err obj
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).send(message);
});


app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});
