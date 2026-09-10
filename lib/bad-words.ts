/**
 * Bad Word Filter dengan Anti-Bypass (Normalisasi Teks)
 * Mendukung kata kasar Bahasa Indonesia dan Inggris
 */

// Kata-kata terlarang (versi "bersih" setelah normalisasi)
const BAD_WORDS = [
  // Bahasa Indonesia - umpatan umum
  'anjing', 'anj1r', 'bangsat', 'brengsek', 'bajingan', 'kampret',
  'keparat', 'sialan', 'tai', 'tahi', 'taik', 'kontol', 'memek', 'jancok',
  'jancuk', 'jangkrik', 'babi', 'celeng', 'idiot', 'goblok', 'tolol',
  'bodoh', 'bego', 'dungu', 'edan', 'gila', 'setan', 'iblis',
  'kafir', 'bangke', 'bangkai',
  // Kata-kata SARA / kebencian
  'monyet', 'kera', 'biadab',
  // Bahasa Inggris
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'damn', 'cunt',
  'dick', 'pussy', 'cock', 'whore', 'slut', 'nigga', 'nigger',
  'faggot', 'retard', 'idiot',
  // Promosi judi / spam
  'slot', 'togel', 'poker', 'bandar', 'judi',
]

/**
 * Normalisasi teks untuk mendeteksi bypass (e.g. k0nt0l, a.n.j.i.n.g, k*ntol)
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    // Hapus spasi, titik, tanda baca di antara huruf (anti: a.n.j.i.n.g)
    .replace(/[\s.\-_*|/\\,;:!?]+/g, '')
    // Ganti angka/simbol yang sering dipakai sebagai huruf (l33tspeak)
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
    // Hapus karakter non-alfanumerik yang tersisa
    .replace(/[^a-z]/g, '')
}

/**
 * Cek apakah teks mengandung kata terlarang
 * Dicek dalam dua cara: teks asli (normalized) dan tanpa spasi (normalized no-space)
 */
export function containsBadWord(text: string): boolean {
  const normalized = normalize(text)

  for (const word of BAD_WORDS) {
    const normalizedWord = normalize(word)
    if (normalized.includes(normalizedWord)) {
      return true
    }
  }
  return false
}
