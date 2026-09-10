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
          'min-h-[420px] text-text-primary leading-relaxed focus:outline-none [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mt-6 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_blockquote]:border-l-2 [&_blockquote]:border-text-secondary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_img]:max-w-full [&_img]:rounded-xl [&_img]:my-6 [&_img]:border [&_img]:border-text-secondary/15',
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

  const getButtonClass = (isActive: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
      isActive
        ? 'bg-text-primary text-background border-text-primary font-bold shadow-xs'
        : 'bg-background/70 hover:bg-thirdary text-text-secondary hover:text-text-primary border-text-secondary/20'
    }`

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-1.5 border-b border-text-secondary/15 pb-4 mb-5"
        aria-label="Toolbar editor"
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Tebal (Bold)"
          className={getButtonClass(editor.isActive('bold'))}
        >
          <b>B</b>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Miring (Italic)"
          className={getButtonClass(editor.isActive('italic'))}
        >
          <span className="italic font-serif">I</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Subjudul (H2)"
          className={getButtonClass(editor.isActive('heading', { level: 2 }))}
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Daftar (List)"
          className={getButtonClass(editor.isActive('bulletList'))}
        >
          • List
        </button>

        <div className="h-4 w-px bg-text-secondary/20 mx-1 hidden sm:block" />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Upload gambar dari komputer"
          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-text-secondary/20 bg-background/70 hover:bg-thirdary text-text-secondary hover:text-text-primary transition-all duration-150 flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Upload Gambar
        </button>

        <button
          type="button"
          onClick={insertImageFromUrl}
          title="Tambah gambar dari URL luar"
          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-text-secondary/20 bg-background/70 hover:bg-thirdary text-text-secondary hover:text-text-primary transition-all duration-150 flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          URL Gambar
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  )
}
