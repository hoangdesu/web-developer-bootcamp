// isEven() -> bool
// factorial() -> int
// kebabToSnake() -> str

function isEven(num) {
    if (num % 2 === 0) {
        return true;
    }
    return false;
}

console.log(isEven(2));
console.log(isEven(3));

function factorial(num) {
    let result = 1;
    for (num; num > 0; num--) {
        result *= num;
    }
    return result;
}

console.log(factorial(3));
console.log(factorial(5));

function kebabToSnake(str) {
    let newStr = '';
    for (let char of str) {
        if (char === '-') {
            char = '_'
        }
        newStr += char;
    }
    return newStr;
}

console.log(kebabToSnake("zed-the-master-of-shadow"));