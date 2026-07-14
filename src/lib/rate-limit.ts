/**
 * Lightweight in-memory rate limiter.
 *
 * This is process-local, which is fine for a single-instance deployment
 * (e.g. one Vercel/Docker container). If you scale horizontally, swap the
 * `store` map for Redis (e.g. Upstash) behind the same `check()` interface.
 */

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

// Periodically clear stale buckets so memory doesn't grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of store.entries()) {
    if (bucket.resetAt < now) store.delete(key);
  }
}, 5 * 60_000).unref?.();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  key: string,
  { windowMs, max }: { windowMs: number; max: number },
): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: max - 1, resetAt: now + windowMs };
  }

  if (bucket.count >= max) {
    return { success: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { success: true, remaining: max - bucket.count, resetAt: bucket.resetAt };
}
