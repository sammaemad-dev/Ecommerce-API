async function removeCacheKey(key) {
  const cached = await redisClient.get(key);
  if (cached) {
    await redisClient.del(cached);
  }
}

module.exports = removeCacheKey;
