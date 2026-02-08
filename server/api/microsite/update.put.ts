import { MicrositeSchema } from '@@/schemas/microsite'

export default eventHandler(async (event) => {
  const body = await readValidatedBody(event, MicrositeSchema.partial({ id: true, createdAt: true, items: true }).parse)

  const normalizedSlug = normalizeMicrositeSlug(event, body.slug)
  const existingMicrosite = await getMicrosite(event, normalizedSlug)

  if (!existingMicrosite) {
    throw createError({
      status: 404,
      statusText: 'Microsite not found',
    })
  }

  const now = Math.floor(Date.now() / 1000)

  const updatedMicrosite = MicrositeSchema.parse({
    ...existingMicrosite,
    ...body,
    id: existingMicrosite.id,
    slug: normalizedSlug,
    createdAt: existingMicrosite.createdAt,
    updatedAt: now,
  })

  await putMicrosite(event, updatedMicrosite)

  return updatedMicrosite
})
