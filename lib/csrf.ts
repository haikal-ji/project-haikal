/**
 * Verifikasi bahwa request datang dari origin yang sama (proteksi CSRF).
 *
 * Membaca header Origin (standar browser pada setiap mutating request).
 * Jika Origin kosong (beberapa browser lama / privacy proxy), fallback ke Referer.
 * Membandingkan hostname-nya dengan NEXT_PUBLIC_SITE_URL (production) atau
 * Host header (development).
 *
 * @returns true jika origin cocok, false jika tidak cocok atau kedua header kosong.
 */
export function verifySameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')

  // Ambil URL sumber request
  const sourceUrl = origin || referer
  if (!sourceUrl) return false

  let sourceHostname: string
  try {
    sourceHostname = new URL(sourceUrl).hostname
  } catch {
    return false
  }

  // Tentukan hostname yang diharapkan
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (siteUrl) {
    try {
      const expectedHostname = new URL(siteUrl).hostname
      return sourceHostname === expectedHostname
    } catch {
      // NEXT_PUBLIC_SITE_URL malformed, fallback ke Host header
    }
  }

  // Fallback untuk development: bandingkan dengan Host header
  const host = request.headers.get('host')
  if (!host) return false

  // Host bisa berisi port (localhost:3000), ambil hostname saja
  const expectedHostname = host.split(':')[0]
  return sourceHostname === expectedHostname
}
