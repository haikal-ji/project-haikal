'use client'

import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback)
  return () => window.removeEventListener('popstate', callback)
}

function getSnapshot() {
  return new URLSearchParams(window.location.search).get('message') ?? ''
}

function getServerSnapshot() {
  return ''
}

export default function LoginMessage() {
  const message = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  if (!message) return null
  return <p className="login-message">{message}</p>
}
