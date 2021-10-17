const { log } = require('console');
const process = require('process');

console.log(process.version);
console.log(process.release);
console.log(process.cwd());
console.log(process.argv);
console.log(process.argv0);

for (let i = 2; i < process.argv.length; i++) {
    log(`Hi ${process.argv[i]}!`);
}

// or can use array slicing
const names = process.argv.slice(2);
for (let name of names) {
    log(`Have a good day, ${name}`);
}