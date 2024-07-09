import { createClient } from 'redis';
import log from "./logger"

const redisUrl = 'redis://localhost:6379';

const redisClient = createClient({
    url: redisUrl,
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        log.info('Redis client connected successfully');
    } catch (error) {
        log.info("Error Connecting to Redis", error)
        setTimeout(connectRedis, 5000);
    }
};

connectRedis();

export default redisClient;