import { LinkSchema } from '@@/schemas/link'

const slugValidator = LinkSchema.shape.slug

export default eventHandler(async (event) => {
  const storage = useStorage('images')
  const key = getRouterParam(event, 'key')

  if (!key) {
    throw createError({ status: 400, statusText: 'Key is required' })
  }

  // Only allow access to images/ path
  if (!key.startsWith('images/')) {
    throw createError({ status: 403, statusText: 'Access denied' })
  }

  // Validate slug in path: images/{slug}/{filename}
  const parts = key.split('/')
  if (parts.length < 3) {
    throw createError({ status: 400, statusText: 'Invalid path format' })
  }

  const slug = parts[1]
  const slugResult = slugValidator.safeParse(slug)
  if (!slugResult.success) {
    throw createError({ status: 400, statusText: 'Invalid slug format' })
  }

  // Check if item exists first
  if (!await storage.hasItem(key)) {
    throw createError({ status: 404, statusText: 'Image not found' })
  }

  const object = await storage.getItemRaw(key)

  // Simple content type inference based on extension
  const ext = key.split('.').pop()?.toLowerCase()
  const mimeTypes: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  }
  const contentType = (ext && mimeTypes[ext]) || 'application/octet-stream'

  setHeader(event, 'Content-Type', contentType)
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

  // ETag generation (simple)
  // setHeader(event, 'ETag', object.etag)

  return object
})
