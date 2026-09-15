'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastContextValue {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => string
  removeToast: (id: string) => void
  success: (title: string, description?: string, duration?: number) => string
  error: (title: string, description?: string, duration?: number) => string
  info: (title: string, description?: string, duration?: number) => string
  warning: (title: string, description?: string, duration?: number) => string
}

const ToastContext = createContext<ToastContextValue | null>(null)

type ToastListener = (toast: Omit<ToastItem, 'id'>) => void
const listeners = new Set<ToastListener>()

export const toast = {
  success: (title: string, description?: string, duration?: number) => {
    listeners.forEach((l) => l({ type: 'success', title, description, duration }))
  },
  error: (title: string, description?: string, duration?: number) => {
    listeners.forEach((l) => l({ type: 'error', title, description, duration }))
  },
  info: (title: string, description?: string, duration?: number) => {
    listeners.forEach((l) => l({ type: 'info', title, description, duration }))
  },
  warning: (title: string, description?: string, duration?: number) => {
    listeners.forEach((l) => l({ type: 'warning', title, description, duration }))
  },
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    return {
      toasts: [],
      addToast: () => '',
      removeToast: () => {},
      ...toast,
    }
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (item: Omit<ToastItem, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const newToast: ToastItem = { ...item, id }
      setToasts((prev) => [...prev.slice(-3), newToast])
      return id
    },
    []
  )

  useEffect(() => {
    const listener: ToastListener = (t) => {
      addToast(t)
    }
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [addToast])

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success: (title, desc, dur) => addToast({ type: 'success', title, description: desc, duration: dur }),
        error: (title, desc, dur) => addToast({ type: 'error', title, description: desc, duration: dur }),
        info: (title, desc, dur) => addToast({ type: 'info', title, description: desc, duration: dur }),
        warning: (title, desc, dur) => addToast({ type: 'warning', title, description: desc, duration: dur }),
      }}
    >
      {children}
      {/* Sleek bottom-right notification stack */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[99999] flex flex-col-reverse gap-2 pointer-events-none max-w-sm w-[calc(100vw-2.5rem)] select-none"
      >
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={() => removeToast(item.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const duration = item.duration ?? 3500

  useEffect(() => {
    if (duration <= 0) return
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [duration, onDismiss])

  // Minimalist crisp status indicators (Vercel / Linear style)
  const icon = {
    success: (
      <svg className="w-3 h-3 text-emerald-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13.25 4.75 6 12 2.75 8.75" />
      </svg>
    ),
    error: (
      <svg className="w-3 h-3 text-rose-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4 4 12M4 4l8 8" />
      </svg>
    ),
    warning: (
      <svg className="w-3 h-3 text-amber-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3.5v5M8 11.5v.5" />
      </svg>
    ),
    info: (
      <svg className="w-3 h-3 text-zinc-300" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 4.5v.5M8 7.5v4" />
      </svg>
    ),
  }[item.type]

  const indicatorDot = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    info: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20',
  }[item.type]

  return (
    <div
      role="status"
      onClick={onDismiss}
      className="pointer-events-auto group cursor-pointer relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#0c0c0e]/95 text-zinc-100 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.55),0_1px_0_rgba(255,255,255,0.06)_inset] backdrop-blur-xl transition-all duration-200 hover:border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${indicatorDot}`}>
        {icon}
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <p className="text-[13px] font-medium tracking-tight text-zinc-100 leading-snug">
          {item.title}
        </p>
        {item.description && (
          <p className="text-[12px] text-zinc-400 leading-normal mt-0.5 truncate">
            {item.description}
          </p>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onDismiss()
        }}
        className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 shrink-0"
        aria-label="Tutup"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 4 4 12M4 4l8 8" />
        </svg>
      </button>
    </div>
  )
}
