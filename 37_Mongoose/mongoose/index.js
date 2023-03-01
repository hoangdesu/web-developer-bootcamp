const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const db = 'movieApp';
const URI = 'mongodb://localhost:27017/:db'.replace(/:db/i, db);


main().catch(err => console.log(err));


async function main() {
    await mongoose.connect(URI).catch(e => {});
    console.log('connected to mongodb');

    
    // defining schemas
    const movieSchema = new mongoose.Schema({
        title: String,
        year: { type: Number }, // shorthand for year: Number
        score: Number,
        rating: String,
        watched: Boolean
    });

    const actorSchema = new mongoose.Schema({
        name: String
    });
    
    
    // models
    const Movie = mongoose.model('Movie', movieSchema); // will be turned into "movies" for collection name
    const Actor = mongoose.model('Actor', movieSchema);
    

    // create actual movie instances (documents)
    const m1 = new Movie({ title: 'Alice in Borderland', year: 2020, score: 7.7, rating: 'R', watched: true });
    // console.log(m1);
    // const m1Saved = await m1.save();
    // console.log(m1Saved);

    // console.log(m1 === m1Saved); // true
    
    
    const m2 = new Movie({ title: 'Spy x Family' });
    await m2.save();


    const allMovies = await Movie.find();
    console.log(allMovies);

}



