import test from 'node:test'
import assert from 'node:assert/strict'
import { containsBadWord } from './bad-words.ts'

test('Bad Word Filter: Validasi False Positive (Tidak Boleh Ke-flag)', () => {
  assert.equal(containsBadWord('bandar udara'), false, '"bandar udara" tidak boleh ke-flag')
  assert.equal(containsBadWord('Bandar Lampung indah'), false, '"Bandar Lampung" tidak boleh ke-flag')
  assert.equal(containsBadWord('slot waktu kosong'), false, '"slot waktu kosong" tidak boleh ke-flag')
  assert.equal(containsBadWord('Gila keren banget pembahasannya!'), false, '"gila" seruan positif tidak boleh ke-flag')
  assert.equal(containsBadWord('Artikel ini sangat membantu'), false, 'Teks normal tidak boleh ke-flag')
  assert.equal(containsBadWord('kebodohan manusiawi'), false, '"kebodohan" tidak boleh ke-flag')
})

test('Bad Word Filter: Validasi True Positive (Harus Ke-flag)', () => {
  assert.equal(containsBadWord('anjing kamu'), true, '"anjing kamu" harus ke-flag')
  assert.equal(containsBadWord('dasar bangsat'), true, '"bangsat" harus ke-flag')
  assert.equal(containsBadWord('dasar bodoh'), true, '"bodoh" sebagai kata tunggal harus ke-flag')
  assert.equal(containsBadWord('main slot gacor hari ini'), true, '"slot gacor" harus ke-flag')
  assert.equal(containsBadWord('gabung bandar judi'), true, '"bandar judi" harus ke-flag')
})

test('Bad Word Filter: Validasi Anti-Bypass (Harus Ke-flag)', () => {
  assert.equal(containsBadWord('k0nt0l'), true, 'Leetspeak "k0nt0l" harus ke-flag')
  assert.equal(containsBadWord('k.0.n.t.0.l'), true, 'Pemisah titik "k.0.n.t.0.l" harus ke-flag')
  assert.equal(containsBadWord('a.n.j.i.n.g'), true, 'Pemisah titik "a.n.j.i.n.g" harus ke-flag')
  assert.equal(containsBadWord('a n j i n g'), true, 'Pemisah spasi "a n j i n g" harus ke-flag')
})
