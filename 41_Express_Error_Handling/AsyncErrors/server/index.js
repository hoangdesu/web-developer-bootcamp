const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const AppCustomError = require('./AppCustomError');

const PORT = 3001;
const app = express();
const CLIENT_URL = 'http://127.0.0.1:5173';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const Food = require('./models/food');

mongoose.set('strictQuery', true);
const db = 'foodNutritionAppDbErrorsHandling';
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

// GET FOODS
app.get('/v1/foods', async (req, res, next) => {
    console.log('finding all...');

    const { category, name } = req.query;

    // FILTER BY CATEGORY
    if (category) {
        const categories = await Food.find({ category });
        console.log(categories);
        res.send(categories);

    // FIND BY NAME
    } else if (name) {
        const foundNames = await Food.find({ name: new RegExp(name, 'i') }); // flag "i" = case-insensitive
        console.log(foundNames);
        res.send(foundNames);

    // SEND ALL DATA    
    } else {
        const data = await Food.find({});
        console.log(`found ${data.length} documents in db`);
        res.send(data);
    }
});

// GET FOOD
app.get('/v1/foods/:id', async (req, res, next) => {
    const { id } = req.params;
    if (id) {
        // try {
        //     const food = await Food.findById(id);
        //     console.log('found: ', food);
        //     res.status(200).send(food);
        // } catch (e) {
        //     res.status(404).send('id not found');
        // }


        // - replacing try-catch with async error handling
        // const food = await Food.findById(id);

        // if (!food) {
        //     return next(new AppCustomError(404, 'Error: Food not found!'));
        // }
        // res.status(200).send(food);


        // - combining error handling with try-catch to avoid unexpected errors
        try {
            const food = await Food.findById(id);

            if (!food) {
                return next(new AppCustomError(404, 'Error: Food not found!'));
            }
            res.status(200).send(food);
        } catch (err) {
            return next(err);
        }
    }
});

// ADD FOOD
app.post('/v1/foods', async (req, res, next) => {
    console.log('FORM DATA:', req.body);
    const { amountPerValue, amountPerUnit } = req.body;
    
    const newFood = new Food({
        ...req.body,
        amountPer: {
            value: amountPerValue,
            unit: amountPerUnit
        }
    });

    try {
        const f = await newFood.save();
        console.log('newFood added to db:', f);
        res.status(200);
        res.redirect(`${CLIENT_URL}/foods/${newFood._id}`);
    } catch (e) {
        // console.log(e);
        // res.send('invalid input');
        next(e);
    }
});

// UPDATE FOOD
app.put('/v1/foods/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const updatedFood = {
            ...req.body,
            amountPer: {
                value: req.body.amountPerValue,
                unit: req.body.amountPerUnit
            }
        };
        console.log('updated food', updatedFood);

        const updatedRes = await Food.findByIdAndUpdate(id, updatedFood, { runValidators: true, new: true });
        console.log('updatedRes:', updatedRes);
        if (!updatedRes) return next(new AppCustomError(404, 'Updating food failed'));
        res.redirect(`${CLIENT_URL}/foods/${id}`);
    } catch (e) {
        next(e);
    }
});

// DELETE FOOD
app.delete('/v1/foods/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Food.findByIdAndDelete(id);

        if (!deleted) return next(new AppCustomError(404, 'Food not found. Deleted failed'));

        console.log('deleted:', deleted);
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});


// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).send(message);
});


app.listen(PORT, () => {
    console.log('- Server running at http://localhost:' + PORT);
});
