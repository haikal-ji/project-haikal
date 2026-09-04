import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncUserToDb } from '@/lib/auth-sync'
import { prisma } from '@/lib/prisma'

async function requireOwner() {
  const supabase = await createClient()
  const dbUser = await syncUserToDb(supabase)

  if (!dbUser || dbUser.email !== process.env.OWNER_EMAIL) {
    return null
  }

  return dbUser
}

export async function GET() {
  const articles = await prisma.article.findMany({
    orderBy: { created_at: 'desc' },
  })
  return NextResponse.json({ articles })
}

export async function POST(request: Request) {
  const owner = await requireOwner()

  if (!owner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { title, content, thumbnail } = body

  if (!title || !content) {
    return NextResponse.json({ error: 'Judul dan konten wajib diisi' }, { status: 400 })
  }

  const article = await prisma.article.create({
    data: {
      title,
      content,
      thumbnail: thumbnail || null,
      author_id: owner.id,
    },
  })

  return NextResponse.json({ article })
}
