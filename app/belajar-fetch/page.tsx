import { createClient } from '@/lib/supabase/server'

// Ini Server Component (tidak ada "use client" di atas), jadi bisa langsung `await`

export const dynamic = 'force-dynamic'

export default async function BelajarFetchPage() {
  const supabase = await createClient()

  // Fetch langsung dari Supabase (bukan lewat Prisma) - coba ambil beberapa judul artikel
  const { data: articles, error } = await supabase
    .from('Article')
    .select('id, title, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-4 text-2xl font-semibold">Latihan Fetch dari Supabase</h1>
      <p className="mb-6 text-sm text-gray-500">
        Halaman ini fetch data langsung pakai Supabase client (bukan Prisma), buat latihan.
      </p>

      {error && <p className="text-red-500">Error: {error.message}</p>}

      <ul className="space-y-2">
        {articles?.map((article) => (
          <li key={article.id} className="rounded-md border border-gray-200 p-3">
            {article.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
