import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser?.email) {
    return NextResponse.json({ error: 'Harus login' }, { status: 401 })
  }

  const comment = await prisma.comment.findUnique({
    where: { id },
    include: { user: true, article: { select: { id: true } } },
  })

  if (!comment) {
    return NextResponse.json({ error: 'Komentar tidak ditemukan' }, { status: 404 })
  }

  const isOwnerEmail = authUser.email === process.env.OWNER_EMAIL
  const isCommentAuthor = comment.user.email === authUser.email

  // Admin bisa hapus komentar siapa saja, user biasa hanya komentar sendiri
  if (!isOwnerEmail && !isCommentAuthor) {
    return NextResponse.json({ error: 'Tidak punya izin untuk menghapus komentar ini' }, { status: 403 })
  }

  await prisma.comment.delete({ where: { id } })

  revalidatePath(`/artikel/${comment.article.id}`)

  return NextResponse.json({ success: true })
}
