function sum() {
    console.log(arguments);
    const arg_list = Array.from(arguments);
    console.log(arg_list);
}

sum(1,2,3);

function sumAll(...nums) {
    console.log(nums); // nums is an actual array, can use array methods
    console.log(...nums); // spread items in nums array
    let result = nums.reduce((accu, val) => {
        return accu + val;
    })
    return result;

}

console.log(sumAll(5,6,7));

function raceResults(gold, silver, ...everyone) {
    console.log(`Gold medalist: ${gold}`);
    console.log(`Silver medalist: ${silver}`);
    console.log(`Thanks everyone: ${everyone}`);
}

raceResults('Doroke', 'Brian', 'Hoang', 'Nguyen', 'Cun');