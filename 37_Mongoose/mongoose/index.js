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
        watched: Boolean,
        genres: [String]
    });

    const actorSchema = new mongoose.Schema({
        name: String
    });
    
    
    // models
    const Movie = mongoose.model('Movie', movieSchema); // will be turned into "movies" for collection name
    const Actor = mongoose.model('Actor', actorSchema);
    

    // reset db
    Movie.deleteMany({});
    Actor.deleteMany({});


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
            m1,
            m2,
            { title: 'Arcane', score: 9.0, watched: true },
            { title: 'Friends', score: 8.9 },
            { title: 'Lupin', score: 7.5, watched: true },
            { title: 'Mr. Robot', score: 8.5, watched: false },
            { title: 'Avatar 2', score: 7.8, watched: true },
            { title: 'Avatar', score: 8.1, watched: true },
            { title: 'Now you see me', score: 8.5, watched: true },
            { title: 'John Wick', score: 7.9, watched: false },
            { title: 'Johnny English', score: 7.1, watched: false },
            { title: 'Kimi no Na wa', score: 8.4, watched: true },
            { title: 'Peaky Blinders', score: 8.8, watched: false },
            { title: 'John Wick 2', score: 5.5, watched: false },
            { title: 'Spirited Away', score: 7.8, watched: false },
            { title: 'The Social Network', score: 7.8, watched: false },
            { title: 'Jumanji', score: 7.1, watched: false },
        ]);
    }
    // console.log('insertmany result', insertManyRes);

    if (true) {
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


    // >>> FIND
    // find movies with score >= 8.0
    Movie.find({ score: { $gte: 8.0 } }).exec().then(movies => console.log('movies with score >= 8:', movies));

    // find movies with score >= 7.5 that have not been watched, selecting only "title" and "score" fields. Using ['title', 'score'] is also OK
    Movie.find({ watched: false, score: { $gt: 7.5 } }, 'title score').then(movies => console.log('unwatched movies with score >= 7.5:', movies));

    // find movies that has "john" in their title using regex
    Movie.find({ title: /john/i }).then(m => console.log('movies with "john" in their title:', m));

    // find the first matching "Ava" using async/await
    const firstMatchAva = await Movie.findOne({ title: /Ava/ }).exec();
    console.log('First matching "Ava":', firstMatchAva);

    // using callback
    Movie.find({ watched: true }, 'title score', function(err, movies) {
        if (err) console.log(err);
        console.log('watched movies:', movies);
    });

    // find by ID
    Movie.findById(m1._id).then(m => console.log('movie 1 find by id:', m));   
    
    // count total documents in a collection
    console.log('Total documents:', (await Movie.countDocuments()));
    
    // no movie found -> empty list
    Movie.find({ title: 'invalid movie name' }).then(m => console.log('invalid movie (empty list):', m));
    
    
    // >>> UPDATE
    // updateOne: returns update result, not the new data
    Movie.updateOne({ title: 'Johnny English' }, { score: 6.2 }).then(msg => console.log('update one res:', msg));

    // updateMany: same, returns result, not data
    Movie.updateMany({ watched: false }, { year: 2023 }).then(res => console.log('update many res:', res));
    Movie.updateMany({ title: { $in: ['Kimi no Na wa', 'Spirited Away'] }}, { genres: ['Anime'] }).then(res => console.log('update 2 anime:', res));

    // returns the FOUND document (not the new one)
    Movie.findOneAndUpdate({ title: 'Kimi no Na wa' }, { score: 9.5 }, {}).then(movie => console.log('found movie to update:', movie));
    
    // retunrs the NEW, UPDATED VERSION of the found document
    Movie.findOneAndUpdate({ title: 'Spirited Away' }, { watched: true }, { new: true }).then(mov => console.log('updated movie:', mov));


    // >>> DELETE
    // Movie.deleteOne({ title: 'John Wick' }).then(res => console.log('deletedOne:', res));
    // Movie.deleteMany({ score: { $lt: 8.0 } }).then(r => console.log('deleted movie score < 8.0:', r));
    // Movie.findOneAndDelete({ watched: true }).then(m => console.log('removed watched movie:', m));
    // Movie.deleteMany({}).then(r => console.log('delete all documents:', r));

}
