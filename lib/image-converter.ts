/**
 * Mengonversi dan mengompresi gambar (termasuk foto HEIC kamera iPhone & foto resolusi tinggi)
 * menjadi JPEG standar yang kompatibel dengan semua browser (Windows, Chrome, Edge, Safari, Android).
 */

/**
 * Konversi menggunakan HTML5 Canvas native.
 * Pada iPhone / iOS Safari, Safari memiliki kemampuan native hardware-accelerated
 * untuk membaca format HEIC dan foto kamera secara instan (< 100ms).
 */
async function convertViaNativeCanvas(file: File): Promise<File | null> {
  if (typeof window === 'undefined') return null

  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(file)
      const img = new Image()

      // Timeout 4 detik agar tidak pernah stuck/hang
      const timer = setTimeout(() => {
        URL.revokeObjectURL(url)
        resolve(null)
      }, 4000)

      img.onload = () => {
        clearTimeout(timer)
        URL.revokeObjectURL(url)
        try {
          let width = img.naturalWidth || img.width
          let height = img.naturalHeight || img.height

          if (!width || !height) {
            resolve(null)
            return
          }

          // Batasi resolusi maksimal 2048px agar ukuran file hemat (< 800KB)
          // dan tidak menyebabkan memori crash pada browser HP
          const MAX_DIM = 2048
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width)
              width = MAX_DIM
            } else {
              width = Math.round((width * MAX_DIM) / height)
              height = MAX_DIM
            }
          }

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve(null)
            return
          }

          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (blob && blob.size > 0) {
                // Buat nama file bersih dengan ekstensi .jpeg
                const baseName = file.name
                  .replace(/\.(heic|heif|jpeg|jpg|png|webp)$/i, '')
                  .replace(/[^a-zA-Z0-9_-]/g, '_')
                const newFileName = `${baseName || 'photo'}.jpeg`

                resolve(new File([blob], newFileName, { type: 'image/jpeg' }))
              } else {
                resolve(null)
              }
            },
            'image/jpeg',
            0.85
          )
        } catch (err) {
          console.warn('Native canvas conversion error:', err)
          resolve(null)
        }
      }

      img.onerror = () => {
        clearTimeout(timer)
        URL.revokeObjectURL(url)
        resolve(null)
      }

      img.src = url
    } catch {
      resolve(null)
    }
  })
}

/**
 * Fallback konversi HEIC via heic2any untuk browser desktop (seperti Chrome di PC Windows)
 * yang tidak mendukung HEIC secara native.
 */
async function convertViaHeic2any(file: File): Promise<File | null> {
  if (typeof window === 'undefined') return null

  try {
    const heic2anyModule = await import('heic2any')
    const heic2any = heic2anyModule.default || heic2anyModule

    const conversionPromise = (heic2any as unknown as (options: {
      blob: Blob
      toType?: string
      quality?: number
    }) => Promise<Blob | Blob[]>)({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.85,
    })

    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('heic2any timeout')), 8000)
    )

    const result = await Promise.race([conversionPromise, timeoutPromise])
    if (!result) return null

    const blob = Array.isArray(result) ? result[0] : result
    const baseName = file.name
      .replace(/\.(heic|heif)$/i, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
    const newFileName = `${baseName || 'photo'}.jpeg`

    return new File([blob], newFileName, { type: 'image/jpeg' })
  } catch (error) {
    console.warn('heic2any fallback failed:', error)
    return null
  }
}

/**
 * Fungsi utama untuk konversi gambar.
 * Menangani:
 * 1. File HEIC/HEIF dari kamera iPhone
 * 2. Foto resolusi sangat besar dari kamera (> 2MB) agar dikompresi ke JPEG standar ~500KB
 * 3. File non-HEIC berukuran wajar dilewati langsung tanpa proses (0ms)
 */
export async function convertHeicToJpeg(file: File): Promise<File> {
  const isHeic =
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    /\.(heic|heif)$/i.test(file.name)

  const isLarge = file.size > 2 * 1024 * 1024 // > 2MB (foto kamera asli)

  // Jika bukan HEIC dan ukurannya sudah ringan (< 2MB), gunakan langsung
  if (!isHeic && !isLarge) {
    return file
  }

  // 1. Coba konversi via Native Canvas (paling cepat & aman di iPhone / iOS Safari)
  const nativeConverted = await convertViaNativeCanvas(file)
  if (nativeConverted) {
    return nativeConverted
  }

  // 2. Jika native gagal dan file adalah HEIC (misal di Chrome Windows), gunakan heic2any
  if (isHeic) {
    const heicConverted = await convertViaHeic2any(file)
    if (heicConverted) {
      return heicConverted
    }
  }

  // 3. Fallback terakhir: kembalikan file asli agar flow tidak terhenti
  return file
}
