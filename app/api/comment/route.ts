import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { containsBadWord } from '@/lib/bad-words'
import { verifySameOrigin } from '@/lib/csrf'
import { checkRateLimit } from '@/lib/rate-limit'
import { createCommentSchema } from '@/lib/schemas'

export async function POST(request: Request) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Origin tidak valid' }, { status: 403 })
  }

  if (checkRateLimit(request, 'POST:/api/comment', { limit: 10, windowMs: 60_000 })) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan, coba lagi nanti' }, { status: 429 })
  }

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

  const body = await request.json().catch(() => null)
  const result = createCommentSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Data tidak valid', details: result.error.flatten() },
      { status: 400 }
    )
  }

  const { article_id, content } = result.data

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

