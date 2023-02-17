const express = require('express');
const app = express();
const path = require('path');
const PORT = 3001;
const { v4: uuid } = require('uuid');
const methodOverride = require('method-override');

// must include middlewares to parse data
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // for parsing application/json

// method override middleware. Override PATCH method from POST
app.use(methodOverride('_method'));

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

let COMMENTS = [
    {
        id: '1',
        username: 'Tran Mai',
        comment: '10000 đỉmmmm 😍',
        date: new Date()
    },
    {
        id: uuid(),
        username: 'Ryan Vo',
        comment: 'Xuất sắc e giai ơi 😆',
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

// get all comments index
app.get('/comments', (req, res) => {
    res.render('comments', { comments: COMMENTS });
});

// form to create a new comment
app.get('/comments/new', (req, res) => {
    res.render('form');
});

// add a new comment from form to array
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

// comment detail
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

// edit form
app.get('/comments/:id/edit', (req, res) => {
    const { id } = req.params;
    const comment = COMMENTS.find(c => c.id === id);
    if (comment) {
        res.render('edit-form', { comment });
    } else {
        res.send('invalid id');
    }
});

// using methodOverride to turn POST from form to PATCH to update comment
app.patch('/comments/:id', (req, res) => {
    const { id } = req.params;
    console.log(req.body.comment);
    // console.log('patching', id);

    COMMENTS.forEach(cmt => {
        if (cmt.id === id) {
            cmt.comment = req.body.comment + ' (edited)';
            // res.send('update comment successfully');
            res.redirect('/comments');
        }
    })
    
    // res.send(`patching ${id}: ${req.body.comment}`);
});

// delete comment API
app.delete('/comments/:id', (req, res) => {
    const { id } = req.params;

    // filter out the comments not having the id to delete, and store back to array
    COMMENTS = COMMENTS.filter(c => c.id !== id);
    res.redirect('/comments');
});

// LISTEN
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/`);
});
