const multiply = (x, y) => x * y;
const square = x => multiply(x, x);
const isRightTriangle = (a, b, c) => square(a) + square(b) === square(c);

console.log("Before execution");
console.log(isRightTriangle(3, 4, 5));
console.log("DONE");

// web api
console.log("First line");
setTimeout(() => { console.log("Last one :/") },3000);
console.log("Second line");