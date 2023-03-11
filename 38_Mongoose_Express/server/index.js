const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Food = require('./models/food');

const PORT = 3001;
const app = express();

app.use(cors());
app.use(express.json());

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
    console.log('finding all/details/640b9e79c441ee88114c22ee foods...');
    const data = await Food.find({});
    console.log(`found ${data.length} documents in db`);
    res.send(data);
});

app.get('/v1/foods/:id', async (req, res) => {
    const { id } = req.params;
    if (id) {
        try {
            const food = await Food.findById(id);
            console.log('found:', food);
            res.status(200).send(food);
        } catch (e) {
            res.status(404).send('id not found');
        }
    }
});

app.listen(PORT, () => {
    console.log('- Server running at http://localhost:' + PORT);
});
