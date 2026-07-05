const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL;
let redisClient = null;

if (redisUrl) {
  redisClient = createClient({ url: redisUrl });

  redisClient.on('error', (err) => {
    console.error('Backend Redis Client Error:', err.message || err);
  });

  redisClient.connect()
    .then(() => {
      console.log('Backend Redis Connection established successfully.');
    })
    .catch((err) => {
      console.error('Backend Redis Connection failed:', err.message || err);
    });
} else {
  console.warn('Backend Redis Warning: REDIS_URL is not defined in environment variables.');
}

module.exports = { redisClient };
