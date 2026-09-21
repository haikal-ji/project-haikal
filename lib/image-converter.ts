/**
 * Mengonversi file HEIC / HEIF (format bawaan kamera iPhone/iOS) menjadi JPEG standar
 * agar dapat dibuka dan ditampilkan dengan sempurna di semua browser & perangkat (Windows, Chrome, Edge, Android).
 */
export async function convertHeicToJpeg(file: File): Promise<File> {
  // Cek apakah file bertipe HEIC/HEIF
  const isHeic =
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    /\.(heic|heif)$/i.test(file.name)

  if (!isHeic) {
    return file
  }

  try {
    // Dynamic import agar library heic2any hanya dimuat di client-side saat dibutuhkan
    const heic2anyModule = await import('heic2any')
    const heic2any = heic2anyModule.default || heic2anyModule

    const convertedBlob = await (heic2any as unknown as (options: {
      blob: Blob
      toType?: string
      quality?: number
    }) => Promise<Blob | Blob[]>)({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.85,
    })

    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
    const newFileName = file.name.replace(/\.(heic|heif)$/i, '.jpeg')

    return new File([blob], newFileName, { type: 'image/jpeg' })
  } catch (error) {
    console.warn('Gagal mengonversi HEIC ke JPEG, menggunakan file asli:', error)
    return file
  }
}
