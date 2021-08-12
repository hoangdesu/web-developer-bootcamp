const array1 = [1,2,3];
const array2 = [4,5,6];
console.log(array1 + array2);
console.log(array1.concat(array2)); // different!
console.log(array1.includes(2));
console.log(array2.indexOf(5));
console.log(array2.reverse());
const food = ['bún bò', 'hủ tíu', 'bún riêu', 'bún đậu mắm tôm', 'tà tưa', 'phở']
console.log(food.slice(2, 5));
const favFood = food.splice(3, 2); // Remove 2 items from index 3
console.log(favFood);
food.splice(1, 0, 'cơm tấm', 'bánh mì'); // insert 2 items at index 1, remove 0 items
console.log(food);

const games = [
    [1, "League of Legends"],
    [2, "Ori and the blind forest"]
];

console.log(games[0][1]);
