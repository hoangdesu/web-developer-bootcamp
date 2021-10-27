// file system module

const fs = require('fs');
const process = require('process');

// console.log(fs);

// -> async version - bit more complicated but doesn't block other processes
// fs.mkdir('./Project', { recursive: true }, err => {
//     if (err) throw err;
//     console.log('Folder "Project" has been created');
// });

// -> sync version - simple, but blocks everything if heavy
// fs.mkdirSync('Project');

// console.log('This line comes after mkdir');

// -- Code to create a boilerplate project folder
// Project folder will be created relatively to where the file is run
let folder = process.argv[2] || 'unnamed';
folder += ' (auto generated)';
// remove if folder exists
if (fs.existsSync(folder)) {
    fs.rmdirSync(folder, { recursive: true });
    console.log('Old folder has been removed');
}
fs.mkdirSync(`./${folder}`);

try {
    fs.writeFileSync(`./${folder}/index.html`, '');
    fs.writeFileSync(`./${folder}/app.js`, '');
    fs.writeFileSync(`./${folder}/style.css`, '');
} catch(e) {
    console.log(e);
}

console.log(`"${folder}" folder has been created!`);
