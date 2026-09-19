'use client'

import { useState, useCallback } from 'react'
import CommentForm from '@/components/CommentForm'
import CommentItem, { type CommentData } from '@/components/CommentItem'

interface CommentSectionProps {
  articleId: string
  initialComments: CommentData[]
  isOwner: boolean
  isLoggedIn: boolean
  currentUser?: {
    id: string
    name: string
    avatar: string | null
    email?: string | null
  } | null
  authorId: string
}

function tempId() {
  return `optimistic-${Date.now()}-${Math.random()}`
}

export default function CommentSection({
  articleId,
  initialComments,
  isOwner,
  isLoggedIn,
  currentUser,
  authorId,
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>(initialComments)

  const handleOptimisticAdd = useCallback(
    (content: string): string => {
      if (!currentUser) return ''
      const id = tempId()
      const optimisticComment: CommentData = {
        id,
        content,
        created_at: new Date(),
        user_id: currentUser.id,
        user: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          badges: [],
        },
      }
      setComments((prev) => [optimisticComment, ...prev])
      return id
    },
    [currentUser]
  )

  const handleOptimisticRollback = useCallback((optimisticId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== optimisticId))
  }, [])

  const handleOptimisticReplace = useCallback(
    (optimisticId: string, realComment: CommentData) => {
      setComments((prev) =>
        prev.map((c) => (c.id === optimisticId ? realComment : c))
      )
    },
    []
  )

  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary mb-1">
        Komentar Komunitas{' '}
        <span className="text-text-secondary font-normal text-xl">
          ({comments.length})
        </span>
      </h2>
      <p className="text-xs sm:text-sm text-text-secondary mt-1 mb-8">
        Bagikan gagasan, tanggapan, atau umpan balik seputar tulisan ini.
      </p>

      <div className="mb-10">
        <CommentForm
          articleId={articleId}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onOptimisticAdd={handleOptimisticAdd}
          onOptimisticRollback={handleOptimisticRollback}
          onOptimisticReplace={handleOptimisticReplace}
        />
      </div>

      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isPending = comment.id.startsWith('optimistic-')
            return (
              <div
                key={comment.id}
                className={isPending ? 'opacity-60 pointer-events-none transition-opacity duration-300' : 'transition-opacity duration-300'}
              >
                <CommentItem
                  comment={comment}
                  isOwner={isOwner}
                  isAuthor={comment.user_id === currentUser?.id}
                  isArticleAuthor={comment.user.id === authorId}
                  onDeleted={(id) =>
                    setComments((prev) => prev.filter((c) => c.id !== id))
                  }
                />
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-text-secondary/20 p-10 sm:p-14 text-center bg-thirdary/10">
          <div className="w-12 h-12 rounded-2xl bg-thirdary/60 border border-text-secondary/15 flex items-center justify-center text-text-secondary/70 mx-auto mb-3 shadow-xs">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-text-primary tracking-tight">
            Belum ada komentar
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-sm mx-auto">
            Jadilah orang pertama yang memulai percakapan dan membagikan sudut pandangmu!
          </p>
        </div>
      )}
    </>
  )
}
