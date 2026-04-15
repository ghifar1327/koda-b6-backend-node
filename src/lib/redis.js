import { createClient } from "redis";

let redisClient = null;

export async function initRedis() {
  if (redisClient) {
    return redisClient;
  }

  redisClient = createClient({
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  });

  redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err);
  });

  redisClient.on("connect", () => {
    console.log("Connected to Redis");
  });

  await redisClient.connect();
  return redisClient;
}

export function getRedisClient() {
  if (!redisClient) {
    throw new Error(
      "Redis client not initialized. Call initRedis() first."
    );
  }
  return redisClient;
}

export async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

// Cache utility functions
export async function getCache(key) {
  try {
    const client = getRedisClient();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting cache:", error);
    return null;
  }
}

export async function setCache(key, value, ttl = 3600) {
  try {
    const client = getRedisClient();
    await client.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error("Error setting cache:", error);
  }
}

export async function deleteCache(key) {
  try {
    const client = getRedisClient();
    await client.del(key);
  } catch (error) {
    console.error("Error deleting cache:", error);
  }
}

export async function clearCachePattern(pattern) {
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    console.error("Error clearing cache pattern:", error);
  }
}
