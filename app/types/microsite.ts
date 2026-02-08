export interface Microsite {
  id: string
  slug: string
  title: string
  description?: string
  avatar?: string
  theme: 'light' | 'dark' | 'auto'
  bgColor?: string
  textColor?: string
  items: MicrositeItem[]
  createdAt: number
  updatedAt: number
  published: boolean
}

export interface MicrositeItem {
  id: string
  title: string
  url: string
  order: number
  visible: boolean
}

export type MicrositeUpdateType = 'create' | 'update' | 'delete'
