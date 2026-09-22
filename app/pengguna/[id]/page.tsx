import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import PublicProfileView, { type PublicProfileUser } from '@/components/PublicProfileView'

export const dynamic = 'force-dynamic'

type MetadataUser = {
  name: string
  bio: string | null
  avatar: string | null
  is_banned: boolean
} | null

type PublicProfileDbUser = {
  id: string
  name: string
  avatar: string | null
  bio: string | null
  created_at: Date
  email: string
  is_banned: boolean
  badges: Array<{
    id: string
    badge_id: string
    badge: {
      id: string
      name: string
      emoji: string | null
      color: string | null
    }
  }>
} | null

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const user = (await (prisma.user as any).findUnique({
    where: { id },
    select: { name: true, bio: true, avatar: true, is_banned: true },
  })) as MetadataUser

  if (!user || user.is_banned) {
    return {
      title: 'Pengguna Tidak Ditemukan | Haikal Journal',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ekall.vercel.app'
  const title = `Profil ${user.name} | Haikal Journal`
  const description = user.bio
    ? user.bio.slice(0, 155)
    : `Lihat profil, komentar, dan aktivitas ${user.name} di Haikal Journal.`

  const imageUrl = user.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `${siteUrl}${user.avatar}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=111113&color=ffffff&size=512&bold=true`

  return {
    title,
    description,
    openGraph: {
      title: `Profil ${user.name}`,
      description,
      type: 'profile',
      url: `${siteUrl}/pengguna/${id}`,
      siteName: 'Haikal Journal',
      images: [
        {
          url: imageUrl,
          width: 512,
          height: 512,
          alt: `Foto profil ${user.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: `Profil ${user.name}`,
      description,
      images: [imageUrl],
    },
  }
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const dbUser = (await (prisma.user as any).findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      avatar: true,
      bio: true,
      created_at: true,
      email: true, // Only used server-side below to check isOwner
      is_banned: true,
      badges: {
        include: {
          badge: true,
        },
        orderBy: {
          awarded_at: 'desc',
        },
      },
    },
  })) as PublicProfileDbUser

  if (!dbUser || dbUser.is_banned) {
    notFound()
  }

  const [totalComments, totalLikes] = await Promise.all([
    prisma.comment.count({ where: { user_id: dbUser.id } }),
    prisma.reaction.count({
      where: {
        user_id: dbUser.id,
        type: 'LIKE',
      },
    }),
  ])

  const isOwner = Boolean(
    process.env.OWNER_EMAIL && dbUser.email === process.env.OWNER_EMAIL
  )

  const formattedJoinDate = new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(dbUser.created_at))

  const publicData: PublicProfileUser = {
    id: dbUser.id,
    name: dbUser.name,
    avatar: dbUser.avatar,
    bio: dbUser.bio,
    joinedDate: formattedJoinDate,
    isOwner,
    badges: dbUser.badges.map((b) => ({
      id: b.badge.id,
      name: b.badge.name,
      emoji: b.badge.emoji,
      color: b.badge.color,
    })),
    stats: {
      commentsCount: totalComments,
      likesCount: totalLikes,
    },
  }

  return <PublicProfileView user={publicData} />
}
