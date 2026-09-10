import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { containsBadWord } from '@/lib/bad-words'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser?.email) {
    return NextResponse.json({ error: 'Harus login dulu untuk berkomentar' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({ where: { email: authUser.email } })

  if (!dbUser) {
    return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 401 })
  }

  // Cek apakah user ter-banned
  if (dbUser.is_banned) {
    return NextResponse.json(
      {
        error: 'Akun kamu telah dinonaktifkan oleh admin karena melanggar aturan komunitas. Kunjungi halaman Profil untuk mengajukan permohonan pemulihan akun.',
      },
      { status: 403 }
    )
  }

  const body = await request.json()
  const { article_id, content } = body

  if (!article_id || typeof content !== 'string' || !content.trim()) {
    return NextResponse.json({ error: 'Komentar tidak boleh kosong' }, { status: 400 })
  }

  // Bad word filter
  if (containsBadWord(content)) {
    return NextResponse.json(
      {
        error: 'Komentar tidak dapat dikirim karena mengandung kata-kata yang tidak pantas.',
      },
      { status: 400 }
    )
  }

  const comment = await prisma.comment.create({
    data: {
      article_id,
      user_id: dbUser.id,
      content: content.trim(),
    },
    include: { user: true },
  })

  revalidatePath(`/artikel/${article_id}`)

  return NextResponse.json({ comment })
}
