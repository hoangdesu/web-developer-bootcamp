console.log("Hi!");

setTimeout(() => {
    console.log("...are you still there?");
}, 1000);

console.log('Hmmm'); // this will get executed first

let counter = 1;

const id = setInterval(() => {
    console.log(counter);
    console.log(Math.random());
    counter++;
    if (counter > 5) clearInterval(id);
}, 1000);
