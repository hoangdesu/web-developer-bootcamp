const array = [3, 5, 7, 9, 11];

let result = array.reduce((accumulator, currentValue) => {
	return accumulator + currentValue;
});

// above statement returns a single value: 35

console.log(result);

const prices = [9.99, 2.50, 1.23, 6.69, 9.96, 5.55, 8.76];

let min = prices.reduce((acc, price) => {
	if (acc < price) return acc;
	return price;
})

let max = prices.reduce((acc, price) => {
	if (price > acc) {
		return price;
	} 
	return acc;
})
console.log(min);
console.log(max);



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

let bestMovie = movies.reduce((bestie, candidate) => {
	if (candidate.score > bestie.score) 
		return candidate;
	return bestie;
});


let worstMovie = movies.reduce((worstie, candidate) => {
	if (candidate.score < worstie.score) 
		return candidate;
	return worstie;
});

console.log(bestMovie);
console.log(worstMovie);

let totalPrice = prices.reduce((sum, num) => sum + num);
console.log(totalPrice);

let totalPrice200 = prices.reduce((sum, num) => (sum + num), 200);
console.log(totalPrice200);