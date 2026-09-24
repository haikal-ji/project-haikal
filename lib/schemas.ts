import { z } from 'zod'

// Helper untuk URL opsional (bisa null, undefined, string kosong, atau URL valid)
const optionalUrl = z
  .union([
    z.string().url('Format URL tidak valid'),
    z.literal(''),
  ])
  .nullish()

// Helper untuk hex color opsional (contoh: #7c4a35)
const optionalHexColor = z
  .union([
    z
      .string()
      .trim()
      .regex(/^#[0-9a-fA-F]{6}$/, 'Format warna harus hex (contoh: #7c4a35)'),
    z.literal(''),
  ])
  .nullish()

// 1. Comment
export const createCommentSchema = z.object({
  article_id: z.string().trim().min(1, 'article_id tidak boleh kosong'),
  content: z
    .string()
    .trim()
    .min(1, 'Komentar tidak boleh kosong')
    .max(1000, 'Komentar maksimal 1000 karakter'),
})

export const updateCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Komentar tidak boleh kosong')
    .max(1000, 'Komentar maksimal 1000 karakter'),
})

// 2. Reaction
export const createReactionSchema = z.object({
  article_id: z.string().trim().min(1, 'article_id tidak boleh kosong'),
  type: z.enum(['LIKE', 'DISLIKE'] as const),
})

// 3. Profile
export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama tidak boleh kosong')
    .max(100, 'Nama maksimal 100 karakter'),
  avatar: optionalUrl,
  bio: z
    .string()
    .max(200, 'Bio maksimal 160 karakter')
    .nullish()
    .transform((val) => (val && val.trim() ? val.trim().slice(0, 160) : null)),
})

// 4. Articles
export const articleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Judul wajib diisi')
    .max(200, 'Judul maksimal 200 karakter'),
  content: z
    .string()
    .trim()
    .min(1, 'Konten wajib diisi')
    .max(50000, 'Konten maksimal 50000 karakter'),
  thumbnail: optionalUrl,
})

// 5. Badges
export const createBadgeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama badge harus diisi')
    .max(50, 'Nama badge maksimal 50 karakter'),
  emoji: z.string().trim().max(10, 'Emoji maksimal 10 karakter').nullish(),
  color: optionalHexColor,
})

// 6. User Badges
export const createUserBadgeSchema = z.object({
  user_id: z.string().trim().min(1, 'user_id diperlukan'),
  badge_id: z.string().trim().min(1, 'badge_id diperlukan'),
})

// 7. Admin Ban
export const adminBanSchema = z.object({
  userId: z.string().trim().min(1, 'userId diperlukan'),
  reason: z.string().trim().max(500, 'Alasan ban maksimal 500 karakter').nullish(),
  unban: z.boolean().optional(),
})

// 8. Admin Appeal
export const createAppealSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(20, 'Alasan permohonan harus diisi minimal 20 karakter')
    .max(1000, 'Alasan permohonan maksimal 1000 karakter'),
})

export const reviewAppealSchema = z.object({
  appealId: z.string().trim().min(1, 'appealId diperlukan'),
  action: z.enum(['APPROVED', 'REJECTED'] as const),
  adminNote: z.string().trim().max(500, 'Catatan admin maksimal 500 karakter').nullish(),
})
