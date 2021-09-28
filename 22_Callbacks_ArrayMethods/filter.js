// const nums = [1,2,3,4,5,6,7]
//
// const smallNums = nums.filter(n => n < 5);
// const largeNums = nums.filter(num => (num > 4));
// const largeNumsDouble = largeNums.map(n => n * 2);
//
// console.log(smallNums);
// console.log(largeNums)
// console.log(largeNumsDouble);


// const validUserNames = (usernamesArr) => {
//     return usernamesArr.filter(name => name.length < 10);
// }

const validUserNames = arr => arr.filter(name => name.length < 10);

const usernames = ['mark', 'staceymóm978', 'q983947947192', 'doroke', 'MoanaFan'];
const val = validUserNames(usernames);
console.log(val);
