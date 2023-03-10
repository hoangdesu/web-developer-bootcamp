const mongoose = require('mongoose');

const Food = require('../models/food');
const data = require('./data');

mongoose.set('strictQuery', true);

const db = 'foodNutritionAppDb';
const URI = 'mongodb://localhost:27017/:db'.replace(/:db/i, db);

mongoose.connect(URI)
    .then(() => {
      console.log(`Connected to ${db} DB 🚀`);
    })
    .catch((err) => {
      console.error(err);
    });

// const chickenBreast = new Food({
//     name: 'Chicken breast',
//     amountPer: {
//         value: 100,
//         unit: 'grams'
//     },
//     calories: 165,
//     protein: 31,
//     category: 'meat'
// });

// chickenBreast.save().then(f => console.log('saved:', f.name));


// drop collection
Food.deleteMany({}).then(() => console.log('collection cleared'));

// populate data
Food.insertMany(data)
    .then(res => {
        console.log('insert many:', res.length)
    })
    .catch(e => console.error(e));

