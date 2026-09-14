import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { verifySameOrigin } from '@/lib/csrf'
import { updateProfileSchema } from '@/lib/schemas'

export async function PUT(request: Request) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Origin tidak valid' }, { status: 403 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email) {
    return NextResponse.json({ error: 'Harus login' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const result = updateProfileSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Data tidak valid', details: result.error.flatten() },
      { status: 400 }
    )
  }

  const { name, avatar } = result.data

  const updated = await prisma.user.update({
    where: { email: user.email },
    data: { name, avatar: avatar || null },
  })

  // Invalidate cache di semua halaman artikel & layout agar foto baru langsung muncul
  revalidatePath('/', 'layout')
  revalidatePath('/artikel', 'layout')
  revalidatePath('/profile')

  return NextResponse.json({ user: updated })
}

