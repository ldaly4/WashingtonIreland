const buckets = new Map();

export function rateLimit(request, key, limit = 20, windowMs = 60 * 60 * 1000) {
  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for") || "unknown";
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();
  const current = buckets.get(bucketKey) || { count: 0, resetAt: now + windowMs };
  if (now > current.resetAt) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (current.count >= limit) return { ok: false, resetAt: current.resetAt };
  current.count += 1;
  buckets.set(bucketKey, current);
  return { ok: true };
}
