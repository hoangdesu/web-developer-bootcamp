
const names = ['Hoang', 'Cun', 'Brian', 'Doroke']

// For...of
for (let name of names) {
    console.log(name + ' Nguyen');
}

for (let c of names[0]) {
    console.log(c);
}

// For...in
food = {
    vietnam :   "Phở",
    japan   :   "Sushi",
    korea   :   "Kimchi",
    usa     :   "Burger"
}

// for (let country in food) {
//     console.log(`${country} has ${food[country]}`);
// }

console.log(Object.keys(food));
console.log(Object.values(food));
console.log(Object.entries(food));

for (let dish of Object.values(food)) {
    console.log(dish);
}

// Symbols
let name1 = Symbol('name');
let name2 = Symbol('name');
console.log(name1 === name2);

