'use client'

import React from 'react'

export interface BadgeData {
  id?: string
  name: string
  emoji?: string | null
  color?: string | null
}

interface CommunityBadgeProps {
  badge: BadgeData
  size?: 'xs' | 'sm' | 'md'
  onRemove?: () => void
  interactive?: boolean
  className?: string
}

// Render vector icon based on emoji or name keywords
export function BadgeIcon({
  emoji,
  name,
  className = 'w-3.5 h-3.5',
}: {
  emoji?: string | null
  name?: string
  className?: string
}) {
  const e = (emoji || '').trim().toLowerCase()
  const n = (name || '').trim().toLowerCase()

  // 1. Verified check seal (Twitter/Discord/Instagram style)
  if (
    e === '✅' ||
    e === '✔' ||
    e === 'verified' ||
    e === 'check' ||
    n.includes('verified') ||
    n.includes('centang')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0 drop-shadow-xs`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="m8.6 22.5-1.9-3.2-3.6-.8.4-3.7L1 12l2.5-2.8-.4-3.7 3.6-.8 1.9-3.2L12 2.9l3.4-1.4 1.9 3.2 3.6.8-.4 3.7L23 12l-2.5 2.8.4 3.7-3.6.8-1.9 3.2-3.4-1.4-3.4 1.4zm2-6.5 6-6-1.4-1.4-4.6 4.6-2.2-2.2-1.4 1.4 3.6 3.6z" />
      </svg>
    )
  }

  // 2. Royal Crown / VIP
  if (
    e === '👑' ||
    e === 'crown' ||
    e === 'vip' ||
    n.includes('vip') ||
    n.includes('crown') ||
    n.includes('raja') ||
    n.includes('sultan')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
      </svg>
    )
  }

  // 3. Sparkle / Special
  if (
    e === '✨' ||
    e === 'sparkle' ||
    e === 'special' ||
    n.includes('special') ||
    n.includes('spesial')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2zm7 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zM5 3l.8 2.2L8 6l-2.2.8L5 9l-.8-2.2L2 6l2.2-.8L5 3z" />
      </svg>
    )
  }

  // 4. Star / Top Member
  if (
    e === '⭐' ||
    e === 'star' ||
    e === 'bintang' ||
    n.includes('star') ||
    n.includes('bintang') ||
    n.includes('top')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    )
  }

  // 5. Diamond / Gem
  if (
    e === '💎' ||
    e === 'gem' ||
    e === 'diamond' ||
    n.includes('diamond') ||
    n.includes('permata') ||
    n.includes('donatur')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16 2H8L2 8.5 12 22 22 8.5 16 2zm-4.7 2h1.4l3.5 4.5H7.8L11.3 4zm-3.6.4L4.8 8.5H3.6L7.7 4.4zm8.6 0l4.1 4.1h-1.2l-2.9-4.1z" />
      </svg>
    )
  }

  // 6. Flame / Fire / Active
  if (
    e === '🔥' ||
    e === 'fire' ||
    e === 'flame' ||
    n.includes('aktif') ||
    n.includes('api') ||
    n.includes('hype')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 23c-4.97 0-9-4.03-9-9 0-4.08 2.76-7.83 6.32-9.28.32-.13.68.08.72.43.08.76.35 2.14 1.28 2.85.12.09.28.09.4 0 .93-.71 1.2-2.09 1.28-2.85.04-.35.4-.56.72-.43C17.24 6.17 20 9.92 20 14c0 4.97-4.03 9-9 9z" />
      </svg>
    )
  }

  // 7. Shield / Moderator
  if (
    e === '🛡️' ||
    e === 'shield' ||
    e === 'guard' ||
    n.includes('mod') ||
    n.includes('admin') ||
    n.includes('staff')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 15.5l-3.5-3.5 1.41-1.41L11 13.67l5.09-5.09L17.5 10 11 16.5z" />
      </svg>
    )
  }

  // 8. Trophy / Champion
  if (
    e === '🏆' ||
    e === 'trophy' ||
    e === 'award' ||
    n.includes('juara') ||
    n.includes('winner')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
      </svg>
    )
  }

  // 9. Bolt / Fast
  if (e === '⚡' || e === 'bolt' || e === 'flash') {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M7 2v11h3v9l7-12h-4l4-8z" />
      </svg>
    )
  }

  // 10. Heart / Supporter
  if (e === '❤️' || e === 'heart' || e === 'love') {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    )
  }

  // 11. Rocket / Booster / Pioneer
  if (
    e === '🚀' ||
    e === 'rocket' ||
    e === 'booster' ||
    n.includes('rocket') ||
    n.includes('pioneer') ||
    n.includes('booster')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M13.13 2.21a11.95 11.95 0 0 0-4.34 2.28c-1.47 1.34-2.45 3.06-2.91 4.96l-3.32 1.92a1 1 0 0 0-.46.86v3.2a1 1 0 0 0 .53.88l3.65 1.95c.29 1.13.84 2.18 1.63 3.07l.27.27a1 1 0 0 0 .71.29h3.2a1 1 0 0 0 .86-.49l1.9-3.3c1.9-.46 3.62-1.44 4.96-2.91a11.97 11.97 0 0 0 2.28-4.34 1 1 0 0 0-.25-.97l-7.76-7.76a1 1 0 0 0-.95-.29zm.87 6.79a2 2 0 1 1 2.83-2.83 2 2 0 0 1-2.83 2.83z" />
      </svg>
    )
  }

  // 12. Code / Developer
  if (
    e === '💻' ||
    e === 'code' ||
    e === 'dev' ||
    e === '<>' ||
    e === '</>' ||
    e === '< >' ||
    n.includes('dev') ||
    n.includes('code') ||
    n.includes('program')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
      </svg>
    )
  }

  // 13. Palette / Design / Creative
  if (
    e === '🎨' ||
    e === 'palette' ||
    e === 'design' ||
    n.includes('design') ||
    n.includes('desain') ||
    n.includes('kreatif')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19c-.48.6.01 1.48.78 1.39l2.76-.32C9.28 20.65 10.59 21 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-5 8c-.83 0-1.5-.67-1.5-1.5S6.17 8 7 8s1.5.67 1.5 1.5S7.83 11 7 11zm3-3c-.83 0-1.5-.67-1.5-1.5S9.17 5 10 5s1.5.67 1.5 1.5S10.83 8 10 8zm4 0c-.83 0-1.5-.67-1.5-1.5S13.17 5 14 5s1.5.67 1.5 1.5S14.83 8 14 8zm3 3c-.83 0-1.5-.67-1.5-1.5S16.17 8 17 8s1.5.67 1.5 1.5S17.83 11 17 11z" />
      </svg>
    )
  }

  // 14. Coffee / Traktir
  if (
    e === '☕' ||
    e === 'coffee' ||
    e === 'kopi' ||
    n.includes('kopi') ||
    n.includes('coffee') ||
    n.includes('traktir')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M2 19h18v2H2v-2zm18-12h-2V5h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2zm-4 7H4c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v9c0 1.1-.9 2-2 2zm2-5V5h-2v4h2z" />
      </svg>
    )
  }

  // 15. Target / Bug Hunter
  if (
    e === '🎯' ||
    e === 'target' ||
    e === 'hunter' ||
    n.includes('bug') ||
    n.includes('hunter') ||
    n.includes('tester')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
      </svg>
    )
  }

  // 16. Idea / Lightbulb / Inovator
  if (
    e === '💡' ||
    e === 'bulb' ||
    e === 'idea' ||
    n.includes('ide') ||
    n.includes('idea') ||
    n.includes('inovator')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
      </svg>
    )
  }

  // 17. Book / Reader / Pembaca Setia
  if (
    e === '📖' ||
    e === '📚' ||
    e === 'book' ||
    e === 'reader' ||
    n.includes('baca') ||
    n.includes('reader') ||
    n.includes('kutu buku')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
      </svg>
    )
  }

  // Fallback: render original emoji / character
  return <span className="leading-none select-none text-[12px]">{emoji || '🏅'}</span>
}

export default function CommunityBadge({
  badge,
  size = 'sm',
  onRemove,
  interactive = false,
  className = '',
}: CommunityBadgeProps) {
  const color = badge.color || '#3b82f6'

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[9px] gap-1',
    sm: 'px-2 py-0.5 text-[10px] sm:text-[11px] gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  }[size]

  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  }[size]

  return (
    <span
      style={{
        backgroundColor: `${color}14`,
        borderColor: `${color}35`,
        color: color,
        boxShadow: `0 1px 4px ${color}12`,
      }}
      className={`inline-flex items-center rounded-full font-semibold tracking-wide border backdrop-blur-md select-none transition-all duration-200 ${sizeClasses} ${
        interactive ? 'hover:scale-[1.03] hover:brightness-110 cursor-pointer' : ''
      } ${className}`}
    >
      <BadgeIcon emoji={badge.emoji} name={badge.name} className={iconSizeClasses} />
      <span className="font-semibold">{badge.name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          title={`Lepas badge ${badge.name}`}
          className="ml-0.5 -mr-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-white/20 transition cursor-pointer"
        >
          <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 fill-current" aria-hidden="true">
            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
          </svg>
        </button>
      )}
    </span>
  )
}
