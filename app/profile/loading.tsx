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
          {/* Kolom Kiri: Member Pass Card */}
          <aside className="profile-identity-card">
            {/* Header: Role badge & ID */}
            <div className="profile-card-header flex justify-between items-center">
              <div className="w-28 h-5 rounded-full bg-thirdary/80" />
              <div className="w-16 h-3.5 rounded bg-thirdary/60" />
            </div>

            <div className="profile-card-center flex flex-col items-center">
              {/* Avatar Circle with camera badge placeholder */}
              <div className="relative w-28 h-28 my-4">
                <div className="w-full h-full rounded-full bg-thirdary/80 border-2 border-line" />
                <div className="absolute bottom-1 right-1 h-7.5 w-7.5 rounded-full bg-thirdary/90 border-2 border-background" />
              </div>

              {/* Name Skeleton */}
              <div className="w-36 h-6 rounded-lg bg-thirdary/80 mb-2" />

              {/* Badges Skeleton */}
              <div className="flex gap-1.5 mb-2 mt-1">
                <div className="w-16 h-4.5 rounded-full bg-thirdary/60" />
                <div className="w-20 h-4.5 rounded-full bg-thirdary/60" />
              </div>

              {/* Bio Singkat Pill Skeleton */}
              <div className="w-48 h-8 rounded-xl bg-thirdary/50 border border-line/60 my-2" />

              {/* Public Profile Link Skeleton */}
              <div className="w-32 h-4 rounded bg-thirdary/60 mt-3" />
            </div>

            {/* Counter Strip Skeleton */}
            <div className="profile-stats-strip">
              <div className="profile-stat-item flex flex-col items-center">
                <div className="w-8 h-6 rounded bg-thirdary/80 mb-1" />
                <div className="w-16 h-3 rounded bg-thirdary/60" />
              </div>
              <div className="profile-stat-divider" />
              <div className="profile-stat-item flex flex-col items-center">
                <div className="w-8 h-6 rounded bg-thirdary/80 mb-1" />
                <div className="w-16 h-3 rounded bg-thirdary/60" />
              </div>
            </div>
          </aside>

          {/* Kolom Kanan: Main Tabbed Panel */}
          <section className="profile-studio-panel">
            {/* Tabs Nav Skeleton */}
            <div className="profile-tab-nav flex gap-2 border-b border-line pb-0 mb-8 overflow-x-auto">
              <div className="w-36 h-10 rounded-lg bg-thirdary/80 shrink-0" />
              <div className="w-32 h-10 rounded-lg bg-thirdary/50 shrink-0" />
              <div className="w-32 h-10 rounded-lg bg-thirdary/50 shrink-0" />
              <div className="w-28 h-10 rounded-lg bg-thirdary/50 shrink-0" />
            </div>

            {/* Tab Header Skeleton */}
            <div className="profile-tab-header mb-8 space-y-2">
              <div className="w-24 h-3.5 rounded bg-thirdary/70" />
              <div className="w-64 h-8 rounded-xl bg-thirdary/80" />
            </div>

            {/* Form Fields Skeleton */}
            <div className="profile-form-grid space-y-6 max-w-[620px]">
              {/* Field 1: Display Name */}
              <div className="space-y-2">
                <div className="flex justify-between w-full">
                  <div className="w-28 h-4 rounded bg-thirdary/70" />
                  <div className="w-10 h-3.5 rounded bg-thirdary/50" />
                </div>
                <div className="w-full h-11 rounded-xl bg-thirdary/60 border border-line" />
              </div>

              {/* Field 2: Short Bio */}
              <div className="space-y-2">
                <div className="flex justify-between w-full">
                  <div className="w-24 h-4 rounded bg-thirdary/70" />
                  <div className="w-10 h-3.5 rounded bg-thirdary/50" />
                </div>
                <div className="w-full h-24 rounded-xl bg-thirdary/60 border border-line" />
              </div>

              {/* Submit Button Skeleton */}
              <div className="pt-2">
                <div className="w-36 h-11 rounded-full bg-thirdary/80 border border-text-secondary/20" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
