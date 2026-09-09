import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncUserToDb } from '@/lib/auth-sync'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const supabase = await createClient()
  const dbUser = await syncUserToDb(supabase)

  if (!dbUser) {
    return NextResponse.json({ error: 'Harus login dulu untuk berkomentar' }, { status: 401 })
  }

  const body = await request.json()
  const { article_id, content } = body

  if (!article_id || typeof content !== 'string' || !content.trim()) {
    return NextResponse.json({ error: 'Komentar tidak boleh kosong' }, { status: 400 })
  }

  const comment = await prisma.comment.create({
    data: {
      article_id,
      user_id: dbUser.id,
      content: content.trim(),
    },
    include: { user: true },
  })

  return NextResponse.json({ comment })
}
