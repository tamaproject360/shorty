import { z } from 'zod'

const GetQuerySchema = z.object({
  slug: z.string().trim().min(1).max(2048),
})

export default eventHandler(async (event) => {
  const { slug } = await getValidatedQuery(event, GetQuerySchema.parse)

  const normalizedSlug = normalizeMicrositeSlug(event, slug)
  const microsite = await getMicrosite(event, normalizedSlug)

  if (!microsite) {
    throw createError({
      status: 404,
      statusText: 'Microsite not found',
    })
  }

  return microsite
})
