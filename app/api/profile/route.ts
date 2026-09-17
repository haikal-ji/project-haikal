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

  const { name, avatar, bio } = result.data

  const updateData: { name: string; avatar?: string | null; bio?: string | null } = {
    name,
  }
  if (avatar !== undefined) {
    updateData.avatar = avatar || null
  }
  if (bio !== undefined) {
    updateData.bio = bio && bio.trim() ? bio.trim() : null
  }

  try {
    const updated = await prisma.user.upsert({
      where: { email: user.email },
      update: updateData,
      create: {
        email: user.email,
        name,
        avatar: updateData.avatar ?? null,
        bio: updateData.bio ?? null,
      },
    })

    // Invalidate cache di semua halaman artikel & layout agar foto/bio baru langsung muncul
    revalidatePath('/', 'layout')
    revalidatePath('/artikel', 'layout')
    revalidatePath('/profile')
    revalidatePath(`/pengguna/${updated.id}`)

    return NextResponse.json({ user: updated })
  } catch (err) {
    console.error('Error updating profile:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Gagal memperbarui profil' },
      { status: 500 }
    )
  }
}

