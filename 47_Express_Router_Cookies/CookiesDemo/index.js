const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 3000;

app.use(cookieParser());

app.get('/hi', (req, res) => {
    const { name } = req.query;
    if (name) {
        res.cookie('name', name);
        res.send(`Hi ${name}`)
    } else {
        res.send('Hi world!');
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
