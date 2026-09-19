import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncUserToDb } from '@/lib/auth-sync'
import { prisma } from '@/lib/prisma'
import { verifySameOrigin } from '@/lib/csrf'
import { articleSchema } from '@/lib/schemas'
import { sanitizeArticleHtml } from '@/lib/sanitize'

async function requireOwner() {
  const supabase = await createClient()
  const dbUser = await syncUserToDb(supabase)

  if (!dbUser || dbUser.email !== process.env.OWNER_EMAIL) {
    return null
  }

  return dbUser
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const article = await prisma.article.findUnique({ where: { id } })

  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ article })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Origin tidak valid' }, { status: 403 })
  }

  const owner = await requireOwner()

  if (!owner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json().catch(() => null)
  const result = articleSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Data tidak valid', details: result.error.flatten() },
      { status: 400 }
    )
  }

  const { title, content, thumbnail } = result.data

  try {
    const article = await prisma.article.update({
      where: { id },
      data: { title, content: sanitizeArticleHtml(content), thumbnail: thumbnail || null },
    })

    return NextResponse.json({ article })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 })
    }
    console.error('Error updating article:', error)
    return NextResponse.json({ error: 'Gagal memperbarui artikel' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Origin tidak valid' }, { status: 403 })
  }

  const owner = await requireOwner()

  if (!owner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params

  // Ambil data artikel dulu untuk mendapatkan thumbnail sebelum dihapus
  const existingArticle = await prisma.article.findUnique({
    where: { id },
    select: { thumbnail: true },
  })

  if (!existingArticle) {
    return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 })
  }

  try {
    await prisma.$transaction([
      prisma.reaction.deleteMany({ where: { article_id: id } }),
      prisma.comment.deleteMany({ where: { article_id: id } }),
      prisma.article.delete({ where: { id } }),
    ])
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 })
    }
    console.error('Error deleting article:', error)
    return NextResponse.json({ error: 'Gagal menghapus artikel' }, { status: 500 })
  }

  // Hapus thumbnail dari Supabase Storage setelah transaksi DB berhasil.
  // Dibungkus try/catch terpisah: kalau storage gagal, artikel tetap dianggap
  // terhapus (jangan rollback) — cukup log peringatan saja.
  if (existingArticle.thumbnail) {
    try {
      const thumbnailUrl = existingArticle.thumbnail
      // Ekstrak nama file dari URL Supabase Storage
      // Format URL: https://<project>.supabase.co/storage/v1/object/public/thumbnails/<filename>
      const BUCKET = 'thumbnails'
      const bucketMarker = `/object/public/${BUCKET}/`
      const markerIndex = thumbnailUrl.indexOf(bucketMarker)

      if (markerIndex !== -1) {
        const fileName = thumbnailUrl.slice(markerIndex + bucketMarker.length)
        const supabase = await createClient()
        const { error: storageError } = await supabase.storage.from(BUCKET).remove([fileName])

        if (storageError) {
          console.warn(`Artikel ${id} dihapus, tapi thumbnail gagal dihapus dari Storage:`, storageError.message)
        }
      }
    } catch (storageErr) {
      console.warn(`Artikel ${id} dihapus, tapi thumbnail gagal dihapus dari Storage (unexpected):`, storageErr)
    }
  }

  return NextResponse.json({ success: true })
}


