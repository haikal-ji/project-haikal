import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { verifySameOrigin } from '@/lib/csrf'

function isAdmin(email: string) {
  return email === process.env.OWNER_EMAIL
}

// DELETE: Hapus akun user beserta seluruh data relasinya secara permanen
export async function DELETE(request: Request) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Origin tidak valid' }, { status: 403 })
  }

  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser?.email || !isAdmin(authUser.email)) {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const userId = body?.userId

  if (!userId) {
    return NextResponse.json({ error: 'User ID diperlukan' }, { status: 400 })
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!targetUser) {
    return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 })
  }

  // Lindungi akun admin agar tidak bisa terhapus
  if (targetUser.email === authUser.email || targetUser.email === process.env.OWNER_EMAIL) {
    return NextResponse.json(
      { error: 'Kamu tidak dapat menghapus akun admin utama' },
      { status: 400 }
    )
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Hapus relasi: reaksi, komentar, permohonan unban, badge
      await tx.reaction.deleteMany({ where: { user_id: userId } })
      await tx.comment.deleteMany({ where: { user_id: userId } })
      await tx.unbanAppeal.deleteMany({ where: { user_id: userId } })
      await tx.userBadge.deleteMany({ where: { user_id: userId } })

      // 2. Bersihkan artikel yang dibuat oleh user ini jika ada (beserta komentar/reaksinya)
      const userArticles = await tx.article.findMany({
        where: { author_id: userId },
        select: { id: true },
      })

      if (userArticles.length > 0) {
        const articleIds = userArticles.map((a) => a.id)
        await tx.reaction.deleteMany({ where: { article_id: { in: articleIds } } })
        await tx.comment.deleteMany({ where: { article_id: { in: articleIds } } })
        await tx.article.deleteMany({ where: { author_id: userId } })
      }

      // 3. Hapus record pengguna dari database komunitas
      await tx.user.delete({ where: { id: userId } })

      // 4. Hapus kredensial, sandi/password, dan sesi dari Supabase Auth (auth.users)
      // Supaya akun tidak bisa login lagi dan wajib daftar ulang dari awal
      await tx.$executeRaw`DELETE FROM auth.users WHERE LOWER(email) = LOWER(${targetUser.email})`
    })

    revalidatePath('/dashboard/komunitas')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Gagal menghapus user dari database' }, { status: 500 })
  }
}
