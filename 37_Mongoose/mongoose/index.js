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
    const Actor = mongoose.model('Actor', actorSchema);
    

    // reset db
    await Movie.deleteMany({});
    await Actor.deleteMany({});


    // create actual movie instances (documents)
    const m1 = new Movie({ title: 'Alice in Borderland', year: 2020, score: 7.7, rating: 'R', watched: true });
    // console.log(m1);
    // const m1Saved = await m1.save();
    // console.log(m1Saved);

    // console.log(m1 === m1Saved); // true
    
    
    const m2 = new Movie({ title: 'Spy x Family' });
    // await m2.save();


    const allMovies = await Movie.find({}).exec();
    console.log('all movies:', allMovies);

    // - insert many = create the docs and save directly to db
    if (true) {
        const insertManyRes = await Movie.insertMany([
            { title: 'Arcane', score: 9.0, watched: true },
            { title: 'Friends', score: 8.9 },
            { title: 'Lupin', score: 7.5, watched: true },
            { title: 'Mr.Robot', score: 8.5, watched: false },
            { title: 'Avatar 2', score: 7.8, watched: true },
        ]);
    }
    // console.log('insertmany result', insertManyRes);

    if (false) {
        Actor.insertMany([
            { name: 'Brian' },
            { name: 'Cun' },
            { name: 'Hoang' },
        ]).then(actor => {
            console.log('saved actor: ', actor);
        }).catch(err => {
            console.error(err);
        });
    }


    // FIND
    // find movies with score >= 8.0
    Movie.find({score: { $gte: 8.0 }}).exec().then(m => console.log('found:', m));

}



