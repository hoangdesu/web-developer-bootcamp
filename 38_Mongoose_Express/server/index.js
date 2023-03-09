const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); 

// DB
mongoose.set('strictQuery', true);

const db = 'foodAppDB';
const URI = 'mongodb://localhost:27017/:db'.replace(/:db/i, db);

const foodSchema = mongoose.Schema({
    name: String,
    calories: Number
});

const Food = mongoose.model('Food', foodSchema);
const chickenBreast = new Food({
    name: 'Chicken Breast',
    calories: 100
});

const brocolli = new Food({
    name: 'Brocolli',
    calories: 25
});
// brocolli.save()


mongoose.connect(URI)
    .then(() => {
      console.log(`Connected to ${db} DB 🚀`);
    })
    .catch((err) => {
      console.error(err);
    });




app.get('/', (req, res) => {
    res.send('hi')
});

app.get('/find', async (req, res) => {
    // return [1,2,3];
    const food = await Food.findOne({ name: 'Chicken Breast' });
    console.log(food);
    res.send(food)
});

app.get('/findAll', async (req, res) => {
    const food = await Food.find({});
    console.log(food);
    res.send(food)
});

app.get('/save', async (req, res) => {
    const food = await chickenBreast.save();
    console.log('saved', food);
    res.send(`saved ${food.name} with ${food.calories} calories`);
});

app.listen(PORT, () => {
    console.log('server running at http://localhost:' + PORT);
});
