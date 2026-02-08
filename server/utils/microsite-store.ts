import type { MicrositeSchema } from '@@/schemas/microsite'
import type { H3Event } from 'h3'
import type { z } from 'zod'

type Microsite = z.infer<typeof MicrositeSchema>

export function normalizeMicrositeSlug(event: H3Event, slug: string): string {
  const { caseSensitive } = useRuntimeConfig(event)
  return caseSensitive ? slug : slug.toLowerCase()
}

export async function putMicrosite(event: H3Event, microsite: Microsite): Promise<void> {
  const storage = useStorage('data')
  await storage.setItem(`microsite:${microsite.slug}`, microsite)
}

export async function getMicrosite(event: H3Event, slug: string): Promise<Microsite | null> {
  const storage = useStorage('data')
  return await storage.getItem<Microsite>(`microsite:${slug}`)
}

export async function deleteMicrosite(event: H3Event, slug: string): Promise<void> {
  const storage = useStorage('data')
  await storage.removeItem(`microsite:${slug}`)
}

export async function micrositeExists(event: H3Event, slug: string): Promise<boolean> {
  const microsite = await getMicrosite(event, slug)
  return microsite !== null
}

interface ListMicrositesOptions {
  limit: number
  cursor?: string
}

interface ListMicrositesResult {
  microsites: (Microsite | null)[]
  list_complete: boolean
  cursor?: string
}

export async function listMicrosites(event: H3Event, options: ListMicrositesOptions): Promise<ListMicrositesResult> {
  const storage = useStorage('data')
  const keys = await storage.getKeys('microsite:')

  const startIndex = options.cursor ? Number.parseInt(options.cursor) : 0
  const endIndex = startIndex + options.limit

  const pagedKeys = keys.slice(startIndex, endIndex)
  const list_complete = endIndex >= keys.length

  const microsites = await Promise.all(
    pagedKeys.map(async (key) => {
      return await storage.getItem<Microsite>(key)
    }),
  )

  return {
    microsites,
    list_complete,
    cursor: list_complete ? undefined : endIndex.toString(),
  }
}
