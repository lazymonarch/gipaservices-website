import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const isRedisConfigured = Boolean(redisUrl && redisToken);
let hasWarnedAboutRateLimitConfig = false;

const redis = isRedisConfigured
  ? new Redis({
      url: redisUrl,
      token: redisToken,
    })
  : null;

type LimiterLike = Pick<Ratelimit, "limit">;

const allowAllLimiter: LimiterLike = {
  async limit() {
    if (!hasWarnedAboutRateLimitConfig) {
      console.warn(
        "Rate limiting is disabled: UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is missing.",
      );
      hasWarnedAboutRateLimitConfig = true;
    }

    return {
      success: true,
      remaining: Number.MAX_SAFE_INTEGER,
      limit: Number.MAX_SAFE_INTEGER,
      reset: Date.now() + 60_000,
      pending: Promise.resolve(),
    } as Awaited<ReturnType<Ratelimit["limit"]>>;
  },
};

export const contactLimiter: LimiterLike = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      analytics: true,
    })
  : allowAllLimiter;

export const driverLimiter: LimiterLike = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "30 m"),
      analytics: true,
    })
  : allowAllLimiter;

export function getIP(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}
