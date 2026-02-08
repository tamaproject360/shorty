import { z } from 'zod'

const DeleteBodySchema = z.object({
  slug: z.string().trim().min(1).max(2048),
})

export default eventHandler(async (event) => {
  const { slug } = await readValidatedBody(event, DeleteBodySchema.parse)

  const normalizedSlug = normalizeMicrositeSlug(event, slug)
  const microsite = await getMicrosite(event, normalizedSlug)

  if (!microsite) {
    throw createError({
      status: 404,
      statusText: 'Microsite not found',
    })
  }

  await deleteMicrosite(event, normalizedSlug)

  return { success: true }
})
