import type { LinkSchema } from '@@/schemas/link'
import type { H3Event } from 'h3'
import type { z } from 'zod'

type Link = z.infer<typeof LinkSchema>

export function normalizeSlug(event: H3Event, slug: string): string {
  const { caseSensitive } = useRuntimeConfig(event)
  return caseSensitive ? slug : slug.toLowerCase()
}

export function buildShortLink(event: H3Event, slug: string): string {
  return `${getRequestProtocol(event)}://${getRequestHost(event)}/${slug}`
}

export async function putLink(event: H3Event, link: Link): Promise<void> {
  const storage = useStorage('data')
  // const expiration = getExpiration(event, link.expiration)
  // We ignore native KV expiration for generic storage, relying on app logic if needed
  await storage.setItem(`link:${link.slug}`, link)
}

export async function getLink(event: H3Event, slug: string): Promise<Link | null> {
  const storage = useStorage('data')
  return await storage.getItem<Link>(`link:${slug}`)
}

export async function getLinkWithMetadata(event: H3Event, slug: string): Promise<{ link: Link | null, metadata: Record<string, unknown> | null }> {
  const link = await getLink(event, slug)
  if (!link)
    return { link: null, metadata: null }

  return {
    link,
    metadata: {
      url: link.url,
      comment: link.comment,
    },
  }
}

export async function deleteLink(event: H3Event, slug: string): Promise<void> {
  const storage = useStorage('data')
  await storage.removeItem(`link:${slug}`)
}

export async function linkExists(event: H3Event, slug: string): Promise<boolean> {
  const link = await getLink(event, slug)
  return link !== null
}

interface ListLinksOptions {
  limit: number
  cursor?: string
}

interface ListLinksResult {
  links: (Link | null)[]
  list_complete: boolean
  cursor?: string
}

export async function listLinks(event: H3Event, options: ListLinksOptions): Promise<ListLinksResult> {
  const storage = useStorage('data')
  const keys = await storage.getKeys('link:')

  // Basic pagination for generic storage
  const startIndex = options.cursor ? Number.parseInt(options.cursor) : 0
  const endIndex = startIndex + options.limit

  const pagedKeys = keys.slice(startIndex, endIndex)
  const list_complete = endIndex >= keys.length

  const links = await Promise.all(
    pagedKeys.map(async (key) => {
      return await storage.getItem<Link>(key)
    }),
  )

  return {
    links,
    list_complete,
    cursor: list_complete ? undefined : endIndex.toString(),
  }
}
