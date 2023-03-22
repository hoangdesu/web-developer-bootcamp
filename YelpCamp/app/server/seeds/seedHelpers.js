const fs = require('fs');

module.exports.getAllCitiesData = () => {
    const content = fs.readFileSync('./vn.json', 'utf-8');
    return JSON.parse(content);
}
