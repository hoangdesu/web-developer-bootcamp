const express = require('express');
const app = express();
const { champRouter } = require('./routes/champs');

const PORT = 3000;

app.use('/champs', champRouter);

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
