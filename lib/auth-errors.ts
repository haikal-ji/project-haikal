// Helper untuk memetakan pesan error mentah Supabase Auth ke Bahasa Indonesia yang ramah pengguna
export function mapAuthError(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes('invalid login credentials')) {
    return 'Email atau password yang kamu masukkan salah. Silakan periksa kembali.'
  }
  if (lower.includes('email not confirmed')) {
    return 'Email kamu belum dikonfirmasi. Silakan cek inbox atau folder spam di email kamu.'
  }
  if (lower.includes('user already registered') || lower.includes('already exists')) {
    return 'Email ini sudah terdaftar. Silakan login atau gunakan fitur lupa password.'
  }
  if (lower.includes('password should be at least')) {
    return 'Password minimal harus 6 karakter.'
  }
  if (lower.includes('auth session missing') || lower.includes('session missing')) {
    return 'Link reset sudah kedaluwarsa atau tidak valid. Silakan minta link baru.'
  }
  if (lower.includes('rate limit') || lower.includes('once every')) {
    return 'Terlalu banyak permintaan dalam waktu singkat. Silakan tunggu sebentar sebelum mencoba lagi.'
  }
  if (lower.includes('network') || lower.includes('fetch failed')) {
    return 'Gagal terhubung ke server. Periksa koneksi internet kamu dan coba lagi.'
  }

  return message
}
