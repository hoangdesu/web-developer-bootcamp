// const names = ['brian', 'hoang', 'doroke'];

// const upperNames = names.map(function(ten) {
//     return ten.toUpperCase();
// }) 

// console.log(upperNames);

// const movies = [
//     {
//         title: "One",
//         score: 95
//     },
//     {
//         title: "Two",
//         score: 99.69
//     }
// ];

// const movieTitles = movies.map(function(movie) { 
//     return movie.title.toUpperCase();
// })

// console.log(movieTitles);



// Map Practice

// DO NOT ALTER THE FOLLOWING CODE:
const fullNames = [
    { first: 'Albus', last: 'Dumbledore' }, { first: 'Harry', last: 'Potter' }, { first: 'Hermione', last: 'Granger' }, { first: 'Ron', last: 'Weasley' }, { first: 'Rubeus', last: 'Hagrid' }, { first: 'Minerva', last: 'McGonagall' }, { first: 'Severus', last: 'Snape' }
];

// Write your code here
const firstNames = fullNames.map(function (name) {
    return name.first;
});

console.log(firstNames);
