import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import ProfileClientView from '@/components/ProfileClientView'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Profil & Identitas',
  description: 'Kelola profil, tampilan interaksi, dan pantau riwayat aktivitas komentarmu.',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email) {
    redirect('/login')
  }

  let dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: {
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
        where: { type: 'LIKE' },
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

  // Jaga-jaga jika user Supabase belum tercatat di Prisma User
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        email: user.email,
        name: user.user_metadata?.name || user.email.split('@')[0] || 'Pembaca',
        avatar: user.user_metadata?.avatar_url || null,
      },
      include: {
        comments: {
          include: {
            article: {
              select: { id: true, title: true },
            },
          },
        },
        reactions: {
          include: {
            article: {
              select: { id: true, title: true, created_at: true },
            },
          },
        },
      },
    })
  }

  const [totalComments, totalLikes] = await Promise.all([
    prisma.comment.count({ where: { user_id: dbUser.id } }),
    prisma.reaction.count({ where: { user_id: dbUser.id, type: 'LIKE' } }),
  ])

  const isOwner = Boolean(process.env.OWNER_EMAIL && user.email === process.env.OWNER_EMAIL)

  const formattedJoinDate = new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(dbUser.created_at))

  const recentComments = dbUser.comments.map((c) => ({
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

  const likedArticles = dbUser.reactions.map((r) => ({
    id: r.article.id,
    title: r.article.title,
    createdAt: new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(r.article.created_at)),
  }))

  return (
    <div className="profile-page-shell">
      <main className="profile-page">
        <header className="profile-page-heading mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-text-secondary/20 bg-thirdary px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Studio / Identitas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
            Profil & Pengaturan
          </h1>
          <p className="mt-2 text-sm text-text-secondary max-w-xl">
            Atur bagaimana identitasmu tampil di setiap ruang diskusi dan tinjau jejak interaksi yang telah kamu buat.
          </p>
        </header>

        <ProfileClientView
          user={{
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            avatar: dbUser.avatar,
            createdAt: formattedJoinDate,
            isOwner,
          }}
          stats={{
            commentsCount: totalComments,
            likesCount: totalLikes,
          }}
          recentComments={recentComments}
          likedArticles={likedArticles}
        />
      </main>
    </div>
  )
}
