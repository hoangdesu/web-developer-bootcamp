// Take a function as argument
function roll3Dices(func) {
    // add parenthesis to invoke the function
    func();
    func();
    func();
}

function rollDie() {
    let die =  Math.floor(Math.random() * 6) + 1;
    console.log(die);
}

// roll3Dices(rollDie); // only pass in the function name. Don't invoke it!


// Returning a function

function luckOrNot() {
    let r = Math.random();
    if (r > 0.5) {
        return function() {
            console.log("You won the lottery \\m/");
        }
    } else {
        return function() {
            console.log("Better luck next time :(");
        }
    }
}

const result = luckOrNot(); // storing returned function into a variable
// result(); // invoke function


// Returning a function with param
function makeBetweenFunction(a, b) {
    return function(num) {
        return num >= a && num <= b;
    }
}

const isChild = makeBetweenFunction(1, 18);
console.log(isChild(21));
console.log(isChild(17));

const isAdult = makeBetweenFunction(19, 65);
console.log(isAdult(30));
console.log(isAdult(69));

const isSenior = makeBetweenFunction(66, 120);
console.log(isSenior(130));
console.log(isSenior(69));