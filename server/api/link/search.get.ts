import type { LinkSchema } from '@@/schemas/link'
import type { z } from 'zod'

type Link = z.infer<typeof LinkSchema>

interface SearchResult {
  slug: string
  url: string
  comment?: string
}

export default eventHandler(async (_event) => {
  const storage = useStorage('data')
  const list: SearchResult[] = []

  try {
    const keys = await storage.getKeys('link:')

    for (const key of keys) {
      try {
        const link = await storage.getItem<Link>(key)
        if (link) {
          list.push({
            slug: key.replace('link:', ''),
            url: link.url,
            comment: link.comment,
          })
        }
      }
      catch (err) {
        console.error(`Error processing key ${key}:`, err)
        continue
      }
    }

    return list
  }
  catch (err) {
    console.error('Error fetching link list:', err)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch link list',
    })
  }
})
