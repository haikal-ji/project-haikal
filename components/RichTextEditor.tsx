'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RichTextEditor({
  content,
  onChange,
}: {
  content: string
  onChange: (html: string) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const editor = useEditor({
    extensions: [StarterKit, ImageExtension],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[220px] w-full rounded-md border border-gray-300 p-3 focus:outline-none [&_img]:max-w-full [&_img]:rounded-md',
      },
    },
  })

  // Sinkronkan kalau content dari luar berubah (mis. saat data edit selesai di-fetch)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    const fileName = `content-${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from('article-images').upload(fileName, file)

    if (error) {
      alert('Gagal upload gambar: ' + error.message)
      return
    }

    const { data: publicUrlData } = supabase.storage.from('article-images').getPublicUrl(data.path)

    editor.chain().focus().setImage({ src: publicUrlData.publicUrl }).run()
    e.target.value = ''
  }

  function insertImageFromUrl() {
    const url = window.prompt('Masukkan URL gambar:')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  if (!editor) return null

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded border px-2 py-1 text-sm font-bold ${editor.isActive('bold') ? 'bg-black text-white' : ''}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded border px-2 py-1 text-sm italic ${editor.isActive('italic') ? 'bg-black text-white' : ''}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`rounded border px-2 py-1 text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-black text-white' : ''}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded border px-2 py-1 text-sm ${editor.isActive('bulletList') ? 'bg-black text-white' : ''}`}
        >
          List
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded border px-2 py-1 text-sm"
        >
          Upload Gambar
        </button>
        <button type="button" onClick={insertImageFromUrl} className="rounded border px-2 py-1 text-sm">
          Gambar dari URL
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
