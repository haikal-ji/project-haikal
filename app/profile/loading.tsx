export default function ProfileLoading() {
  return (
    <div className="profile-page-shell">
      <main className="profile-page animate-pulse">
        {/* Page Header */}
        <header className="profile-page-heading mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-text-secondary/20 bg-thirdary px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
            <span>Studio / Identitas</span>
          </div>
          <div className="h-10 sm:h-12 w-64 sm:w-80 rounded-2xl bg-thirdary/80" />
        </header>

        {/* Layout Grid */}
        <div className="profile-dashboard-layout">
          {/* Kolom Kiri: Member Pass Card Skeleton */}
          <aside className="profile-identity-card">
            <div className="profile-card-header flex justify-between items-center">
              <div className="w-24 h-5 rounded-full bg-secondary/80" />
              <div className="w-20 h-4 rounded bg-secondary/60" />
            </div>

            <div className="profile-card-center flex flex-col items-center">
              {/* Avatar Circle */}
              <div className="w-28 h-28 rounded-full bg-secondary/80 border-2 border-line my-4" />

              {/* Name Skeleton */}
              <div className="w-36 h-6 rounded-lg bg-secondary/80 mb-2" />

              {/* Badges Skeleton */}
              <div className="flex gap-2 mb-3">
                <div className="w-16 h-4 rounded-full bg-secondary/70" />
                <div className="w-16 h-4 rounded-full bg-secondary/70" />
              </div>

              {/* Bio Pill Skeleton */}
              <div className="w-48 h-8 rounded-xl bg-secondary/50 border border-line/40 my-2" />

              {/* Public Profile Link Skeleton */}
              <div className="w-32 h-4 rounded bg-secondary/60 mt-3" />
            </div>

            {/* Counter Strip Skeleton */}
            <div className="profile-stats-strip">
              <div className="profile-stat-item flex flex-col items-center">
                <div className="w-8 h-6 rounded bg-secondary/80 mb-1" />
                <div className="w-16 h-3 rounded bg-secondary/60" />
              </div>
              <div className="profile-stat-divider" />
              <div className="profile-stat-item flex flex-col items-center">
                <div className="w-8 h-6 rounded bg-secondary/80 mb-1" />
                <div className="w-16 h-3 rounded bg-secondary/60" />
              </div>
            </div>
          </aside>

          {/* Kolom Kanan: Main Tabbed Panel Skeleton */}
          <section className="profile-studio-panel">
            {/* Tabs Nav Skeleton */}
            <div className="profile-tab-nav flex gap-2 border-b border-line pb-2 mb-6">
              <div className="w-32 h-8 rounded-lg bg-secondary/80" />
              <div className="w-28 h-8 rounded-lg bg-secondary/60" />
              <div className="w-28 h-8 rounded-lg bg-secondary/60" />
              <div className="w-28 h-8 rounded-lg bg-secondary/60" />
            </div>

            {/* Tab Header Skeleton */}
            <div className="profile-tab-header mb-6 space-y-2">
              <div className="w-24 h-3.5 rounded bg-secondary/70" />
              <div className="w-60 h-8 rounded-xl bg-secondary/80" />
            </div>

            {/* Form Fields Skeleton */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between w-full">
                  <div className="w-36 h-4 rounded bg-secondary/70" />
                  <div className="w-12 h-4 rounded bg-secondary/50" />
                </div>
                <div className="w-full h-11 rounded-xl bg-secondary/60 border border-line" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between w-full">
                  <div className="w-24 h-4 rounded bg-secondary/70" />
                  <div className="w-12 h-4 rounded bg-secondary/50" />
                </div>
                <div className="w-full h-24 rounded-xl bg-secondary/60 border border-line" />
              </div>

              {/* Submit Button Skeleton */}
              <div className="pt-2">
                <div className="w-36 h-10 rounded-xl bg-secondary/80" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
