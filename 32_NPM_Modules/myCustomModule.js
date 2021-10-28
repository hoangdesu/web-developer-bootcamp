const firstName = 'Hoang';
const lastName = 'Nguyen';

const introduce = () => {
    return `My name is ${firstName} ${lastName}`;
}

const hobby = 'coding';
module.exports.hi = () => {
    console.log("Hello from the other sideeeeeee");
}

// exporting the object me containing all content in this file
module.exports.me = {
    firstName: firstName,
    lastName: lastName,
    introduce: introduce
}

// shortcut exports
// exports.me = {
//     firstName: firstName,
//     lastName: lastName,
//     introduce: introduce,
//     hobby: hobby
// };

exports.me.hobby = hobby;