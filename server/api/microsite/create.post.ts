import { MicrositeSchema, nanoid } from '@@/schemas/microsite'

export default eventHandler(async (event) => {
  const body = await readValidatedBody(event, MicrositeSchema.partial({ id: true, slug: true, createdAt: true, updatedAt: true }).parse)

  const now = Math.floor(Date.now() / 1000)

  const microsite = MicrositeSchema.parse({
    ...body,
    id: nanoid(10)(),
    slug: body.slug || nanoid()(),
    createdAt: now,
    updatedAt: now,
  })

  const normalizedSlug = normalizeMicrositeSlug(event, microsite.slug)

  if (await micrositeExists(event, normalizedSlug)) {
    throw createError({
      status: 409,
      statusText: 'Microsite slug already exists',
    })
  }

  microsite.slug = normalizedSlug

  await putMicrosite(event, microsite)

  return microsite
})
