import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DeleteArticleButton from './DeleteArticleButton'
import ArrowUpRight from '@/components/ui/ArrowUpRight'

export const dynamic = 'force-dynamic'

const todayLabel = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
}).format(new Date())

export default async function DashboardPage() {
  const articles = await prisma.article.findMany({
    orderBy: { created_at: 'desc' },
  })

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-text-secondary/15 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-text-secondary/20 bg-thirdary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{todayLabel}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
            Overview & Konten
          </h1>
          <p className="mt-2 text-sm text-text-secondary max-w-xl">
            {articles.length === 0
              ? 'Selamat datang! Ruang kerja ini siap untuk mencatat ide dan publikasi pertamamu.'
              : 'Kelola artikel, dokumentasi teknis, dan catatan yang sudah kamu publikasikan.'}
          </p>
        </div>

        <Link
          href="/dashboard/artikel/tambah"
          className="inline-flex items-center gap-2 bg-button-hero hover:bg-button-hero-hover text-background font-semibold text-xs sm:text-sm py-2.5 px-5 rounded-full transition-all shadow-xs group w-fit"
        >
          <span>＋ Tulis Artikel Baru</span>
          <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Stats Summary Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5" aria-label="Ringkasan artikel">
        <div className="rounded-2xl border border-text-secondary/15 bg-thirdary/40 backdrop-blur-md p-6 shadow-xs transition-colors">
          <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Total Artikel</p>
          <p className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
            {String(articles.length).padStart(2, '0')}
          </p>
          <p className="mt-2 text-xs text-text-secondary">Catatan yang tersimpan & live</p>
        </div>

        <div className="rounded-2xl border border-text-secondary/15 bg-thirdary/40 backdrop-blur-md p-6 shadow-xs transition-colors">
          <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Terakhir Ditulis</p>
          <p className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
            {articles[0]
              ? new Date(articles[0].created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
              : '—'}
          </p>
          <p className="mt-2 text-xs text-text-secondary">Pembaruan konten paling mutakhir</p>
        </div>

        <div className="rounded-2xl border border-text-secondary/15 bg-thirdary/40 backdrop-blur-md p-6 shadow-xs transition-colors">
          <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Dengan Cover</p>
          <p className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
            {String(articles.filter((a) => a.thumbnail).length).padStart(2, '0')}
          </p>
          <p className="mt-2 text-xs text-text-secondary">Artikel dengan visual thumbnail</p>
        </div>
      </section>

      {/* Articles Management Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary tracking-tight">Daftar Publikasi</h2>
            <span className="text-xs text-text-secondary font-mono">({articles.length})</span>
          </div>
          {articles.length > 0 && (
            <p className="text-[11px] text-text-secondary sm:hidden flex items-center gap-1 font-medium bg-thirdary/60 px-2.5 py-1 rounded-full border border-text-secondary/15">
              <span>↔️</span> Geser ke samping
            </p>
          )}
        </div>

        {articles.length > 0 ? (
          <div className="rounded-2xl border border-text-secondary/15 bg-thirdary/40 backdrop-blur-md overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-text-secondary/10 bg-thirdary/70 text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 w-14">No.</th>
                    <th scope="col" className="px-5 py-3.5">Artikel</th>
                    <th scope="col" className="px-5 py-3.5">Tanggal</th>
                    <th scope="col" className="px-5 py-3.5">Status</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-text-secondary/10">
                  {articles.map((article, index) => (
                    <tr key={article.id} className="hover:bg-thirdary/50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-text-secondary">
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {article.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={article.thumbnail}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover border border-text-secondary/15 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-thirdary flex items-center justify-center text-[10px] font-mono text-text-secondary uppercase border border-text-secondary/15 shrink-0">
                              No Img
                            </div>
                          )}
                          <Link
                            href={`/artikel/${article.id}`}
                            className="font-semibold text-text-primary hover:underline line-clamp-1"
                          >
                            {article.title}
                          </Link>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-text-secondary whitespace-nowrap">
                        {new Date(article.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Live
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/dashboard/artikel/edit/${article.id}`}
                            className="px-3 py-1 rounded-full text-xs font-medium text-text-primary hover:bg-thirdary border border-text-secondary/20 transition-colors"
                          >
                            Edit
                          </Link>
                          <DeleteArticleButton id={article.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-text-secondary/15 bg-thirdary/40 backdrop-blur-md p-12 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-thirdary flex items-center justify-center text-text-secondary">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">Belum ada artikel</h3>
              <p className="text-xs text-text-secondary mt-1">Ruang kerja ini siap diisi dengan tulisan pertamamu.</p>
            </div>
            <Link
              href="/dashboard/artikel/tambah"
              className="inline-flex items-center gap-2 bg-button-hero hover:bg-button-hero-hover text-background font-medium text-xs py-2 px-4 rounded-full transition-all shadow-xs"
            >
              Mulai Menulis
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
