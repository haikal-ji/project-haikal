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
            <div className="profile-card-header">
              <span className="profile-badge-role inline-block w-28 h-5 rounded-full bg-thirdary/80 border-0" />
              <span className="profile-card-id inline-block w-16 h-3.5 rounded bg-thirdary/60" />
            </div>

            <div className="profile-card-center">
              {/* Avatar Frame with Camera Badge Placeholder */}
              <div className="profile-avatar-frame">
                <div className="w-full h-full rounded-full bg-thirdary/80 border-2 border-line" />
                <div className="absolute bottom-1 right-1 h-7.5 w-7.5 rounded-full bg-foreground/20 border-2 border-background" />
              </div>

              {/* Name Skeleton */}
              <div className="h-7 w-40 rounded-lg bg-thirdary/80 mx-auto mb-2" />

              {/* Badges Skeleton */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2 mb-1.5 max-w-full px-2">
                <div className="w-16 h-4.5 rounded-full bg-thirdary/60" />
                <div className="w-20 h-4.5 rounded-full bg-thirdary/60" />
              </div>

              {/* Bio Singkat Skeleton */}
              <div className="mt-3 flex justify-center w-full">
                <div className="w-48 h-8 rounded-xl bg-thirdary/50 border border-line/60" />
              </div>

              {/* Tautan ke Profil Publik Skeleton */}
              <div className="mt-3.5 flex justify-center">
                <div className="w-32 h-4 rounded bg-thirdary/60" />
              </div>
            </div>

            {/* Counter Statistik */}
            <div className="profile-stats-strip">
              <div className="profile-stat-item">
                <div className="w-8 h-6 rounded bg-thirdary/80 mx-auto mb-1" />
                <span className="profile-stat-label">Komentar</span>
              </div>
              <div className="profile-stat-divider" />
              <div className="profile-stat-item">
                <div className="w-8 h-6 rounded bg-thirdary/80 mx-auto mb-1" />
                <span className="profile-stat-label">Apresiasi</span>
              </div>
            </div>
          </aside>

          {/* Kolom Kanan: Main Tabbed Studio */}
          <section className="profile-studio-panel">
            {/* Tabs Nav */}
            <nav className="profile-tab-nav" aria-label="Navigasi Profil">
              <div className="profile-tab-btn is-active">
                <span className="tab-indicator" />
                <span className="inline-block w-28 h-4 rounded bg-thirdary/80" />
              </div>
              <div className="profile-tab-btn">
                <span className="inline-block w-24 h-4 rounded bg-thirdary/60" />
              </div>
              <div className="profile-tab-btn">
                <span className="inline-block w-24 h-4 rounded bg-thirdary/60" />
              </div>
              <div className="profile-tab-btn">
                <span className="inline-block w-24 h-4 rounded bg-thirdary/60" />
              </div>
            </nav>

            {/* Tab Content */}
            <div className="profile-tab-content">
              <div className="profile-tab-header">
                <p className="profile-kicker inline-block w-24 h-3.5 rounded bg-thirdary/70" />
                <div className="h-8 w-64 rounded-xl bg-thirdary/80 mt-2" />
              </div>

              <div className="profile-form-grid">
                {/* Field 1: Nama Tampilan */}
                <div className="profile-form-group">
                  <div className="profile-label-row flex justify-between items-center mb-2">
                    <div className="w-24 h-3.5 rounded bg-thirdary/70" />
                    <div className="w-10 h-3 rounded bg-thirdary/50" />
                  </div>
                  <div className="profile-text-input h-11 w-full rounded-xl bg-thirdary/50 border border-line" />
                </div>

                {/* Field 2: Bio Singkat */}
                <div className="profile-form-group">
                  <div className="profile-label-row flex justify-between items-center mb-2">
                    <div className="w-20 h-3.5 rounded bg-thirdary/70" />
                    <div className="w-10 h-3 rounded bg-thirdary/50" />
                  </div>
                  <div className="profile-text-input h-24 w-full rounded-xl bg-thirdary/50 border border-line" />
                </div>

                {/* Submit Button */}
                <div className="profile-actions-strip pt-2">
                  <div className="editorial-link profile-submit inline-block w-36 h-11 rounded-full bg-thirdary/80 text-center" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
