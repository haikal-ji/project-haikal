import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email) {
    return NextResponse.json({ error: 'Harus login' }, { status: 401 })
  }

  const body = await request.json()
  const { name, avatar } = body

  if (typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Nama tidak boleh kosong' }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { email: user.email },
    data: { name: name.trim(), avatar: avatar || null },
  })

  // Invalidate cache di semua halaman artikel & layout agar foto baru langsung muncul
  revalidatePath('/', 'layout')
  revalidatePath('/artikel', 'layout')
  revalidatePath('/profile')

  return NextResponse.json({ user: updated })
}
