const path = require('path');
const envPath = path.join(__dirname, `./.env.${process.env.NODE_ENV}`);
require('dotenv').config({ path: envPath });

console.log('envPath:', envPath);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NAME:', process.env.NAME);
