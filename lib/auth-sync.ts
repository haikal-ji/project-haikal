import type { SupabaseClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'

// Upsert user Supabase Auth ke tabel User di database kita, berdasarkan email
export async function syncUserToDb(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email) return null

  const name =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    (user.user_metadata?.user_name as string | undefined) ??
    (user.user_metadata?.preferred_username as string | undefined) ??
    user.email

  const avatar =
    (user.user_metadata?.avatar_url as string | undefined) ??
    (user.user_metadata?.picture as string | undefined) ??
    null

  return prisma.user.upsert({
    where: { email: user.email },
    update: {}, // jangan timpa nama/avatar kalau user sudah pernah custom sendiri lewat /profile
    create: { email: user.email, name, avatar },
  })
}
