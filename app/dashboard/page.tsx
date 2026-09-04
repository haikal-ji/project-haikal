import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DeleteArticleButton from './DeleteArticleButton'

export default async function DashboardPage() {
  const articles = await prisma.article.findMany({
    orderBy: { created_at: 'desc' },
  })

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard Artikel</h1>
        <Link href="/dashboard/artikel/tambah" className="rounded-md bg-black px-4 py-2 text-white">
          + Tambah Artikel
        </Link>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left text-sm text-gray-500">
            <th className="py-2">Judul</th>
            <th className="py-2">Tanggal Dibuat</th>
            <th className="py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id} className="border-b">
              <td className="py-3">{article.title}</td>
              <td className="py-3 text-sm text-gray-500">
                {new Date(article.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </td>
              <td className="space-x-3 py-3">
                <Link href={`/dashboard/artikel/edit/${article.id}`} className="text-sm text-blue-600 underline">
                  Edit
                </Link>
                <DeleteArticleButton id={article.id} />
              </td>
            </tr>
          ))}
          {articles.length === 0 && (
            <tr>
              <td colSpan={3} className="py-8 text-center text-gray-400">
                Belum ada artikel.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
