numbers = [1, 2, 3, 4, 5]

// uncommon way
// function print(element) {
//     console.log(element);
// }

// numbers.forEach(print);

// using for...of
// for (let num of numbers) {
//     console.log(num);
// }

const movies = [
    {
        title: "One",
        score: 95
    },
    {
        title: "Two",
        score: 99.69
    }
];

movies.forEach(function(each_movie) {
    console.log(`${each_movie.title} - ${each_movie.score}/100`);
})
