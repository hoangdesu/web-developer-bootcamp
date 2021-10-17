const cun = {
    name: 'Brian',
    hobby: 'coding'
}

// object -> JSON
const cunJSON = JSON.stringify(cun);
console.log('JSON:', cunJSON);

// JSON -> object
const cunObj = JSON.parse(cunJSON);
console.log('Object:', cunObj);

