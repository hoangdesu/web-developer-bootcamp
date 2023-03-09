const mongoose = require("mongoose");

const db = "userDB";
const URI = "mongodb://localhost:27017/:db".replace(/:db/i, db);

mongoose.set("strictQuery", true);

mongoose.connect(URI)
  .then(() => {
    console.log(`Connected to ${db} 🚀`);
  })
  .catch((err) => {
    console.error(err);
  });

const personSchema = mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    birthYear: Number
}, {
    virtuals: {
        fullName: {
            get() {
                return `${this.name.first} ${this.name.last}`;
            },
            set(arg) {
                this.name.first = arg.substr(0, arg.indexOf(' '));
                this.name.last = arg.substr(arg.indexOf(' ') + 1);
            }
        }
    },
    // collection: 'ehehe' // can have custom collection name
});


// virtuals
personSchema.virtual('age')
    .get(function() {
        return new Date().getFullYear() - this.birthYear;
    })
    .set(function(age) {
        this.birthYear = new Date().getFullYear() - age;
    });


const Person = mongoose.model('Person', personSchema); // collection name "people"


Person.deleteMany({}).then((res) => {console.log('deleted:', res)});


const brian = new Person({
    name: { first: 'Brian', last: 'Nguyen' },
    birthYear: 1995
});
brian.save().then(d => {console.log('saved:', d)});


console.log('Full name virtual:', brian.fullName);
console.log('Age virtual:', brian.age);


// setting new values, also update in db
brian.age = 18
console.log('new birthyear, age', brian.birthYear, brian.age);

brian.fullName = 'Hoang Nguyen'
console.log('new name:', brian.name.first, brian.name.last);


Person.find({}).then(p => console.log(p));
