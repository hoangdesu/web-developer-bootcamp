const myMeth =  {
    PI      : 3.1415,
    // normal syntax
    randInt : function(min, max) {
        return Math.floor(Math.random() * max) + min;
    },
    // shorthand syntax
    sqrt(num) {
        return Math.sqrt(num);
    }
}

for (let i = 0; i < 10; i++) {
    let random = myMeth.randInt(1, 30);
    let sqrt = myMeth.sqrt(random);
    // console.log(`Run #${i+1}: Sqrt of ${random} = ${sqrt}`);
}

// 'this'

const Hoang = {
    firstName        :   'Hoang',
    engFirstName    :   'Brian',
    lastName        :   'Nguyen',
    getFullEnglishName() {
        return this.engFirstName + ' ' + this.lastName;
    },
    getThis() {
        return this;
    }
}

console.log(Hoang.getFullEnglishName());
console.log(Hoang.getThis());
console.log(this);

const meh = Hoang.getFullEnglishName;
console.log(meh()); // undefined



