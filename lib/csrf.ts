/**
 * Verifikasi bahwa request datang dari origin yang sama (proteksi CSRF).
 *
 * Membaca header Origin (standar browser pada setiap mutating request).
 * Jika Origin kosong (beberapa browser lama / privacy proxy), fallback ke Referer.
 * Membandingkan hostname-nya dengan NEXT_PUBLIC_SITE_URL (production) atau
 * Host / x-forwarded-host header (development / behind proxy).
 *
 * @returns true jika origin cocok, false jika tidak cocok atau kedua header kosong.
 */
export function verifySameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')

  // Browser di sandboxed iframe / privacy mode kadang kirim string literal "null"
  const rawSource = origin || referer
  if (!rawSource || rawSource === 'null') return false

  let sourceHostname: string
  try {
    sourceHostname = new URL(rawSource).hostname
  } catch {
    return false
  }

  // Production: bandingkan dengan NEXT_PUBLIC_SITE_URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (siteUrl && siteUrl !== 'null') {
    try {
      const expectedHostname = new URL(siteUrl).hostname
      return sourceHostname === expectedHostname
    } catch {
      // NEXT_PUBLIC_SITE_URL malformed, lanjut ke fallback
    }
  }

  // Fallback development / behind reverse proxy:
  // x-forwarded-host lebih akurat saat di balik proxy (Vercel, Nginx, dll.)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const hostHeader = request.headers.get('host')
  const rawHost = forwardedHost || hostHeader
  if (!rawHost) return false

  // Hilangkan port jika ada (localhost:3000 → localhost)
  const expectedHostname = rawHost.split(':')[0]
  return sourceHostname === expectedHostname
}
