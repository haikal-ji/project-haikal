/**
 * Rate limiter sederhana berbasis sliding window in-memory (tanpa dependency eksternal).
 *
 * CATATAN PENTING:
 * Solusi in-memory ini TIDAK akan konsisten di lingkungan serverless multi-instance
 * (seperti Vercel), karena setiap instance punya Map-nya sendiri. Untuk produksi
 * yang lebih serius, sebaiknya gunakan:
 * - Upstash Redis (@upstash/ratelimit)
 * - Proteksi di level CDN (Cloudflare Rate Limiting, Vercel WAF)
 *
 * Untuk project personal / traffic rendah ini, solusi in-memory sudah cukup memadai
 * sebagai lapisan pertahanan dasar.
 */

// Map<key, timestamp[]> — menyimpan timestamp request per IP+route
const hitMap = new Map<string, number[]>()

// Bersihkan entry lama setiap 5 menit supaya Map tidak membengkak
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

/**
 * Cek apakah request sudah melewati rate limit.
 *
 * @param request - Request object (untuk mengambil IP)
 * @param routeKey - Identifier unik route (misal 'POST:/api/comment')
 * @param opts.limit - Jumlah request maksimal dalam window
 * @param opts.windowMs - Durasi window dalam milidetik
 * @returns true jika rate limit terlampaui (harus ditolak), false jika masih aman
 */
export function checkRateLimit(
  request: Request,
  opts: { limit: number; windowMs: number; identity?: string }
): boolean
export function checkRateLimit(
  request: Request,
  routeKey: string,
  opts: { limit: number; windowMs: number; identity?: string }
): boolean
export function checkRateLimit(
  request: Request,
  arg2: string | { limit: number; windowMs: number; identity?: string },
  arg3?: { limit: number; windowMs: number; identity?: string }
): boolean {
  let routeKey: string
  let opts: { limit: number; windowMs: number; identity?: string }

  if (typeof arg2 === 'string') {
    routeKey = arg2
    opts = arg3!
  } else {
    try {
      const url = new URL(request.url)
      routeKey = `${request.method}:${url.pathname}`
    } catch {
      routeKey = `${request.method}:unknown`
    }
    opts = arg2
  }

  let key: string
  if (opts.identity) {
    key = `${routeKey}:${opts.identity}`
  } else {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
    key = `${routeKey}:${ip}`
  }

  const now = Date.now()
  const windowStart = now - opts.windowMs

  // Ambil timestamps yang masih dalam window
  const timestamps = (hitMap.get(key) || []).filter((t) => t > windowStart)

  if (timestamps.length >= opts.limit) {
    hitMap.set(key, timestamps)
    cleanupStaleEntries(opts.windowMs)
    return true // rate limit terlampaui
  }

  timestamps.push(now)
  hitMap.set(key, timestamps)
  cleanupStaleEntries(opts.windowMs)
  return false // masih aman
}
