const { me } = require('./myCustomModule');

console.log(me);
console.log(me.firstName);
console.log(me.introduce());
console.log(me.hobby);


const myModule = require('./myCustomModule');
console.log('My exported module:', myModule);
myModule.hi();


// -- requiring a whole directory --
const mainChamps = require('./champs');
console.log('All champs from folder:', mainChamps); 