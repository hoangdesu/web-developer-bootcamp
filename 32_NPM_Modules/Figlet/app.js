const figlet = require('figlet');
const colors = require('colors');

figlet('I love Nodeeee <3', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(data.rainbow);
});
