const exams = [70, 71, 77, 80, 90];

let allPassed = exams.every(score => {
    return score >= 70;
});

console.log(`Every score > 70: ${allPassed}`)

let someHDs = exams.some(score => score >= 80);
console.log(`Some HDs: ${someHDs}`);

// -- exercise

const allEvens = numArr => (
    numArr.every(num => num % 2 === 0)
);


console.log(allEvens([1,2,3]));
console.log(allEvens([2,4,6,8]));
