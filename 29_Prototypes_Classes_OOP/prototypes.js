const arr = [1,2,3];

console.log(arr.__proto__);

arr.sing = () => {
    console.log('la la');
}

arr.sing()
arr.push(5)
console.log(arr);

console.dir(document)

console.dir(Array.prototype)

String.prototype.xinChao = function() {
    console.log('Xin chao', this.toUpperCase());
}

const myName= 'Hoang';
myName.xinChao();

Array.prototype.pop = function() {
    console.log('corn');
}

arr.pop(); // corn