// file for redis client creation
const { createClient } = require('redis');

const client = createClient();

client.on('error', () => {
  console.log('Redis Client Error', err)
});

module.exports = {
  client
}