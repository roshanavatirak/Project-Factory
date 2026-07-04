import { createClient } from "redis";

const globalForRedis = globalThis as unknown as {
  redis: ReturnType<typeof createClient> | undefined;
};

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redis =
  globalForRedis.redis ??
  createClient({
    url: redisUrl,
    socket: {
      reconnectStrategy: (retries) => {
        // Reconnect after delay
        return Math.min(retries * 100, 3000);
      }
    }
  });

redis.on("error", (err) => {
  console.error("Redis Client Error Log:", err);
});

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

// Ensure the connection is opened asynchronously
if (!redis.isOpen) {
  redis.connect().then(() => {
    console.log("Redis Client Connected successfully to Upstash");
  }).catch((err) => {
    console.error("Redis Connection failure:", err);
  });
}

export default redis;
