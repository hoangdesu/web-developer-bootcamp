async function hi() {
    return 'Hey guys!';
}

const returnedHi = hi(); // returns a promise with returned value
console.log(returnedHi); 

// for arrow function
const sing = async () => 'là lá la';

// can chain then() normally
sing().then((data) => {
    let s = ''
    for(let i = 0; i < 3; i++) {
        s += data;
        s += ' ';
    }
    console.log(s, '=))');
})

// async function throwing error
const throwError = async () => {
    throw new Error('failed :<'); // throw an error object
    // throw 'failed :(('; // or can simply throw a string
}

// gotta catch 'em all!
throwError().catch(err => console.log(err));


const login = async (username, password) => {
    if (!username || !password) throw new Error('Missisng credentials');
    if (password === 'doroke') return 'LOGIN SUCCESFULLY!';
    throw new Error('Invalid password');
}

login('doroke')
    .then(data => console.log(data))
    .catch(err => console.log(err));

login('doroke', 'idk man')
    .then(data => console.log(data))
    .catch(err => console.log(err));

login('doroke', 'doroke')
    .then(data => console.log(data))
    .catch(err => console.log(err));
    


// *****   async - await   *****

// NOTES: the changeBody function will NOT work because PromiseResult is undefined
// and the promise is fulfilled
const changeBody = async (color, delay) => {
    setTimeout(() => {
        document.body.style.backgroundColor = color;
        return color;
    }, delay)
}

// this function works because the promise is still pending
// and it has PromiseResult set to 'pink'
const changeBodyColor = (color, delay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            document.body.style.backgroundColor = color;
            const h2 = document.createElement('h2');
            h2.innerText = color;
            document.body.append(h2);
            resolve(color); 
        }, delay);
    })
}

console.log("CHANGE BODY:", changeBody('pink', 1000));
console.log("CHANGE BODY COLOR:", changeBodyColor('pink', 1000));

async function makeRainbow() {
    await changeBodyColor('red', 1000);
    await changeBodyColor('green', 1000);   // this line will only run after the first line finished
    await changeBodyColor('blue', 1000);    // same for this
    await changeBodyColor('pink', 1000);    // same for all below
    await changeBodyColor('violet', 1000); 
    await changeBodyColor('purple', 1000); 
    await changeBodyColor('yellow', 1000);
    return 'ma chịchhhh 🌈';
}

// using Promises style
makeRainbow()
    .then(data => console.log(data));

// or using async style
// since makeRainbow is an async that returns a Promise
// it can be await in another async function
const makeRainbowAsync = async () => {
    await makeRainbow();
    console.log("Làm màu xong chưa má :/");
}

// if 2 same Promises are executed, they will be run at the same time!
makeRainbowAsync();


const getRand = () => {
    return new Promise((resolve, reject) => {
        const rand = Math.random();
        if (rand >= 0.5) {
            resolve('YOU WIN!!');
        }
        reject('You lose :(')
    })
}

// use try-catch to handle errors
async function lottery() {
    try {
        let result = await getRand();
        console.log('Result 1:', result);
        let result2 = await getRand();
        console.log('Result 2:', result2);
    }
    catch(e) {
        console.log('Catching error:', e);
    }
}

lottery();