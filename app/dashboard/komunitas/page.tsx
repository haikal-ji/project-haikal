import { prisma } from '@/lib/prisma'
import BanUserButton from '@/components/BanUserButton'
import AppealActionButtons from '@/components/AppealActionButtons'

interface AppealItem {
  id: string
  reason: string
  created_at: Date
  user: {
    id: string
    name: string
    email: string
    ban_reason: string | null
  }
}

interface UserItem {
  id: string
  name: string
  email: string
  avatar: string | null
  is_banned: boolean
  ban_reason: string | null
  created_at: Date
  _count: {
    comments: number
  }
}

export const dynamic = 'force-dynamic'

export default async function KomunitasPage() {
  const [users, pendingAppeals] = (await Promise.all([
    prisma.user.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        is_banned: true,
        ban_reason: true,
        created_at: true,
        _count: { select: { comments: true } },
      },
    }),
    prisma.unbanAppeal.findMany({
      where: { status: 'PENDING' },
      orderBy: { created_at: 'asc' },
      include: {
        user: { select: { id: true, name: true, email: true, ban_reason: true } },
      },
    }),
  ])) as [UserItem[], AppealItem[]]

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-text-secondary/15 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-text-secondary/20 bg-thirdary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>Moderasi & Komunitas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
            Manajemen Komunitas
          </h1>
          <p className="mt-2 text-sm text-text-secondary max-w-xl">
            Kelola data pengguna terdaftar, pantau aktivitas komentar, dan proses permohonan pembatalan sanksi (unban appeal).
          </p>
        </div>

        {pendingAppeals.length > 0 && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            <span>{pendingAppeals.length} Appeal Menunggu</span>
          </div>
        )}
      </div>

      {/* Antrian Appeal Unban */}
      {pendingAppeals.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary tracking-tight">Antrian Appeal Unban</h2>
            <span className="text-xs text-amber-500 font-medium bg-amber-500/10 px-2.5 py-0.5 rounded-full">
              {pendingAppeals.length} pending
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingAppeals.map((appeal: AppealItem) => (
              <div
                key={appeal.id}
                className="rounded-2xl border border-text-secondary/15 bg-thirdary/40 backdrop-blur-md p-5 space-y-3.5 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-sm text-text-primary">{appeal.user.name}</p>
                    <p className="text-xs text-text-secondary">{appeal.user.email}</p>
                  </div>
                  <time className="text-[11px] font-mono text-text-secondary whitespace-nowrap">
                    {new Date(appeal.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </time>
                </div>

                {appeal.user.ban_reason && (
                  <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/15 p-2 rounded-lg">
                    <span className="font-semibold">Alasan ban:</span> {appeal.user.ban_reason}
                  </div>
                )}

                <blockquote className="text-xs text-text-secondary italic border-l-2 border-text-secondary/30 pl-3">
                  &ldquo;{appeal.reason}&rdquo;
                </blockquote>

                <div className="pt-2 border-t border-text-secondary/10">
                  <AppealActionButtons appealId={appeal.id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Daftar Semua Pengguna */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary tracking-tight">Direktori Pengguna</h2>
            <span className="text-xs text-text-secondary font-mono">({users.length} member)</span>
          </div>
        </div>

        <div className="rounded-2xl border border-text-secondary/15 bg-thirdary/40 backdrop-blur-md overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-text-secondary/10 bg-thirdary/70 text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                <tr>
                  <th scope="col" className="px-5 py-3.5 w-14">No.</th>
                  <th scope="col" className="px-5 py-3.5">Pengguna</th>
                  <th scope="col" className="px-5 py-3.5">Email</th>
                  <th scope="col" className="px-5 py-3.5">Komentar</th>
                  <th scope="col" className="px-5 py-3.5">Status</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Moderasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-text-secondary/10">
                {users.map((user: UserItem, index: number) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-thirdary/50 transition-colors ${
                      user.is_banned ? 'bg-red-500/5' : ''
                    }`}
                  >
                    <td className="px-5 py-4 font-mono text-xs text-text-secondary">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover border border-text-secondary/15"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-thirdary border border-text-secondary/15 flex items-center justify-center text-xs font-bold text-text-secondary">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-semibold text-text-primary text-xs sm:text-sm">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-text-secondary">{user.email}</td>
                    <td className="px-5 py-4 text-xs font-mono text-text-secondary">{user._count.comments}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {user.is_banned ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Aktif
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <BanUserButton
                        userId={user.id}
                        userName={user.name}
                        isBanned={user.is_banned}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
