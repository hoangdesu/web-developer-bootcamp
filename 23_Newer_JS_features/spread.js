const nums = [1, 2, 3, 4, 5];

console.log(nums);
console.log(...nums);

// in function calls
console.log(Math.max(nums));
console.log(Math.max(...nums));

// each character is separated 
console.log(...'Hello World!!!');

// in array literals
const nums2 = [10, 9, 8];

const allNums = [...nums, ...nums2];
console.log(allNums);

// in object literals

const me = {
    firstName: 'Hoang',
    lastName: 'Nguyen',
    fullName: function() {
        return `${this.firstName} ${this.lastName}`;
    }
};

const newMe = {
    ...me,
    job: 'developer'
}

console.log({...me});
console.log(newMe);

// spreading iterables into object
console.log({...[5,6,7,8]});
console.log({..."wassup!"});