
const env = process.env.NODE_ENV || 'development';

console.log(process.env.NODE_ENV, env)

module.exports = require(`../.${env}.js`) 