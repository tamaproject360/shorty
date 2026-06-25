import { describe, expect, it, vi } from 'vitest'

vi.stubGlobal('useAppConfig', () => ({ slugRegex: '^[a-zA-Z0-9_-]+$' }))
vi.stubGlobal('useRuntimeConfig', () => ({ public: { slugDefaultLength: 6 } }))

const { MicrositeItemSchema } = await import('../../schemas/microsite')

describe('micrositeItemSchema', () => {
  it('accepts supported microsite item component types', () => {
    const supportedTypes = [
      'link',
      'separator',
      'text',
      'profile',
      'image',
      'embed',
      'whatsapp',
      'email',
      'phone',
      'instagram',
      'facebook',
      'tiktok',
      'telegram',
      'countdown',
    ]

    for (const type of supportedTypes) {
      const result = MicrositeItemSchema.safeParse({
        id: type,
        type,
        title: type,
        url: 'https://example.com',
      })

      expect(result.success, `${type} should be supported`).toBe(true)
    }
  })

  it('rejects maps item component type', () => {
    const result = MicrositeItemSchema.safeParse({
      id: 'maps',
      type: 'maps',
      title: 'Maps',
      url: 'https://example.com',
    })

    expect(result.success).toBe(false)
  })

  it('treats null item description as omitted', () => {
    const result = MicrositeItemSchema.safeParse({
      id: 'imported-link',
      type: 'link',
      title: 'Imported Link',
      url: 'https://example.com',
      description: null,
    })

    expect(result.success).toBe(true)
    expect(result.data?.description).toBeUndefined()
  })
})
