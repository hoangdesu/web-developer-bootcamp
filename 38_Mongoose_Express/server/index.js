const express = require('express');
const cors = require('cors');

const Food = require('./models/food');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); 


app.get('/', (req, res) => {
    res.send('Food Nutrition App backend saying hi!');
});


app.listen(PORT, () => {
    console.log('server running at http://localhost:' + PORT);
});
