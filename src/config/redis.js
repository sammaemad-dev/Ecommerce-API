const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (e) => {
  throw new Error(`Redis Client Error`, e);
});

redisClient.on("connect", () => {
  console.log(`Redis Client Connected`);
});

module.exports = redisClient;
