import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

export function createRateLimiter({ windowMs, maxRequests }: RateLimitOptions) {
  const buckets = new Map<string, Bucket>();

  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    const key = req.user?.sub || req.ip || "anonymous";
    const now = Date.now();
    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (existing.count >= maxRequests) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((existing.resetAt - now) / 1000)
      );
      res.setHeader("Retry-After", String(retryAfterSeconds));
      res.status(429).json({
        code: "RATE_LIMIT",
        error: "Muitas requisições em pouco tempo. Aguarde antes de tentar novamente.",
      });
      return;
    }

    existing.count += 1;
    next();
  };
}
