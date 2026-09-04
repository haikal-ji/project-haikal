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
  const owner = await requireOwner()

  if (!owner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { title, content, thumbnail } = body

  if (!title || !content) {
    return NextResponse.json({ error: 'Judul dan konten wajib diisi' }, { status: 400 })
  }

  const article = await prisma.article.update({
    where: { id },
    data: { title, content, thumbnail: thumbnail || null },
  })

  return NextResponse.json({ article })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const owner = await requireOwner()

  if (!owner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  await prisma.article.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
