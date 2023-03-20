const express = require('express');
const cors = require('cors');

const PORT = 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('hi!');
});

app.get('/hi', (req, res) => {
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
