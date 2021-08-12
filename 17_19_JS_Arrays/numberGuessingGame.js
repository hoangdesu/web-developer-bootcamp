let max_num = parseInt(prompt("Enter maximum number"));
while (!max_num) {
    max_num = prompt("Enter a valid max number");
}

let randomNum = Math.floor(Math.random() * max_num);
console.log(randomNum);
let guess = prompt("Enter your guess");

let tries = 1 

while (parseInt(guess) !== randomNum) {
    if (guess < randomNum) {
        guess = prompt("Too low");
    } else if (guess > randomNum) {
        guess = prompt("Too high");
    } else if (guess === 'q') break;
    tries++;
}

console.log(`Congratz! It took you ${tries} tries`);