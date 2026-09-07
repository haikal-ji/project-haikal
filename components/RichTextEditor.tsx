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
          'editor-prose [&_img]:max-w-full [&_img]:rounded-md',
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
    <div className="rich-editor">
      <div className="rich-editor-toolbar" aria-label="Toolbar editor">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Tebal"
          className={`rich-tool rich-tool-bold ${editor.isActive('bold') ? 'is-active' : ''}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Miring"
          className={`rich-tool rich-tool-italic ${editor.isActive('italic') ? 'is-active' : ''}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Subjudul"
          className={`rich-tool ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Daftar"
          className={`rich-tool ${editor.isActive('bulletList') ? 'is-active' : ''}`}
        >
          •••
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Upload gambar"
          className="rich-tool rich-tool-wide"
        >
          + Gambar
        </button>
      <button type="button" onClick={insertImageFromUrl} title="Tambah gambar dari URL" className="rich-tool rich-tool-wide">
          URL gambar
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
