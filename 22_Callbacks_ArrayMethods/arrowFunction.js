const add = (a, b) => {
    return a + b;
}

console.log(add(2,3));

const greet = (name) => {
    return `Hey ${name}!`;
}

console.log(greet("Brian"));


// // regular function expression
// const sqr = function(num) {
// 	return num * num;
// }

// // arrow function with parens around only 1 param
// const sqr = (num) => {
// 	return num * num;
// }

// // without parens around param
// const sqr = num => {
// 	return num * num;
// }


// // --- Implicit return ---

// // implicit return using parens
// const sqr = num => (
// 	num * num
// );

// // one-liner implicit return
// const sqr = num => num * num;

// console.log(sqr(9));
// console.log(square(12));

const fullNames = [
    { first: 'Albus', last: 'Dumbledore' }, { first: 'Harry', last: 'Potter' }, { first: 'Hermione', last: 'Granger' }, { first: 'Ron', last: 'Weasley' }, { first: 'Rubeus', last: 'Hagrid' }, { first: 'Minerva', last: 'McGonagall' }, { first: 'Severus', last: 'Snape' }
];

const lastNames = fullNames.map(name => (
    name.last.toUpperCase()
));

console.log(lastNames);

