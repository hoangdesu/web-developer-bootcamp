const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const PORT = 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use((req, res, next) => {
    console.log('got a request!');
    return next();
})

app.get('/', (req, res) => {
    // console.log('got a req');
    // res.send('hi hehe!');
    res.json({ message: 'good' });
});

app.get('/api/v1/hi', (req, res) => {
    console.log('here');
    const { name } = req.query;
    let msg = 'hello world';
    if (name) {
        msg = 'hello ' + name;
    }
    res.json({ message: msg });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
