'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <main className="standalone-page contact-page">
      <div className="contact-page-topline">
        <p className="section-index">Contact</p>
        <Link href="/" className="editorial-link">← Beranda</Link>
      </div>
      <h1 className="font-serif">Mari terhubung dengan saya.</h1>
      <div className="contact-layout">
        <form className="contact-form" onSubmit={handleSubmit}>
          <p>Terbuka untuk kolaborasi, percakapan, atau sekadar bertukar ide.</p>
          <div className="contact-fields">
            <label>Nama<input required name="name" placeholder="Nama kamu" /></label>
            <label>Email<input required type="email" name="email" placeholder="nama@email.com" /></label>
          </div>
          <label>Pesan<textarea required name="message" placeholder="Ceritakan sedikit tentang idemu..." rows={5} /></label>
          <button type="submit" className="contact-submit">{sent ? 'Pesan siap dikirim' : 'Kirim pesan'} <span>↗</span></button>
          {sent && <p className="contact-success">Terima kasih. Pesanmu sudah dicatat.</p>}
        </form>
        <aside className="contact-details">
          <div><h2 className="font-serif">Email</h2><a href="mailto:mlbbus0208@gmail.com">mlbbus0208@gmail.com</a></div>
          <div><h2 className="font-serif">Social</h2><a href="https://instagram.com/__02ekall" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://github.com/haikal-ji" target="_blank" rel="noreferrer">GitHub ↗</a></div>
        </aside>
      </div>
    </main>
  )
}
