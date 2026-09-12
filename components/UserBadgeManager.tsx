'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CommunityBadge, { BadgeIcon } from '@/components/CommunityBadge'

export interface BadgeItem {
  id: string
  name: string
  emoji: string
  color: string
}

export interface UserBadgeItem {
  id: string
  badge_id: string
  badge: BadgeItem
}

interface UserBadgeManagerProps {
  userId: string
  userName: string
  initialUserBadges: UserBadgeItem[]
  allBadges: BadgeItem[]
}

const ICON_PRESETS = [
  { label: 'Verified', emoji: 'verified', name: 'Verified' },
  { label: 'Crown', emoji: 'crown', name: 'VIP' },
  { label: 'Dev', emoji: 'code', name: 'Developer' },
  { label: 'Creative', emoji: 'palette', name: 'Designer' },
  { label: 'Sparkle', emoji: 'sparkle', name: 'Spesial' },
  { label: 'Star', emoji: 'star', name: 'Top Member' },
  { label: 'Diamond', emoji: 'gem', name: 'Donatur' },
  { label: 'Flame', emoji: 'fire', name: 'Aktif' },
  { label: 'Rocket', emoji: 'rocket', name: 'Pioneer' },
  { label: 'Shield', emoji: 'shield', name: 'Moderator' },
  { label: 'Trophy', emoji: 'trophy', name: 'Juara' },
  { label: 'Lightning', emoji: 'bolt', name: 'Fast' },
  { label: 'Coffee', emoji: 'coffee', name: 'Supporter' },
  { label: 'Hunter', emoji: 'target', name: 'Bug Hunter' },
  { label: 'Idea', emoji: 'bulb', name: 'Inovator' },
  { label: 'Reader', emoji: 'book', name: 'Pembaca' },
]

const PRESET_COLORS = [
  '#3b82f6', // blue / verified
  '#6366f1', // indigo / core
  '#10b981', // emerald / verified
  '#f59e0b', // amber / vip
  '#ec4899', // pink / supporter
  '#8b5cf6', // purple / special
  '#ef4444', // red
  '#14b8a6', // teal
]

