/**
 * Rate limiter simple en mémoire
 * ⚠️ Pour la production, utilisez Redis (Upstash)
 */

const attempts = new Map<string, { count: number; reset: number }>();

interface RateLimitOptions {
  maxAttempts: number;
  windowMs: number;
}

export function rateLimit(
  key: string,
  { maxAttempts = 10, windowMs = 60_000 }: RateLimitOptions
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = attempts.get(key);

  // Reset si la fenêtre est expirée
  if (!entry || entry.reset < now) {
    attempts.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1, resetIn: windowMs };
  }

  // Limite atteinte
  if (entry.count >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.reset - now,
    };
  }

  // Incrémenter
  entry.count++;
  return {
    allowed: true,
    remaining: maxAttempts - entry.count,
    resetIn: entry.reset - now,
  };
}
