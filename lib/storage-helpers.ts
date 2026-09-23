import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Menghapus file thumbnail dari Supabase Storage (bucket 'thumbnails')
 * berdasarkan URL publiknya.
 * Menggunakan createAdminClient (service role) agar bypass RLS policies
 * yang melarang operasi DELETE oleh anonymous/public key.
 * Format URL: https://<project>.supabase.co/storage/v1/object/public/thumbnails/<filename>
 */
export async function deleteThumbnailFromStorage(thumbnailUrl: string | null | undefined): Promise<void> {
  if (!thumbnailUrl) return

  try {
    const BUCKET = 'thumbnails'
    const bucketMarker = `/object/public/${BUCKET}/`
    const markerIndex = thumbnailUrl.indexOf(bucketMarker)

    if (markerIndex === -1) {
      return
    }

    let fileName = thumbnailUrl.slice(markerIndex + bucketMarker.length)
    if (fileName.includes('?')) {
      fileName = fileName.split('?')[0]
    }

    if (!fileName) {
      return
    }

    const supabase = createAdminClient()
    const { error: storageError } = await supabase.storage.from(BUCKET).remove([fileName])

    if (storageError) {
      console.warn(`Gagal menghapus thumbnail (${fileName}) dari Storage:`, storageError.message)
    }
  } catch (storageErr) {
    console.warn('Terjadi kesalahan tak terduga saat menghapus thumbnail dari Storage:', storageErr)
  }
}
