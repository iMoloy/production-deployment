/**
 * In-Memory Sliding-Window Rate Limiter
 * 
 * Protects AI streaming routes against automated credit draining and denial-of-wallet attacks.
 * Tracks timestamps per client IP within a sliding time window.
 */

interface RateLimitRecord {
  timestamps: number[]
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetInSec: number
}

class SlidingWindowRateLimiter {
  private storage = new Map<string, RateLimitRecord>()
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests = 5, windowSec = 60) {
    this.maxRequests = maxRequests
    this.windowMs = windowSec * 1000

    // Cleanup stale entries every 5 minutes to prevent memory leaks
    if (typeof setInterval !== 'undefined') {
      const timer = setInterval(() => this.cleanup(), 5 * 60 * 1000)
      if (typeof timer.unref === 'function') {
        timer.unref()
      }
    }
  }

  /**
   * Check if a client IP is allowed to make a request.
   */
  public check(identifier: string): RateLimitResult {
    const now = Date.now()
    const windowStart = now - this.windowMs

    let record = this.storage.get(identifier)
    if (!record) {
      record = { timestamps: [] }
      this.storage.set(identifier, record)
    }

    // Retain only timestamps within the current sliding window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart)

    if (record.timestamps.length >= this.maxRequests) {
      const oldestInWindow = record.timestamps[0]
      const resetInSec = Math.max(1, Math.ceil((oldestInWindow + this.windowMs - now) / 1000))

      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        resetInSec,
      }
    }

    // Record this request timestamp
    record.timestamps.push(now)

    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - record.timestamps.length,
      resetInSec: Math.ceil(this.windowMs / 1000),
    }
  }

  /**
   * Remove records where all timestamps are outside the active window.
   */
  private cleanup(): void {
    const windowStart = Date.now() - this.windowMs
    for (const [key, record] of this.storage.entries()) {
      record.timestamps = record.timestamps.filter((ts) => ts > windowStart)
      if (record.timestamps.length === 0) {
        this.storage.delete(key)
      }
    }
  }

  /**
   * Diagnostic telemetry for monitoring.
   */
  public getTelemetry() {
    return {
      activeClients: this.storage.size,
      maxRequestsPerWindow: this.maxRequests,
      windowDurationSeconds: this.windowMs / 1000,
    }
  }
}

// Global singleton instance configured for production hygiene (5 requests per 60 seconds)
const maxReq = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5', 10)
const winSec = parseInt(process.env.RATE_LIMIT_WINDOW_SEC || '60', 10)

export const rateLimiter = new SlidingWindowRateLimiter(maxReq, winSec)

/**
 * Extracts the real client IP from incoming Next.js Request headers.
 */
export function extractClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim()
    if (firstIp) return firstIp
  }

  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  const cfIp = req.headers.get('cf-connecting-ip')
  if (cfIp) return cfIp.trim()

  return '127.0.0.1'
}
