const express = require('express');
const morgan = require('morgan');

const PORT = 3001;
const app = express();

// using morgan - the HTTP request logger middleware
app.use(morgan('dev'));

// runs on every request
// app.use((req, res) => {
//     res.send('HIJACKED by app.use()');
// });

app.use((req, res, next) => {
    console.log('my first middleware!');
    return next(); // chaining with the next middleware 
    // without calling next, it will hang up the app

    // code after next still runs, but not right away. Not a common pattern. 
    // Can return next() to stop execution
    console.log('after calling next on second middleware');
});

app.use((req, res, next) => {
    console.log('my second middleware!');
    return next();
});


// middleware function requestTime
const requestTime = (req, res, next) => {
    req.requestTime = Date.now(); // field becomes available in every request below
    return next();
}

app.use(requestTime);

// re-creating morgan logger middleware
app.use((req, res, next) => {
    // req.method = 'POST'; // override EVERY request to POST => dumbass idea, but possible
    const msg = `LORD MORGAN: ${req.method} ${req.path}`;
    console.log(msg);
    return next();
});

// matching a particular path, regarless the method
app.use('/cats', (req, res, next) => {
    console.log('meoowwwww');
    return next();
});

// not real authentication!
// need to provide the correct password in query string for every request
app.use((req, res, next) => {
    const { password } = req.query;
    if (password === 'meoww') {
        return next();
    }
    res.send('WHERE DA PASSWORD BRO??');
});

// or use it as a middle directly inside app.get for a specific path
const verifyPasswordMiddleware = (req, res, next) => {
    const { code } = req.query;
    if (code === 'ahihi') {
        return next();
    }
    res.send('WHERE DA CODE BRO??');
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

// using custom middleware to verify password
// http://localhost:3001/secret?password=meoww&code=ahihi -> passing the first middleware, passing the second middeware will display this line
app.get('/secret', verifyPasswordMiddleware, (req, res, next) => {
    res.send('My kitty will arrive in HCMC in 30 mins and I\'m so freakin exicted!! ^^~');
});

// placed last, if no path matched, then call this middleware
app.use((req, res, next) => {
    res.status(404).send('NOT FOUND!!!');
});


app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});
