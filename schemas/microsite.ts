import { customAlphabet } from 'nanoid'
import { z } from 'zod'

const { slugRegex } = useAppConfig()

const slugDefaultLength = +useRuntimeConfig().public.slugDefaultLength

export const nanoid = (length: number = slugDefaultLength) => customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', length)

export const SocialLinkSchema = z.object({
  platform: z.enum(['github', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'facebook', 'website', 'email']),
  url: z.string().trim().url().max(2048),
})

export const MicrositeItemSchema = z.object({
  id: z.string().trim().max(26),
  title: z.string().trim().min(1).max(256),
  url: z.string().trim().url().max(2048),
  icon: z.string().trim().max(64).optional(),
  order: z.number().int().min(0).default(0),
  visible: z.boolean().default(true),
  gridSpan: z.enum(['1x1', '2x1', '2x2']).default('1x1'),
})

export const MicrositeSchema = z.object({
  id: z.string().trim().max(26).default(nanoid(10)),
  slug: z.string().trim().max(2048).regex(new RegExp(slugRegex)).default(nanoid()),
  title: z.string().trim().min(1).max(256),
  description: z.string().trim().max(2048).optional(),
  avatar: z.string().trim().max(128).optional(),
  avatarIcon: z.string().trim().max(64).optional(),
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  bgColor: z.string().trim().max(32).optional(),
  bgImage: z.preprocess(val => val === '' ? undefined : val, z.string().trim().url().max(2048).optional()),
  bgOverlayOpacity: z.number().min(0).max(1).optional(),
  textColor: z.string().trim().max(32).optional(),
  socialLinks: z.array(SocialLinkSchema).default([]),
  items: z.array(MicrositeItemSchema).default([]),
  createdAt: z.number().int().safe().default(() => Math.floor(Date.now() / 1000)),
  updatedAt: z.number().int().safe().default(() => Math.floor(Date.now() / 1000)),
  published: z.boolean().default(false),
})

export type Microsite = z.infer<typeof MicrositeSchema>
export type MicrositeItem = z.infer<typeof MicrositeItemSchema>

export interface ExportMicrositesData {
  version: string
  exportedAt: string
  count: number
  microsites: Microsite[]
  cursor?: string
  list_complete: boolean
}
