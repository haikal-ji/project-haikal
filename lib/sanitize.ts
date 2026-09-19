/**
 * HTML sanitizer untuk konten artikel yang ditulis via TipTap rich text editor.
 *
 * Mengizinkan tag & atribut yang umum dihasilkan TipTap, sambil memblokir
 * semua tag berbahaya (script, iframe, object, embed, dll.) beserta atribut
 * event handler (onclick, onload, onerror, dsb.) yang bisa dipakai untuk XSS.
 *
 * Dipakai:
 *  - Saat artikel DISIMPAN (app/api/articles/route.ts & [id]/route.ts) — sanitasi di sumber
 *  - Saat artikel DITAMPILKAN (app/artikel/[id]/page.tsx) — lapisan kedua untuk konten lama
 */

import sanitizeHtml from 'sanitize-html'

const ALLOWED_TAGS = [
  // Heading
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  // Blok teks
  'p', 'blockquote', 'pre', 'div',
  // Inline teks
  'span', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'code', 'mark',
  // List
  'ul', 'ol', 'li',
  // Link & media
  'a', 'img',
  // Lain-lain
  'br', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  // Task list TipTap
  'input',
]

const ALLOWED_ATTRS: sanitizeHtml.IOptions['allowedAttributes'] = {
  '*': ['class', 'style'],
  'a': ['href', 'target', 'rel'],
  'img': ['src', 'alt', 'width', 'height', 'loading'],
  'th': ['colspan', 'rowspan'],
  'td': ['colspan', 'rowspan'],
  'input': ['type', 'checked', 'disabled'],
}

// Style yang diizinkan (hanya yang dipakai TipTap — text-align, color, background)
const ALLOWED_STYLES: sanitizeHtml.IOptions['allowedStyles'] = {
  '*': {
    'text-align': [/^(left|right|center|justify)$/],
    'color': [/^#[0-9a-fA-F]{3,8}$/, /^rgb\(/, /^rgba\(/],
    'background-color': [/^#[0-9a-fA-F]{3,8}$/, /^rgb\(/, /^rgba\(/],
  },
}

export function sanitizeArticleHtml(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRS,
    allowedStyles: ALLOWED_STYLES,
    // Paksa semua link eksternal buka di tab baru + rel noopener noreferrer
    transformTags: {
      'a': (tagName, attribs) => {
        const href = attribs.href || ''
        const isExternal =
          href.startsWith('http://') ||
          href.startsWith('https://') ||
          href.startsWith('//')
        return {
          tagName,
          attribs: {
            ...attribs,
            ...(isExternal
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {}),
          },
        }
      },
    },
    // Izinkan src gambar dari domain yang sudah di-whitelist di next.config.ts
    allowedSchemesByTag: {
      img: ['https', 'data'],
      a: ['https', 'http', 'mailto'],
    },
  })
}
