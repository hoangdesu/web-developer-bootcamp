const express = require('express');
const app = express();
const path = require('path');
const PORT = 3001;
const { v4: uuid } = require('uuid');

// must include middlewares to parse data
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // for parsing application/json

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// index
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.send('OK!');
});

// GET: data is sent via query string
app.get('/sushi', (req, res) => {
    // console.log(req.query);
    const { type, qty } = req.query;
    res.send(`GET /sushi: received order of ${qty} ${type} sushi.`);
});

// POST: data is sent via request body
app.post('/sushi', (req, res) => {
    // console.log(req.body);
    const { type, qty } = req.body;
    res.send(`POST /sushi: received order of ${qty} ${type} sushi.`)
});


// APIs for COMMENTS app
// ** DESIGN **
// Index       GET     /comments
// New form    GET     /comments/new
// Create      POST    /comments
// Show        GET     /comments/:id
// Edit form   GET     /comments/:id/edit           
// Update      PATCH   /comments/:id
// Destroy     DELETE  /comments/:id

const COMMENTS = [
    {
        id: uuid(),
        username: 'Ryan Vo',
        comment: 'Xuất sắc e giai ơi 😆',
        date: new Date()
    },
    {
        id: uuid(),
        username: 'Tran Mai',
        comment: '10000 đỉmmmm 😍',
        date: new Date()
    },
    {
        id: uuid(),
        username: 'Đức Nguyên',
        comment: 'Nghệ cả củ anh ạ',
        date: new Date()
    },
    {
        id: uuid(),
        username: 'Tuan Anh Nguyen',
        comment: 'Ngầu',
        date: new Date()
    },
    {
        id: uuid(),
        username: 'Nguyễn Tấn Phát',
        comment: 'Daddy đánh em đi',
        date: new Date()
    }
];

app.get('/comments', (req, res) => {
    res.render('comments', { comments: COMMENTS });
});

app.get('/comments/new', (req, res) => {
    res.render('form');
});

app.post('/comments', (req, res) => {
    // console.log(req.body);
    // if (req.body.hasOwnProperty('username')) console.log('has');

    if (('username' in req.body) && ('comment' in req.body)) {
        const { username, comment } = req.body;
        COMMENTS.push({ id: uuid(), username, comment, date: new Date() });
        // res.send('OK');
        res.redirect('/comments');
    }
});

app.get('/comments/:id', (req, res) => {
    const { id } = req.params;
    const comment = COMMENTS.find(c => c.id === id);
    // console.log(comment);
    if (comment) {
        res.render('comment-detail', { comment });
    } else {
        res.send(`No comment with id=${id} found`);
    }
});


// LISTEN
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/`);
});
