// Factory function
function makeColor(r, g, b) {
    const color = {};
    color.r = r;
    color.g = g;
    color.b = b;
    
    color.rgb = function() {
        const { r, g, b } = this;
        return `rgb(${r}, ${g}, ${b})`;
    }

    color.hex = function() {
        const { r, g, b } = this;
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    return color;
}

const red = makeColor(255, 5, 7);
console.log(red.rgb()); // rgb(255, 5, 7)
console.log(red.hex()); // #ff0507

const blue = makeColor(10, 20, 200);
console.log(red.hex === blue.hex); // expects true, gets false

console.log('hi'.charAt === 'bye'.charAt); // true, pointing at the same reference


// Constructor functions
function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

Color.prototype.rgb = function() {
    const { r, g, b } = this;
    return `rgb(${r}, ${g}, ${b})`;
}

const color1 = new Color(1, 2, 3);
console.log(color1.rgb());

const color2 = new Color(4, 5, 6);
console.log(color1.rgb === color2.rgb); // true


// OOP
class Cat {
    constructor(name, breed) {
        this.name = name;
        this.breed = breed;
    }

    // methods
    meow() {
        console.log(`${this.name} meowww`);
    }
    sayHi = () => {
        console.log(this.name);
    }

    // getter: fullName is a property in this class
    get fullName() {
        return this.name + ' the kitty';
    }
}

const myKitty = new Cat('Zed', 'British short hair');
myKitty.meow();
myKitty.sayHi();
console.log(myKitty.fullName);


// nobody does this!!!
Cat.prototype.play = function() {
    console.log('hahaha');
}
myKitty.play();


// other ways of defining classes
// Declaration
class Rectangle1 {
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }
}

// Expression; the class is anonymous but assigned to a variable
const Rectangle2 = class {
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }
};

// Expression; the class has its own name
const Rectangle3 = class MyRectangle {
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }
};

// can't use this syntax like object
const obj = {
    thisWorks: function() {
    }
}