'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ToastProvider'

export type ReactionType = 'LIKE' | 'DISLIKE'

interface ReactionButtonsProps {
  articleId: string
  initialLikeCount?: number
  initialDislikeCount?: number
  initialReaction?: ReactionType | string | null
  initialShareCount?: number
  isLoggedIn: boolean
  articleTitle?: string
}

export default function ReactionButtons({
  articleId,
  initialLikeCount = 0,
  initialDislikeCount = 0,
  initialReaction = null,
  initialShareCount = 0,
  isLoggedIn,
  articleTitle = 'Artikel Haikal',
}: ReactionButtonsProps) {
  const router = useRouter()

  // Normalize initial reaction
  const normalizedInitialReaction: ReactionType | null =
    initialReaction === 'LIKE' ||
    initialReaction === 'KEREN' ||
    initialReaction === 'MANTAP' ||
    initialReaction === 'BERGUNA' ||
    initialReaction === 'NGAKAK' ||
    initialReaction === 'KAGET'
      ? 'LIKE'
      : initialReaction === 'DISLIKE' || initialReaction === 'BOSEN'
      ? 'DISLIKE'
      : null

  const [likeCount, setLikeCount] = useState<number>(initialLikeCount)
  const [dislikeCount, setDislikeCount] = useState<number>(initialDislikeCount)
  const [userReaction, setUserReaction] = useState<ReactionType | null>(normalizedInitialReaction)
  const [activeAnim, setActiveAnim] = useState<'LIKE' | 'DISLIKE' | null>(null)
  const [burstKey, setBurstKey] = useState<number>(0)
  const animTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Non-blocking sync queue refs (menghilangkan delay saat klik like/dislike berulang)
  const targetReactionRef = useRef<ReactionType | null>(normalizedInitialReaction)
  const serverReactionRef = useRef<ReactionType | null>(normalizedInitialReaction)
  const isSyncingRef = useRef(false)

  useEffect(() => {
    targetReactionRef.current = normalizedInitialReaction
    serverReactionRef.current = normalizedInitialReaction
    setUserReaction(normalizedInitialReaction)
  }, [normalizedInitialReaction])

  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current)
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [])

  // Share state
  const [shareCount, setShareCount] = useState(initialShareCount)
  const [copied, setCopied] = useState(false)

  function requireLogin() {
    router.push(
      `/login?message=${encodeURIComponent(
        'Kamu harus login dulu untuk memberikan reaksi'
      )}&type=warning`
    )
  }

  async function syncWithServer() {
    if (isSyncingRef.current) return
    isSyncingRef.current = true

    try {
      while (targetReactionRef.current !== serverReactionRef.current) {
        const target = targetReactionRef.current
        const server = serverReactionRef.current

        let typeToSend: ReactionType | null = null

        if (target === null) {
          if (server === null) break
          typeToSend = server
        } else {
          typeToSend = target
        }

        if (!typeToSend) break

        const res = await fetch('/api/reaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ article_id: articleId, type: typeToSend }),
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Gagal menyimpan reaksi')
        }

        serverReactionRef.current = (data.userReaction as ReactionType | null) ?? null

        // Jika target user sudah tercapai dan tidak ada klik baru, sinkronkan data resmi dari server
        if (targetReactionRef.current === serverReactionRef.current) {
          if (typeof data.likeCount === 'number') setLikeCount(data.likeCount)
          if (typeof data.dislikeCount === 'number') setDislikeCount(data.dislikeCount)
          setUserReaction(serverReactionRef.current)
        }
      }
    } catch (err: unknown) {
      // Rollback jika terjadi error jaringan
      setUserReaction(serverReactionRef.current)
      targetReactionRef.current = serverReactionRef.current
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem'
      toast.error(msg)
    } finally {
      isSyncingRef.current = false
      if (targetReactionRef.current !== serverReactionRef.current) {
        syncWithServer()
      }
    }
  }

  function handleReaction(type: ReactionType) {
    if (!isLoggedIn) {
      requireLogin()
      return
    }

    // Bersihkan timer animasi sebelumnya jika ada
    if (animTimeoutRef.current) {
      clearTimeout(animTimeoutRef.current)
      animTimeoutRef.current = null
    }

    const isRemovingReaction = userReaction === type

    // Animasi +1 / -1 hanya muncul saat menambah atau mengganti reaksi, BUKAN saat membatalkan (klik kedua)
    if (isRemovingReaction) {
      setActiveAnim(null)
    } else {
      setActiveAnim(type)
      setBurstKey(Date.now())
      animTimeoutRef.current = setTimeout(() => {
        setActiveAnim(null)
        animTimeoutRef.current = null
      }, 550)
    }

    // Optimistic Update instan tanpa delay
    let nextLikeCount = likeCount
    let nextDislikeCount = dislikeCount
    let nextUserReaction: ReactionType | null = null

    if (userReaction === type) {
      // Toggle off: klik reaksi yang sama menghapus reaksi
      nextUserReaction = null
      if (type === 'LIKE') {
        nextLikeCount = Math.max(0, nextLikeCount - 1)
      } else {
        nextDislikeCount = Math.max(0, nextDislikeCount - 1)
      }
    } else if (userReaction !== null) {
      // Switch reaksi
      nextUserReaction = type
      if (type === 'LIKE') {
        nextLikeCount = nextLikeCount + 1
        nextDislikeCount = Math.max(0, nextDislikeCount - 1)
      } else {
        nextDislikeCount = nextDislikeCount + 1
        nextLikeCount = Math.max(0, nextLikeCount - 1)
      }
    } else {
      // Reaksi baru
      nextUserReaction = type
      if (type === 'LIKE') {
        nextLikeCount = nextLikeCount + 1
      } else {
        nextDislikeCount = nextDislikeCount + 1
      }
    }

    // Instant UI Update (0ms, langsung responsif)
    setUserReaction(nextUserReaction)
    setLikeCount(nextLikeCount)
    setDislikeCount(nextDislikeCount)
    targetReactionRef.current = nextUserReaction

    // Debounce sinkronisasi ke server (400ms) untuk mencegah spam klik & rate limiting 429
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null
      syncWithServer()
    }, 400)
  }

  // Handle Share with Anti-Spam (Session Deduplication)
  async function incrementShare(channel: string) {
    if (typeof window === 'undefined') return

    // Cek apakah user sudah pernah mencatat share untuk artikel ini di sesi saat ini
    const sessionKey = `shared_${articleId}_${channel}`
    const alreadyShared = sessionStorage.getItem(sessionKey)

    if (alreadyShared) {
      // Jangan hit API lagi agar tidak terjadi spam penghitungan di database
      return
    }

    try {
      sessionStorage.setItem(sessionKey, 'true')
      const res = await fetch(`/api/articles/${articleId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel }),
      })
      if (res.ok) {
        const data = await res.json()
        if (typeof data.shareCount === 'number') {
          setShareCount(data.shareCount)
        }
      }
    } catch {
      // Abaikan error background analytics
    }
  }

  function handleShareWhatsApp() {
    if (typeof window === 'undefined') return
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Baca artikel menarik: "${articleTitle}"`)
    incrementShare('whatsapp')
    window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank', 'noopener,noreferrer')
  }

  function handleShareTwitter() {
    if (typeof window === 'undefined') return
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`"${articleTitle}" oleh Haikal`)
    incrementShare('twitter')
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer')
  }

  async function handleCopyLink() {
    if (typeof window === 'undefined') return

    // Jika sedang dalam status 'Tersalin' (cooldown 2.5 detik), cegah spam klik
    if (copied) return

    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)

      const sessionKey = `shared_${articleId}_copy`
      const isFirstCopy = !sessionStorage.getItem(sessionKey)

      if (isFirstCopy) {
        toast.success('Tautan artikel berhasil disalin!')
        incrementShare('copy')
      } else {
        toast.info('Tautan disalin ke clipboard')
      }

      // Reset status copied setelah 2.5 detik (cooldown anti-spam)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast.error('Gagal menyalin tautan')
    }
  }

  async function handleNativeShare() {
    if (typeof window === 'undefined') return
    if (navigator.share) {
      try {
        await navigator.share({
          title: articleTitle,
          url: window.location.href,
        })
        incrementShare('native')
      } catch {
        // Pengguna membatalkan dialog share bawaan
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <div className="rounded-2xl border border-text-secondary/15 bg-background/50 dark:bg-thirdary/30 p-4 sm:p-5 backdrop-blur-md transition-all duration-300 shadow-sm relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Segmented Reaction Capsule */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary/70 mr-1 hidden sm:inline-block">
            Tanggapan
          </span>

          <div className="inline-flex items-center p-1 rounded-xl bg-thirdary/50 dark:bg-black/40 border border-text-secondary/15 shadow-inner">
            {/* Tombol LIKE 👍 */}
            <button
              type="button"
              onClick={() => handleReaction('LIKE')}
              className={`group relative inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer select-none ${
                userReaction === 'LIKE'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background/60'
              } active:scale-95`}
              title={userReaction === 'LIKE' ? 'Batalkan apresiasi' : 'Beri apresiasi (Suka)'}
              aria-pressed={userReaction === 'LIKE'}
            >
              {/* Ambient Glow */}
              {activeAnim === 'LIKE' && (
                <span
                  key={`glow-like-${burstKey}`}
                  className="anim-reaction-glow absolute inset-0 m-auto rounded-lg bg-foreground/15 pointer-events-none"
                />
              )}

              {/* Floating +1 Badge */}
              {activeAnim === 'LIKE' && (
                <span
                  key={`float-like-${burstKey}`}
                  className="anim-reaction-badge absolute -top-2 left-1/2 pointer-events-none z-30 whitespace-nowrap rounded-full bg-foreground text-background px-2 py-0.5 text-[10px] font-mono font-bold shadow-md"
                >
                  +1
                </span>
              )}

              <svg
                className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                  activeAnim === 'LIKE' ? 'anim-reaction-up' : 'group-hover:-translate-y-0.5'
                }`}
                viewBox="0 0 24 24"
                fill={userReaction === 'LIKE' ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={userReaction === 'LIKE' ? '1.5' : '2'}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
              <span className="font-mono text-xs font-bold tracking-tight">{likeCount}</span>
              <span className="text-[11px] opacity-80 hidden md:inline">
                {userReaction === 'LIKE' ? 'Disukai' : 'Suka'}
              </span>
            </button>

            {/* Subtle Divider */}
            <div className="h-4 w-px bg-text-secondary/15 mx-0.5" />

            {/* Tombol DISLIKE 👎 */}
            <button
              type="button"
              onClick={() => handleReaction('DISLIKE')}
              className={`group relative inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer select-none ${
                userReaction === 'DISLIKE'
                  ? 'bg-text-secondary/25 text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background/60'
              } active:scale-95`}
              title={userReaction === 'DISLIKE' ? 'Batalkan' : 'Kurang suka artikel ini'}
              aria-pressed={userReaction === 'DISLIKE'}
            >
              {/* Ambient Glow */}
              {activeAnim === 'DISLIKE' && (
                <span
                  key={`glow-dislike-${burstKey}`}
                  className="anim-reaction-glow absolute inset-0 m-auto rounded-lg bg-text-secondary/20 pointer-events-none"
                />
              )}

              <svg
                className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                  activeAnim === 'DISLIKE' ? 'anim-reaction-down' : 'group-hover:translate-y-0.5'
                }`}
                viewBox="0 0 24 24"
                fill={userReaction === 'DISLIKE' ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={userReaction === 'DISLIKE' ? '1.5' : '2'}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
              </svg>
              <span className="font-mono text-xs font-bold tracking-tight">{dislikeCount}</span>
            </button>
          </div>
        </div>

        {/* Action Bagikan dengan Anti-Spam */}
        <div className="flex items-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-text-secondary/10">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary/70 mr-1 hidden xs:inline-block">
            Bagikan
          </span>

          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center h-9 w-9 rounded-xl border border-text-secondary/15 bg-background/60 hover:bg-[#25D366]/10 hover:border-[#25D366]/40 hover:text-[#25D366] text-text-secondary transition-all duration-200 cursor-pointer active:scale-95"
            title="Bagikan ke WhatsApp"
            aria-label="Bagikan ke WhatsApp"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </button>

          {/* Twitter / X */}
          <button
            type="button"
            onClick={handleShareTwitter}
            className="flex items-center justify-center h-9 w-9 rounded-xl border border-text-secondary/15 bg-background/60 hover:bg-foreground hover:text-background text-text-secondary transition-all duration-200 cursor-pointer active:scale-95"
            title="Bagikan ke X (Twitter)"
            aria-label="Bagikan ke X"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>

          {/* Copy Link (Dengan Cooldown & Status Tersalin) */}
          <button
            type="button"
            onClick={handleCopyLink}
            disabled={copied}
            className={`flex items-center justify-center h-9 px-3 gap-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
              copied
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default'
                : 'border-text-secondary/15 bg-background/60 hover:border-text-secondary/35 text-text-secondary hover:text-text-primary cursor-pointer active:scale-95'
            }`}
            title={copied ? 'Tautan sudah disalin' : 'Salin tautan artikel'}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 animate-in fade-in" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Tersalin</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Salin</span>
              </>
            )}
          </button>

          {/* Web Share (Mobile) */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="flex items-center justify-center h-9 w-9 rounded-xl border border-text-secondary/15 bg-background/60 hover:bg-foreground hover:text-background text-text-secondary transition-all duration-200 cursor-pointer sm:hidden"
            title="Bagikan"
            aria-label="Bagikan"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>

          {/* Share Counter Pill */}
          {shareCount > 0 && (
            <span className="text-[11px] font-mono font-medium text-text-secondary/70 ml-1">
              · {shareCount} dibagikan
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
