// Array destructuring

const games = ['League of Legends', 'Overwatch', 'Pokémon', 'Overcooked', 'Neighbor from hell'];

let [lol, ow, ...otherGames] = games;

// similar to saying
// let lol = games[0];

console.log(lol);
console.log(otherGames); // list of games from index 2 to the end



// Object destructuring

const me = {
    firstName: 'Hoang',
    lastName: 'Nguyen',
    fullName: function () {
        return `${this.firstName} ${this.lastName}`;
    },
    job: 'developer'
};

let { firstName, lastName } = me;

// similar to
// const lastName = me.lastName;
console.log(lastName, firstName);
firstName = 'Brian'; // variable can be reassigned
console.log(lastName, firstName);

// renaming variable + default value
const { job: occupation, hobby = 'piano' } = me;
console.log(occupation);
console.log(hobby);


// Params destructuring
// expects an object as param 
function whatJob(user) {
    const { job } = user; // inside function destructuring
    console.log(`Job: ${job}`);
}
whatJob(me);

// destructure on the way in
function fullName({ firstName, lastName }) {
    console.log("Full name: ", firstName, lastName);
}

fullName(me);


const movies = [
    {
        title: 'Amadeus',
        score: 99,
        year: 1984
    },
    {
        title: 'Sharknado',
        score: 35,
        year: 2013
    },
    {
        title: '13 Going On 30',
        score: 70,
        year: 2004
    },
    {
        title: 'Stand By Me',
        score: 85,
        year: 1986
    },
    {
        title: 'Waterworld',
        score: 62,
        year: 1995
    },
    {
        title: 'Jingle All The Way',
        score: 71,
        year: 1996
    },
    {
        title: 'Parasite',
        score: 95,
        year: 2019
    },
    {
        title: 'Notting Hill',
        score: 77,
        year: 1999
    },
    {
        title: 'Alien',
        score: 90,
        year: 1979
    }
]

movies.map(({ title, score, year }) => {
    console.log(`- ${title} (${year}) is rated ${score}`);
})
