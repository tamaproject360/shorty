export interface Microsite {
  id: string
  slug: string
  title: string
  description?: string
  avatar?: string
  avatarIcon?: string
  theme: 'light' | 'dark' | 'auto'
  bgColor?: string
  bgImage?: string
  bgOverlayOpacity?: number
  textColor?: string
  socialLinks?: SocialLink[]
  items: MicrositeItem[]
  createdAt: number
  updatedAt: number
  published: boolean
}

export interface SocialLink {
  platform: 'github' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'facebook' | 'website' | 'email'
  url: string
}

export interface MicrositeItem {
  id: string
  title: string
  url: string
  icon?: string
  order: number
  visible: boolean
  gridSpan?: '1x1' | '2x1' | '2x2'
}

export type MicrositeUpdateType = 'create' | 'update' | 'delete'
