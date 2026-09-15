'use client'

import { useState, useSyncExternalStore } from 'react'

export type AuthMessageType = 'success' | 'error' | 'warning'

export interface AuthMessagePayload {
  message: string
  type: AuthMessageType
}

export interface AuthMessageProps {
  override?: AuthMessagePayload | null
}

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback)
  return () => window.removeEventListener('popstate', callback)
}

function getSnapshot(): string {
  if (typeof window === 'undefined') return ''
  const params = new URLSearchParams(window.location.search)
  const message = params.get('message')
  const error = params.get('error')

  if (!message && !error) return ''

  if (message) {
    const rawType = params.get('type')
    const type: AuthMessageType =
      rawType === 'success' || rawType === 'error' || rawType === 'warning'
        ? rawType
        : 'warning'
    return `${type}:::${message}`
  }

  if (error) {
    const errText =
      error === 'auth-failed'
        ? 'Autentikasi gagal atau tautan telah kedaluwarsa. Silakan coba login kembali.'
        : error
    return `error:::${errText}`
  }

  return ''
}

function getServerSnapshot(): string {
  return ''
}

export default function AuthMessage({ override }: AuthMessageProps) {
  const rawQuery = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const queryData: AuthMessagePayload | null = rawQuery
    ? {
        type: rawQuery.slice(0, rawQuery.indexOf(':::')) as AuthMessageType,
        message: rawQuery.slice(rawQuery.indexOf(':::') + 3),
      }
    : null

  // Override takes priority over query string
  const active = override?.message ? override : queryData

  const [dismissedKey, setDismissedKey] = useState<string | null>(null)
  const [prevOverride, setPrevOverride] = useState(override)

  // Reset dismissed state whenever override prop changes
  if (override !== prevOverride) {
    setPrevOverride(override)
    setDismissedKey(null)
  }

  if (!active || !active.message) return null

  const currentKey = `${active.type}:${active.message}`
  if (dismissedKey === currentKey) return null

  const theme = {
    success: {
      container: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-800 dark:text-emerald-300',
      iconBadge: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
      closeBtn: 'text-emerald-700/60 hover:text-emerald-900 dark:text-emerald-300/60 dark:hover:text-emerald-100 hover:bg-emerald-500/10',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ),
    },
    error: {
      container: 'bg-red-500/10 border-red-500/25 text-red-800 dark:text-red-300',
      iconBadge: 'bg-red-500/20 border-red-500/30 text-red-600 dark:text-red-400',
      closeBtn: 'text-red-700/60 hover:text-red-900 dark:text-red-300/60 dark:hover:text-red-100 hover:bg-red-500/10',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      ),
    },
    warning: {
      container: 'bg-amber-500/10 border-amber-500/25 text-amber-800 dark:text-amber-300',
      iconBadge: 'bg-amber-500/20 border-amber-500/30 text-amber-700 dark:text-amber-400',
      closeBtn: 'text-amber-700/60 hover:text-amber-900 dark:text-amber-300/60 dark:hover:text-amber-100 hover:bg-amber-500/10',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      ),
    },
  }[active.type]

  return (
    <div
      role="alert"
      className={`relative mb-6 flex items-start gap-3 rounded-xl border p-3.5 text-xs sm:text-sm leading-relaxed transition-all duration-200 ${theme.container}`}
    >
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border mt-0.5 ${theme.iconBadge}`}
      >
        {theme.icon}
      </div>
      <p className="flex-1 font-medium break-words pt-0.5">
        {active.message}
      </p>
      <button
        type="button"
        onClick={() => setDismissedKey(currentKey)}
        className={`-mr-1 -mt-0.5 p-1 rounded-md transition-colors cursor-pointer shrink-0 ${theme.closeBtn}`}
        aria-label="Tutup pesan"
      >
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
