const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
}

export function checkRateLimit(key: string, config: RateLimitConfig): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const fullKey = `${config.keyPrefix || 'rl'}:${key}`;
  const entry = rateLimitStore.get(fullKey);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(fullKey, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt: now + config.windowMs };
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt };
}

export const RATE_LIMITS = {
  login: { windowMs: 15 * 60 * 1000, maxRequests: 5, keyPrefix: 'login' },
  register: { windowMs: 60 * 60 * 1000, maxRequests: 3, keyPrefix: 'register' },
  passwordReset: { windowMs: 60 * 60 * 1000, maxRequests: 3, keyPrefix: 'pwreset' },
  oauth: { windowMs: 15 * 60 * 1000, maxRequests: 10, keyPrefix: 'oauth' },
  csvUpload: { windowMs: 60 * 60 * 1000, maxRequests: 5, keyPrefix: 'csv' },
  aiGeneration: { windowMs: 60 * 60 * 1000, maxRequests: 20, keyPrefix: 'ai' },
  imageGeneration: { windowMs: 60 * 60 * 1000, maxRequests: 10, keyPrefix: 'img' },
  adminLogin: { windowMs: 15 * 60 * 1000, maxRequests: 10, keyPrefix: 'adminlogin' },
  adminAction: { windowMs: 60 * 60 * 1000, maxRequests: 100, keyPrefix: 'adminaction' },
} as const;

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000);
