import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import PublicProfileView, { type PublicProfileUser } from '@/components/PublicProfileView'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id },
    select: { name: true, bio: true },
  })

  if (!user) {
    return {
      title: 'Pengguna Tidak Ditemukan',
    }
  }

  return {
    title: `${user.name} | Profil Pembaca`,
    description: user.bio ? user.bio.slice(0, 155) : `Lihat aktivitas dan kontribusi ${user.name} di Haikal Journal.`,
  }
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const dbUser = await prisma.user.findUnique({
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
      comments: {
        include: {
          article: {
            select: { id: true, title: true },
          },
        },
        orderBy: { created_at: 'desc' },
        take: 20,
      },
      reactions: {
        where: { type: { in: ['KEREN', 'NGAKAK', 'BERGUNA', 'MANTAP', 'KAGET', 'LIKE'] } },
        include: {
          article: {
            select: { id: true, title: true, created_at: true },
          },
        },
        orderBy: { created_at: 'desc' },
        take: 20,
      },
    },
  })

  if (!dbUser || dbUser.is_banned) {
    notFound()
  }

  const [totalComments, totalLikes] = await Promise.all([
    prisma.comment.count({ where: { user_id: dbUser.id } }),
    prisma.reaction.count({
      where: {
        user_id: dbUser.id,
        type: { in: ['KEREN', 'NGAKAK', 'BERGUNA', 'MANTAP', 'KAGET', 'LIKE'] },
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

  const formattedComments = dbUser.comments.map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(c.created_at)),
    article: {
      id: c.article.id,
      title: c.article.title,
    },
  }))

  const formattedLikes = dbUser.reactions.map((r) => ({
    id: r.article.id,
    title: r.article.title,
    createdAt: new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(r.article.created_at)),
  }))

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
    recentComments: formattedComments,
    likedArticles: formattedLikes,
  }

  return <PublicProfileView user={publicData} />
}
