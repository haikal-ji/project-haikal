export default function DashboardLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-text-secondary/15 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-text-secondary/20 bg-thirdary px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3 w-40 h-6" />
          <div className="h-9 sm:h-10 w-64 rounded-2xl bg-thirdary/80 mb-2" />
          <div className="h-4 w-80 sm:w-96 rounded-lg bg-thirdary/50" />
        </div>

        <div className="w-44 h-10 rounded-full bg-thirdary/80 shrink-0" />
      </div>

      {/* Stats Summary Grid Skeleton (3 Cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5" aria-label="Ringkasan artikel loading">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-text-secondary/15 bg-thirdary/40 backdrop-blur-md p-6 shadow-xs"
          >
            <div className="w-28 h-3.5 rounded bg-thirdary/70" />
            <div className="w-16 h-10 rounded-xl bg-thirdary/80 mt-3" />
            <div className="w-44 h-3 rounded bg-thirdary/50 mt-2" />
          </div>
        ))}
      </section>

      {/* Articles Management Table Skeleton */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-36 h-6 rounded-lg bg-thirdary/80" />
            <div className="w-8 h-4 rounded bg-thirdary/50" />
          </div>
        </div>

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
                {Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="px-5 py-4">
                      <div className="w-5 h-4 rounded bg-thirdary/60" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-thirdary/70 shrink-0" />
                        <div className="space-y-1.5">
                          <div className="w-48 sm:w-64 h-4 rounded bg-thirdary/80" />
                          <div className="w-24 h-3 rounded bg-thirdary/50" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-24 h-3.5 rounded bg-thirdary/60" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-16 h-5 rounded-full bg-thirdary/70" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-8 h-8 rounded-lg bg-thirdary/70" />
                        <div className="w-8 h-8 rounded-lg bg-thirdary/70" />
                        <div className="w-8 h-8 rounded-lg bg-thirdary/70" />
                      </div>
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
