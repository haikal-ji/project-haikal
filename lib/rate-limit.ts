/**
 * Rate limiter dengan dua backend:
 * - Upstash Redis: dipakai kalau UPSTASH_REDIS_REST_URL dan UPSTASH_REDIS_REST_TOKEN
 *   tersedia di environment. Konsisten di seluruh instance serverless.
 * - In-memory sliding window: fallback otomatis saat env var belum diset
 *   (lokal / development). Tidak konsisten di multi-instance serverless.
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ---------------------------------------------------------------------------
// Upstash backend — lazy singleton
// ---------------------------------------------------------------------------

let _upstashInstance: Ratelimit | null = null
let _upstashChecked = false

function getUpstashLimiter(opts: { limit: number; windowMs: number }): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) return null

  // Buat instance baru per-call karena limit/windowMs bisa beda per route.
  // Upstash SDK ringan — tidak masalah buat beberapa instance dengan prefix berbeda.
  const redis = new Redis({ url, token })
  const windowSec = Math.max(1, Math.ceil(opts.windowMs / 1000))
  const windowStr = `${windowSec} s` as Parameters<typeof Ratelimit.slidingWindow>[1]

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(opts.limit, windowStr),
    analytics: false,
    prefix: 'rl',
  })
}

// Supress unused-var warning pada module-level singleton vars
void _upstashInstance
void _upstashChecked

// ---------------------------------------------------------------------------
// In-memory fallback (sliding window)
// ---------------------------------------------------------------------------

const hitMap = new Map<string, number[]>()
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanupStaleEntries(windowMs: number) {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return

  lastCleanup = now
  const cutoff = now - windowMs

  for (const [key, timestamps] of hitMap.entries()) {
    const valid = timestamps.filter((t) => t > cutoff)
    if (valid.length === 0) {
      hitMap.delete(key)
    } else {
      hitMap.set(key, valid)
    }
  }
}

function hitRateLimitInMemory(key: string, opts: { limit: number; windowMs: number }): boolean {
  const now = Date.now()
  const windowStart = now - opts.windowMs

  const timestamps = (hitMap.get(key) || []).filter((t) => t > windowStart)

  if (timestamps.length >= opts.limit) {
    hitMap.set(key, timestamps)
    cleanupStaleEntries(opts.windowMs)
    return true
  }

  timestamps.push(now)
  hitMap.set(key, timestamps)
  cleanupStaleEntries(opts.windowMs)
  return false
}

// ---------------------------------------------------------------------------
// Core dispatcher — Upstash kalau tersedia, in-memory kalau tidak
// ---------------------------------------------------------------------------

async function hitRateLimit(key: string, opts: { limit: number; windowMs: number }): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (url && token) {
    try {
      const limiter = getUpstashLimiter(opts)
      if (limiter) {
        const { success } = await limiter.limit(key)
        return !success
      }
    } catch {
      // Upstash unreachable — fallback ke in-memory agar tidak block traffic
    }
  }

  return hitRateLimitInMemory(key, opts)
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Cek rate limit dari IP string secara langsung.
 * Dipakai di Server Actions (yang tidak punya Request object).
 * Sinkron — selalu pakai in-memory.
 */
export function checkRateLimitByIp(
  ip: string | null | undefined,
  routeKey: string,
  opts: { limit: number; windowMs: number }
): boolean {
  const safeIp = ip?.split(',')[0].trim() || 'unknown'
  return hitRateLimitInMemory(`${routeKey}:${safeIp}`, opts)
}

/**
 * Versi async dari checkRateLimitByIp — pakai Upstash kalau tersedia.
 */
export async function checkRateLimitByIpAsync(
  ip: string | null | undefined,
  routeKey: string,
  opts: { limit: number; windowMs: number }
): Promise<boolean> {
  const safeIp = ip?.split(',')[0].trim() || 'unknown'
  return hitRateLimit(`${routeKey}:${safeIp}`, opts)
}

/**
 * Cek apakah request sudah melewati rate limit. Async, kompatibel dengan Upstash.
 *
 * @param request  - Request object (untuk mengambil IP dari header)
 * @param routeKey - Identifier unik route (misal 'POST:/api/comment')
 * @param opts.limit     - Jumlah request maksimal dalam window
 * @param opts.windowMs  - Durasi window dalam milidetik
 * @param opts.identity  - (opsional) identitas custom; kalau diisi, IP diabaikan
 * @returns Promise<true> jika rate limit terlampaui (harus ditolak)
 */
export async function checkRateLimit(
  request: Request,
  routeKey: string,
  opts: { limit: number; windowMs: number; identity?: string }
): Promise<boolean> {
  let key: string

  if (opts.identity) {
    key = `${routeKey}:${opts.identity}`
  } else {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
    key = `${routeKey}:${ip}`
  }

  return hitRateLimit(key, opts)
}
