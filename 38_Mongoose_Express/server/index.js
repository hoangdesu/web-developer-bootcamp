const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Food = require('./models/food');

const PORT = 3001;
const app = express();
const CLIENT_URL = 'http://127.0.0.1:5173';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);
const db = 'foodNutritionAppDb';
const URI = 'mongodb://localhost:27017/:db'.replace(/:db/i, db);

mongoose.connect(URI)
    .then(() => {
      console.log(`- Connected to ${db} DB 🚀`);
    })
    .catch((err) => {
      console.error(err);
    });


app.get('/', (req, res) => {
    res.send('Food Nutrition App server!');
});

app.get('/v1/foods', async (req, res) => {
    console.log('finding all...');
    const data = await Food.find({});
    console.log(`found ${data.length} documents in db`);
    res.send(data);
});

app.get('/v1/foods/:id', async (req, res) => {
    const { id } = req.params;
    if (id) {
        try {
            const food = await Food.findById(id);
            console.log('found: ', food);
            res.status(200).send(food);
        } catch (e) {
            res.status(404).send('id not found');
        }
    }
});

app.post('/v1/foods', async (req, res) => {
    console.log('FORM DATA:', req.body);
    const { amountPerValue, amountPerUnit } = req.body;
    
    const newFood = new Food({
        ...req.body,
        amountPer: {
            value: amountPerValue,
            unit: amountPerUnit
        }
    });

    const f = await newFood.save();
    console.log('newFood added to db:', f);

    res.status(200);
    res.redirect(`${CLIENT_URL}/food/${newFood._id}`);
});

app.listen(PORT, () => {
    console.log('- Server running at http://localhost:' + PORT);
});
