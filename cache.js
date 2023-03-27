const redis = require('redis');
const client = redis.createClient({
    legacyMode: true
});

client
  .connect()
  .then(async (res) => {
    console.log('connected');
  })
  .catch((err) => {
    console.log('err happened' + err);
  });
  
module.exports = client;