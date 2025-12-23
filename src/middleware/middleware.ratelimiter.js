const ratelimitmap = new Map();
//* configuring constants
const WINDOW_SIZE_IN_MS = 60 * 1000;
const MAX_REQUESTS = 5;
const GARBAGE_CLEANUP_INTERVAL = 5 * 60 * 1000;
//* Garbage collection for Rate limit map
setInterval(() => {
    const now = Date.now();

    ratelimitmap.forEach((value, key) => {
        if (now - value.startTime > GARBAGE_CLEANUP_INTERVAL) {
            ratelimitmap.delete(key);
        }
    });
}, GARBAGE_CLEANUP_INTERVAL);
// * Rate limiter function
export const ratelimiter = (req, res, next) => {
    const ip = req.ip;

    const currentTime = Date.now();

    if (!ratelimitmap.has(ip)) {
        ratelimitmap.set(ip, {
            count: 1,
            startTime: currentTime,
        });
        return next();
    }

    const record = ratelimitmap.get(ip);
    const timeelapsed = currentTime - record.startTime;

    if (timeelapsed > WINDOW_SIZE_IN_MS) {
        ratelimitmap.set(ip, {
            count: 1,
            startTime: currentTime,
        });
    }

    // Increment count before checking, as the current request is part of the count
    record.count += 1;

    if (record.count > MAX_REQUESTS) {
        // Check against record.count
        const retryAfterSeconds = Math.ceil((WINDOW_SIZE_IN_MS - timeelapsed) / 1000);
        return res.status(429).json({
            // Use res.status().json()
            message: `Too many requests, please try again after ${retryAfterSeconds} seconds.`,
            retryAfter: retryAfterSeconds,
        });
    }

    return next();
};