export default function UserBadgeManager({
  userId,
  userName,
  initialUserBadges,
  allBadges: initialAllBadges,
}: UserBadgeManagerProps) {
  const router = useRouter()
  const [userBadges, setUserBadges] = useState<UserBadgeItem[]>(initialUserBadges)
  const [availableBadges, setAvailableBadges] = useState<BadgeItem[]>(initialAllBadges)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state for creating new badge
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newBadgeName, setNewBadgeName] = useState('')
  const [newBadgeEmoji, setNewBadgeEmoji] = useState('✅')
  const [newBadgeColor, setNewBadgeColor] = useState('#10b981')

  // Map of assigned badge IDs for quick check
  const assignedBadgeIdMap = new Map(userBadges.map((ub) => [ub.badge_id, ub.id]))

  async function handleAssign(badgeId: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/user-badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, badge_id: badgeId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Gagal menambahkan badge')
      } else {
        setUserBadges((prev) => [...prev, data.userBadge])
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan jaringan')
    } finally {
      setLoading(false)
    }
  }

  async function handleUnassign(userBadgeId: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/user-badges?id=${userBadgeId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Gagal melepas badge')
      } else {
        setUserBadges((prev) => prev.filter((ub) => ub.id !== userBadgeId))
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan jaringan')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateAndAssign(e: React.FormEvent) {
    e.preventDefault()
    if (!newBadgeName.trim()) {
      setError('Nama badge tidak boleh kosong')
      return
    }

    setLoading(true)
    setError(null)
    try {
      // 1. Create the badge
      const createRes = await fetch('/api/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBadgeName.trim(),
          emoji: newBadgeEmoji.trim() || '🏆',
          color: newBadgeColor,
        }),
      })
      const createData = await createRes.json()

      if (!createRes.ok) {
        setError(createData.error || 'Gagal membuat badge baru')
        setLoading(false)
        return
      }

      const createdBadge: BadgeItem = createData.badge
      setAvailableBadges((prev) => [...prev, createdBadge])

      // 2. Assign to current user
      const assignRes = await fetch('/api/user-badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, badge_id: createdBadge.id }),
      })
      const assignData = await assignRes.json()

      if (!assignRes.ok) {
        setError(assignData.error || 'Badge dibuat namun gagal di-assign')
      } else {
        setUserBadges((prev) => [...prev, assignData.userBadge])
        setNewBadgeName('')
        setShowCreateForm(false)
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan saat memproses badge')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* Active Badges Display + Toggle Button */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {userBadges.map((ub) => (
          <CommunityBadge
            key={ub.id}
            badge={ub.badge}
            size="xs"
            onRemove={() => handleUnassign(ub.id)}
          />
        ))}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
            isOpen
              ? 'bg-text-primary text-background border-text-primary'
              : 'bg-thirdary/40 hover:bg-thirdary text-text-secondary hover:text-text-primary border-text-secondary/20 hover:border-text-secondary/40'
          }`}
          title="Kelola Badge"
        >
          <span>🏅</span>
          <span>{userBadges.length === 0 ? '+ Beri Badge' : 'Kelola'}</span>
        </button>
      </div>

      {/* Inline Management Panel */}
      {isOpen && (
        <div className="mt-3 p-4 rounded-xl border border-text-secondary/20 bg-background/95 backdrop-blur-xl shadow-xl space-y-3.5 z-20 text-xs text-text-primary max-w-sm">
          <div className="flex items-center justify-between border-b border-text-secondary/10 pb-2">
            <span className="font-bold text-text-primary">
              Kelola Badge — <span className="text-text-secondary font-normal">{userName}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setError(null)
              }}
              className="text-text-secondary hover:text-text-primary text-sm px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {error && (
            <p className="text-[11px] text-red-500 bg-red-500/10 border border-red-500/20 p-2 rounded-lg">
              {error}
            </p>
          )}

          {/* List of Available Badges to Toggle */}
          <div>
            <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Pilih Badge Tersedia:
            </p>
            {availableBadges.length === 0 ? (
              <p className="text-[11px] text-text-secondary italic">
                Belum ada koleksi badge di sistem. Buat badge pertama di bawah.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {availableBadges.map((b) => {
                  const assignedUserBadgeId = assignedBadgeIdMap.get(b.id)
                  const isAssigned = Boolean(assignedUserBadgeId)

                  return (
                    <button
                      key={b.id}
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        if (isAssigned && assignedUserBadgeId) {
                          handleUnassign(assignedUserBadgeId)
                        } else {
                          handleAssign(b.id)
                        }
                      }}
                      style={
                        isAssigned
                          ? {
                              backgroundColor: `${b.color}20`,
                              borderColor: b.color,
                              color: b.color,
                            }
                          : {
                              borderColor: `${b.color}35`,
                              color: b.color,
                            }
                      }
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                        isAssigned
                          ? 'ring-1 ring-offset-1 ring-offset-background ring-current shadow-xs'
                          : 'bg-thirdary/30 hover:bg-thirdary/60 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <BadgeIcon emoji={b.emoji} name={b.name} className="w-3.5 h-3.5" />
                      <span>{b.name}</span>
                      <span className="text-[10px] ml-0.5 opacity-80">
                        {isAssigned ? '✓' : '+'}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Quick Create New Badge Form */}
          <div className="pt-2 border-t border-text-secondary/10">
            {!showCreateForm ? (
              <button
                type="button"
                onClick={() => setShowCreateForm(true)}
                className="text-[11px] font-medium text-text-secondary hover:text-text-primary inline-flex items-center gap-1 cursor-pointer transition"
              >
                <span>+</span> <span>Buat jenis badge baru...</span>
              </button>
            ) : (
              <form onSubmit={handleCreateAndAssign} className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-text-primary">
                    Buat &amp; Assign Badge Baru
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="text-[10px] text-text-secondary hover:text-text-primary cursor-pointer"
                  >
                    Batal
                  </button>
                </div>

                {/* Preset Icon Selector */}
                <div>
                  <p className="text-[10px] uppercase font-semibold text-text-secondary tracking-wider mb-1.5">
                    Pilih Desain Icon:
                  </p>
                  <div className="grid grid-cols-4 gap-1.5 mb-2">
                    {ICON_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setNewBadgeEmoji(p.emoji)
                          if (!newBadgeName.trim() || ICON_PRESETS.some((ip) => ip.name === newBadgeName)) {
                            setNewBadgeName(p.name)
                          }
                        }}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                          newBadgeEmoji === p.emoji
                            ? 'border-text-primary bg-text-primary/10 text-text-primary font-bold'
                            : 'border-text-secondary/20 hover:border-text-secondary/40 text-text-secondary hover:text-text-primary bg-thirdary/20'
                        }`}
                      >
                        <BadgeIcon emoji={p.emoji} name={p.name} className="w-3 h-3" />
                        <span className="truncate">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex gap-2 items-center">
                    <div className="relative w-32 shrink-0">
                      <input
                        type="text"
                        value={newBadgeEmoji}
                        onChange={(e) => setNewBadgeEmoji(e.target.value)}
                        placeholder="Icon / Emoji"
                        title="Ketik icon, emoji, atau simbol bebas (mis: <>, ⚡, 🚀, 👾)"
                        className="w-full text-xs rounded-lg border border-text-secondary/20 bg-background pl-2.5 pr-8 py-1.5 text-text-primary focus:outline-none focus:border-text-primary"
                      />
                      <div
                        style={{ color: newBadgeColor }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
                        title="Preview icon"
                      >
                        <BadgeIcon emoji={newBadgeEmoji} name={newBadgeName} className="w-4 h-4" />
                      </div>
                    </div>
                    <input
                      type="text"
                      value={newBadgeName}
                      onChange={(e) => setNewBadgeName(e.target.value)}
                      placeholder="Nama badge (mis: Developer, VIP)"
                      required
                      className="flex-1 text-xs rounded-lg border border-text-secondary/20 bg-background px-2.5 py-1.5 text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-text-primary"
                    />
                  </div>
                  <p className="text-[10px] text-text-secondary/70 mt-1">
                    Bebas ketik emoji apa saja (mis: 👾, 🕹️), simbol kode (mis: <code className="text-text-primary">&lt;&gt;</code>), atau pilih cepat dari tombol di atas.
                  </p>
                </div>

                {/* Color Selector */}
                <div>
                  <p className="text-[10px] uppercase font-semibold text-text-secondary tracking-wider mb-1.5">
                    Warna Badge:
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewBadgeColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                          newBadgeColor.toLowerCase() === c.toLowerCase()
                            ? 'scale-125 border-white ring-2 ring-text-primary shadow-xs'
                            : 'border-black/20 hover:scale-110'
                        }`}
                        title={c}
                      />
                    ))}
                    <input
                      type="color"
                      value={newBadgeColor}
                      onChange={(e) => setNewBadgeColor(e.target.value)}
                      title="Pilih warna kustom"
                      className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-text-primary hover:opacity-90 text-background py-1.5 text-xs font-semibold tracking-wide transition disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {loading ? 'Memproses...' : 'Buat & Berikan ke Pengguna'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
