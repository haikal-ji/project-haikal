'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import { Underline } from '@tiptap/extension-underline'
import { Link } from '@tiptap/extension-link'
import { TextAlign } from '@tiptap/extension-text-align'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Highlight } from '@tiptap/extension-highlight'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/ToastProvider'
import { convertHeicToJpeg } from '@/lib/image-converter'
import {
  LuBold,
  LuItalic,
  LuUnderline,
  LuStrikethrough,
  LuCode,
  LuHighlighter,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuAlignJustify,
  LuList,
  LuListOrdered,
  LuListTodo,
  LuQuote,
  LuSquareCode,
  LuMinus,
  LuLink,
  LuUnlink,
  LuImage,
  LuImagePlus,
  LuUndo2,
  LuRedo2,
  LuRemoveFormatting,
  LuX,
  LuCheck,
} from 'react-icons/lu'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // State untuk interactive inline inputs (Link & Image URL) agar tidak tergantung window.prompt
  const [showLinkBar, setShowLinkBar] = useState(false)
  const [linkInput, setLinkInput] = useState('')
  const [showImageUrlBar, setShowImageUrlBar] = useState(false)
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  // Force re-render on selection update so active toolbar state updates instantly
  const [, setEditorTick] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Highlight.configure({
        multicolor: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-emerald-500 underline underline-offset-4 hover:text-emerald-400 font-medium',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      ImageExtension.configure({
        inline: false,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: 'Mulai tulis konten artikelmu di sini... Gunakan toolbar di atas untuk memformat teks, menambahkan subjudul, kutipan, checklist, atau gambar.',
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
      setEditorTick((t) => t + 1)
    },
    onSelectionUpdate: () => {
      setEditorTick((t) => t + 1)
    },
    onTransaction: () => {
      setEditorTick((t) => t + 1)
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[500px] p-6 sm:p-8 text-text-primary leading-relaxed focus:outline-none ' +
          '[&_h1]:text-3xl [&_h1]:sm:text-4xl [&_h1]:font-black [&_h1]:tracking-tight [&_h1]:text-text-primary [&_h1]:mt-8 [&_h1]:mb-4 ' +
          '[&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-text-primary [&_h2]:mt-7 [&_h2]:mb-3 ' +
          '[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-text-primary [&_h3]:mt-6 [&_h3]:mb-2 ' +
          '[&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-text-primary/90 ' +
          '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5 ' +
          '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1.5 ' +
          '[&_li]:leading-relaxed ' +
          '[&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:bg-thirdary/30 [&_blockquote]:pl-4 [&_blockquote]:py-2.5 [&_blockquote]:my-5 [&_blockquote]:italic [&_blockquote]:rounded-r-xl ' +
          '[&_pre]:bg-neutral-900 [&_pre]:text-neutral-100 [&_pre]:p-4.5 [&_pre]:rounded-2xl [&_pre]:my-6 [&_pre]:border [&_pre]:border-neutral-800 [&_pre]:overflow-x-auto [&_pre]:font-mono [&_pre]:text-sm ' +
          '[&_code]:font-mono [&_code]:text-xs [&_code]:bg-thirdary/80 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-emerald-500 [&_code]:border [&_code]:border-text-secondary/15 ' +
          '[&_pre_code]:border-none [&_pre_code]:bg-transparent [&_pre_code]:text-neutral-100 [&_pre_code]:p-0 ' +
          '[&_hr]:border-t [&_hr]:border-text-secondary/20 [&_hr]:my-8 ' +
          '[&_a]:text-emerald-500 [&_a]:underline [&_a]:underline-offset-4 ' +
          '[&_img]:max-w-full [&_img]:rounded-2xl [&_img]:my-6 [&_img]:border [&_img]:border-text-secondary/20 [&_img]:shadow-md',
      },
    },
  })

  // Sinkronkan saat data edit awal selesai di-fetch
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const rawFile = e.target.files?.[0]
    if (!rawFile || !editor) return

    setUploadingImage(true)
    try {
      const file = await convertHeicToJpeg(rawFile)
      const fileName = `content-${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage.from('article-images').upload(fileName, file)

      if (error) {
        toast.error('Gagal upload gambar', error.message)
        return
      }

      const { data: publicUrlData } = supabase.storage.from('article-images').getPublicUrl(data.path)
      editor.chain().focus().setImage({ src: publicUrlData.publicUrl }).run()
      toast.success('Gambar berhasil diunggah')
    } catch (err: any) {
      toast.error('Gagal upload gambar', err.message)
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  function handleApplyLink() {
    if (!editor) return
    const url = linkInput.trim()
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      toast.info('Tautan dilepas')
    } else {
      const href = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') ? url : `https://${url}`
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
      toast.success('Tautan disisipkan')
    }
    setShowLinkBar(false)
  }

  function handleOpenLinkBar() {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href || ''
    setLinkInput(previousUrl)
    setShowLinkBar((prev) => !prev)
    setShowImageUrlBar(false)
  }

  function handleApplyImageUrl() {
    if (!editor) return
    const url = imageUrlInput.trim()
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
      setImageUrlInput('')
      setShowImageUrlBar(false)
      toast.success('Gambar disisipkan')
    } else {
      toast.warning('Masukkan URL gambar terlebih dahulu')
    }
  }

  if (!editor) return null

  // Perhitungan statistik yang akurat
  const plainText = editor.getText() || ''
  const trimmed = plainText.trim()
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0
  const charCount = plainText.length
  
  // Perhitungan waktu baca: 0 menit jika kosong, < 1 menit jika < 60 kata, dan ~X menit jika >= 60 kata
  const readingTimeLabel = 
    wordCount === 0 
      ? '0 menit baca' 
      : wordCount < 60 
        ? '< 1 menit baca' 
        : `~${Math.ceil(wordCount / 180)} menit baca`

  // Helper button: onMouseDown preventDefault sangat penting agar cursor editor tidak hilang saat klik tombol!
  const renderBtn = (
    onClick: () => void,
    isActive: boolean,
    title: string,
    children: React.ReactNode,
    disabled = false
  ) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault() // Mencegah hilangnya seleksi teks di editor!
      }}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`min-w-[34px] h-[34px] px-2 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center justify-center cursor-pointer select-none disabled:opacity-25 disabled:cursor-not-allowed ${
        isActive
          ? 'bg-text-primary text-background shadow-xs ring-1 ring-text-primary font-bold'
          : 'bg-background/80 hover:bg-thirdary text-text-secondary hover:text-text-primary border border-text-secondary/15 active:scale-95'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="w-full rounded-2xl border border-text-secondary/20 bg-background/50 overflow-hidden shadow-sm">
      {/* Sticky & Comprehensive Toolbar */}
      <div
        className="sticky top-0 z-10 flex flex-wrap items-center gap-1.5 p-3 border-b border-text-secondary/15 bg-background/95 backdrop-blur-md"
        aria-label="Toolbar editor lengkap"
      >
        {/* 1. History: Undo / Redo */}
        <div className="flex items-center gap-1">
          {renderBtn(
            () => editor.chain().focus().undo().run(),
            false,
            'Urungkan (Ctrl+Z)',
            <LuUndo2 className="w-4 h-4" />,
            !editor.can().undo()
          )}
          {renderBtn(
            () => editor.chain().focus().redo().run(),
            false,
            'Ulangi (Ctrl+Y)',
            <LuRedo2 className="w-4 h-4" />,
            !editor.can().redo()
          )}
        </div>

        <div className="h-5 w-px bg-text-secondary/20 mx-1" />

        {/* 2. Headings & Paragraph */}
        <div className="flex items-center gap-1">
          {renderBtn(
            () => editor.chain().focus().setParagraph().run(),
            editor.isActive('paragraph') && !editor.isActive('heading'),
            'Paragraf Biasa',
            <span className="text-xs font-bold px-0.5">P</span>
          )}
          {renderBtn(
            () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            editor.isActive('heading', { level: 1 }),
            'Judul 1 (H1)',
            <LuHeading1 className="w-4 h-4" />
          )}
          {renderBtn(
            () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            editor.isActive('heading', { level: 2 }),
            'Subjudul 2 (H2)',
            <LuHeading2 className="w-4 h-4" />
          )}
          {renderBtn(
            () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            editor.isActive('heading', { level: 3 }),
            'Sub-bagian 3 (H3)',
            <LuHeading3 className="w-4 h-4" />
          )}
        </div>

        <div className="h-5 w-px bg-text-secondary/20 mx-1" />

        {/* 3. Text Formatting: Bold, Italic, Underline, Strike, Highlight, Inline Code */}
        <div className="flex items-center gap-1">
          {renderBtn(
            () => editor.chain().focus().toggleBold().run(),
            editor.isActive('bold'),
            'Tebal (Ctrl+B)',
            <LuBold className="w-4 h-4" />
          )}
          {renderBtn(
            () => editor.chain().focus().toggleItalic().run(),
            editor.isActive('italic'),
            'Miring (Ctrl+I)',
            <LuItalic className="w-4 h-4" />
          )}
          {renderBtn(
            () => editor.chain().focus().toggleUnderline().run(),
            editor.isActive('underline'),
            'Garis Bawah (Ctrl+U)',
            <LuUnderline className="w-4 h-4" />
          )}
          {renderBtn(
            () => editor.chain().focus().toggleStrike().run(),
            editor.isActive('strike'),
            'Coretan (Strikethrough)',
            <LuStrikethrough className="w-4 h-4" />
          )}
          {renderBtn(
            () => editor.chain().focus().toggleHighlight().run(),
            editor.isActive('highlight'),
            'Stabilo / Highlight Kuning',
            <LuHighlighter className="w-4 h-4 text-amber-400" />
          )}
          {renderBtn(
            () => editor.chain().focus().toggleCode().run(),
            editor.isActive('code'),
            'Kode Sebaris (Inline Code)',
            <LuCode className="w-4 h-4" />
          )}
        </div>

        <div className="h-5 w-px bg-text-secondary/20 mx-1" />

        {/* 4. Text Alignment */}
        <div className="flex items-center gap-1">
          {renderBtn(
            () => editor.chain().focus().setTextAlign('left').run(),
            editor.isActive({ textAlign: 'left' }),
            'Rata Kiri',
            <LuAlignLeft className="w-4 h-4" />
          )}
          {renderBtn(
            () => editor.chain().focus().setTextAlign('center').run(),
            editor.isActive({ textAlign: 'center' }),
            'Rata Tengah',
            <LuAlignCenter className="w-4 h-4" />
          )}
          {renderBtn(
            () => editor.chain().focus().setTextAlign('right').run(),
            editor.isActive({ textAlign: 'right' }),
            'Rata Kanan',
            <LuAlignRight className="w-4 h-4" />
          )}
          {renderBtn(
            () => editor.chain().focus().setTextAlign('justify').run(),
            editor.isActive({ textAlign: 'justify' }),
            'Rata Kanan-Kiri (Justify)',
            <LuAlignJustify className="w-4 h-4" />
          )}
        </div>

        <div className="h-5 w-px bg-text-secondary/20 mx-1" />

        {/* 5. Lists & Task List */}
        <div className="flex items-center gap-1">
          {renderBtn(
            () => editor.chain().focus().toggleBulletList().run(),
            editor.isActive('bulletList'),
            'Daftar Poin (Bullet List)',
            <LuList className="w-4 h-4" />
          )}
          {renderBtn(
            () => editor.chain().focus().toggleOrderedList().run(),
            editor.isActive('orderedList'),
            'Daftar Nomor (Numbered List)',
            <LuListOrdered className="w-4 h-4" />
          )}
          {renderBtn(
            () => editor.chain().focus().toggleTaskList().run(),
            editor.isActive('taskList'),
            'Daftar Checklist / Tugas',
            <LuListTodo className="w-4 h-4" />
          )}
        </div>

        <div className="h-5 w-px bg-text-secondary/20 mx-1" />

        {/* 6. Blocks: Quote, Code Block, Horizontal Divider */}
        <div className="flex items-center gap-1">
          {renderBtn(
            () => editor.chain().focus().toggleBlockquote().run(),
            editor.isActive('blockquote'),
            'Kutipan (Blockquote)',
            <LuQuote className="w-4 h-4" />
          )}
          {renderBtn(
            () => editor.chain().focus().toggleCodeBlock().run(),
            editor.isActive('codeBlock'),
            'Blok Kode (Code Block)',
            <LuSquareCode className="w-4 h-4" />
          )}
          {renderBtn(
            () => editor.chain().focus().setHorizontalRule().run(),
            false,
            'Garis Pemisah (Horizontal Rule)',
            <LuMinus className="w-4 h-4" />
          )}
        </div>

        <div className="h-5 w-px bg-text-secondary/20 mx-1" />

        {/* 7. Links */}
        <div className="flex items-center gap-1">
          {renderBtn(
            handleOpenLinkBar,
            editor.isActive('link') || showLinkBar,
            editor.isActive('link') ? 'Edit Tautan' : 'Sisipkan Tautan',
            <LuLink className="w-4 h-4" />
          )}
          {editor.isActive('link') &&
            renderBtn(
              () => editor.chain().focus().unsetLink().run(),
              false,
              'Hapus Tautan',
              <LuUnlink className="w-4 h-4 text-red-400" />
            )}
        </div>

        <div className="h-5 w-px bg-text-secondary/20 mx-1" />

        {/* 8. Media: Upload & URL */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            title="Upload gambar dari perangkat"
            className="h-[34px] px-2.5 rounded-xl text-xs font-semibold border border-text-secondary/15 bg-background/80 hover:bg-thirdary text-text-secondary hover:text-text-primary transition-all duration-150 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <LuImagePlus className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">{uploadingImage ? 'Mengupload...' : 'Upload'}</span>
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setShowImageUrlBar((prev) => !prev)
              setShowLinkBar(false)
            }}
            title="Sisipkan gambar dari URL"
            className={`h-[34px] px-2.5 rounded-xl text-xs font-semibold border transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
              showImageUrlBar
                ? 'bg-text-primary text-background border-text-primary shadow-xs'
                : 'border-text-secondary/15 bg-background/80 hover:bg-thirdary text-text-secondary hover:text-text-primary'
            }`}
          >
            <LuImage className="w-4 h-4" />
            <span className="hidden sm:inline">URL</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <div className="h-5 w-px bg-text-secondary/20 mx-1" />

        {/* 9. Reset Format */}
        {renderBtn(
          () => editor.chain().focus().unsetAllMarks().clearNodes().run(),
          false,
          'Bersihkan Semua Format Teks',
          <LuRemoveFormatting className="w-4 h-4" />
        )}
      </div>

      {/* Inline Interactive Link Bar (No window.prompt popup!) */}
      {showLinkBar && (
        <div className="flex items-center gap-2 p-3 bg-thirdary/60 border-b border-text-secondary/20 animate-fade-in">
          <LuLink className="w-4 h-4 text-text-secondary shrink-0 ml-1" />
          <input
            type="url"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleApplyLink()
              }
              if (e.key === 'Escape') {
                setShowLinkBar(false)
              }
            }}
            placeholder="Masukkan URL tautan (contoh: https://google.com)..."
            autoFocus
            className="flex-1 bg-background border border-text-secondary/20 rounded-xl px-3 py-1.5 text-xs text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-text-primary"
          />
          <button
            type="button"
            onClick={handleApplyLink}
            className="px-3 py-1.5 rounded-xl bg-text-primary text-background text-xs font-bold hover:opacity-90 flex items-center gap-1"
          >
            <LuCheck className="w-3.5 h-3.5" />
            <span>Terapkan</span>
          </button>
          {editor.isActive('link') && (
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().extendMarkRange('link').unsetLink().run()
                setShowLinkBar(false)
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20"
            >
              Hapus
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowLinkBar(false)}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-thirdary"
          >
            <LuX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Inline Interactive Image URL Bar */}
      {showImageUrlBar && (
        <div className="flex items-center gap-2 p-3 bg-thirdary/60 border-b border-text-secondary/20 animate-fade-in">
          <LuImage className="w-4 h-4 text-text-secondary shrink-0 ml-1" />
          <input
            type="url"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleApplyImageUrl()
              }
              if (e.key === 'Escape') {
                setShowImageUrlBar(false)
              }
            }}
            placeholder="Masukkan direct URL gambar (contoh: https://images.unsplash.com/...)..."
            autoFocus
            className="flex-1 bg-background border border-text-secondary/20 rounded-xl px-3 py-1.5 text-xs text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-text-primary"
          />
          <button
            type="button"
            onClick={handleApplyImageUrl}
            className="px-3 py-1.5 rounded-xl bg-text-primary text-background text-xs font-bold hover:opacity-90 flex items-center gap-1"
          >
            <LuCheck className="w-3.5 h-3.5" />
            <span>Sisipkan</span>
          </button>
          <button
            type="button"
            onClick={() => setShowImageUrlBar(false)}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-thirdary"
          >
            <LuX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor Content Canvas */}
      <div className="relative bg-background cursor-text" onClick={() => editor.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>

      {/* Bottom Info & Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-text-secondary/15 bg-thirdary/30 text-xs text-text-secondary font-medium">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span>
            <strong className="text-text-primary font-bold">{wordCount}</strong> kata
          </span>
          <span className="opacity-30">·</span>
          <span>
            <strong className="text-text-primary font-bold">{charCount}</strong> karakter
          </span>
          <span className="opacity-30">·</span>
          <span className={wordCount > 0 ? 'text-emerald-500 font-semibold' : 'text-text-secondary'}>
            {readingTimeLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-text-secondary/70">
          <span className={`inline-block w-2 h-2 rounded-full ${wordCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-text-secondary/40'}`} />
          <span>{wordCount > 0 ? 'Konten Terisi' : 'Draft Kosong'}</span>
        </div>
      </div>
    </div>
  )
}
