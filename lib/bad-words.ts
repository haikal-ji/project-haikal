/**
 * Bad Word Filter dengan Word-Boundary & Anti-Bypass
 * Mendukung kata kasar Bahasa Indonesia dan Inggris
 */

// Helper escape regex
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Ganti karakter leetspeak ke huruf normal
function replaceLeet(text: string): string {
  return text
    .toLowerCase()
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/6/g, 'g')
    .replace(/7/g, 't')
    .replace(/8/g, 'b')
    .replace(/9/g, 'g')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/\+/g, 't')
}

// 1. Kata kasar eksplisit / berat:
// Dicek baik dengan word boundary MAUPUN pada versi tanpa-spasi (compact)
// untuk mencegah bypass seperti "k0nt0l", "a.n.j.i.n.g", "k 0 n t 0 l"
// Kata-kata ini tidak punya risiko jadi substring kata sah dalam bahasa Indonesia/Inggris
const SEVERE_WORDS = [
  // Seksual & organ genital vulgar
  'kontol', 'memek', 'pantek', 'itil', 'pepek', 'peler', 'jembut',
  'ngentot', 'entot', 'tempik',
  // Umpatan kasar / hewan peyoratif
  'anjing', 'anjir', 'anj1r', 'bangsat', 'bajingan', 'brengsek',
  'keparat', 'kampret', 'biadab',
  // Kotoran
  'tai', 'taik', 'tahi',
  // Bahasa daerah kasar
  'jancok', 'jancuk', 'dancok',
  // Bahasa Inggris eksplisit
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'cunt',
  'dick', 'pussy', 'whore', 'slut', 'nigger', 'nigga', 'faggot',
]

// 2. Kata celaan standar / ambigu / frasa judi:
// HANYA dicocokkan dengan word boundary (\bkata\b) pada teks bertanda spasi.
// TIDAK PERNAH dicocokkan tanpa-spasi agar tidak menimbulkan false-positive.
// Catatan:
// - Kata umum seperti "gila" dikeluarkan dari daftar karena sering dipakai sebagai seruan positif ("gila keren banget").
// - Kata "bandar" dan "slot" hanya dicek dalam frasa judi agar tidak memblokir "bandar udara" atau "slot waktu".
const STANDARD_WORDS = [
  // Hinaan / celaan personal
  'babi', 'celeng', 'idiot', 'goblok', 'tolol', 'bodoh', 'bego', 'dungu', 'edan',
  'monyet', 'bangke', 'retard', 'damn', 'cock', 'kafir', 'setan', 'iblis',
  // Judi spesifik
  'togel', 'poker', 'judi',
  // Frasa promosi judi (mencegah false-positive pada "slot waktu" atau "bandar udara")
  'slot gacor', 'judi slot', 'situs slot', 'slot online', 'link slot', 'agen slot', 'daftar slot', 'bocoran slot', 'pola slot', 'rtp slot',
  'bandar judi', 'bandar togel', 'bandar slot', 'bandar bola', 'bandar casino', 'bandar darat', 'bandar online',
]

/**
 * Normalisasi teks dengan mempertahankan spasi (mengganti simbol/pemisah menjadi spasi)
 */
function normalizeWithSpaces(text: string): string {
  const leet = replaceLeet(text)
  return leet.replace(/[^a-z0-9]+/g, ' ').trim()
}

/**
 * Normalisasi teks tanpa spasi dan tanpa simbol sama sekali (compact)
 */
function normalizeCompact(text: string): string {
  const leet = replaceLeet(text)
  return leet.replace(/[^a-z0-9]/g, '')
}

/**
 * Cek apakah teks mengandung kata terlarang
 */
export function containsBadWord(text: string): boolean {
  if (!text || !text.trim()) return false

  const spacedText = normalizeWithSpaces(text)

  // 1. Cek word-boundary matching pada teks dengan spasi
  const allBoundaryWords = [...SEVERE_WORDS, ...STANDARD_WORDS]
  for (const word of allBoundaryWords) {
    const pattern = new RegExp(`\\b${escapeRegex(word)}\\b`, 'i')
    if (pattern.test(spacedText)) {
      return true
    }
  }

  // 2. Cek anti-bypass (teks tanpa spasi) HANYA untuk SEVERE_WORDS
  // Menangkap varian seperti "a.n.j.i.n.g", "a n j i n g", "k-o-n-t-o-l"
  // Tanpa memicu false-positive pada kata ambigu seperti "bandar udara" atau "slot waktu"
  const compactText = normalizeCompact(text)
  for (const word of SEVERE_WORDS) {
    const compactWord = normalizeCompact(word)
    if (compactText.includes(compactWord)) {
      return true
    }
  }

  return false
}
