import { MicrositeSchema, nanoid } from '@@/schemas/microsite'

export default eventHandler(async (event) => {
  const rawBody = await readBody(event)
  const body = safeValidate(rawBody, MicrositeSchema.partial({ id: true, slug: true, createdAt: true, updatedAt: true }))

  const now = Math.floor(Date.now() / 1000)

  const data = {
    ...body,
    id: nanoid(10)(),
    slug: body.slug || nanoid()(),
    createdAt: now,
    updatedAt: now,
  }

  const result = MicrositeSchema.safeParse(data)
  if (!result.success) {
    console.error('[create microsite] Zod validation errors:', JSON.stringify(result.error.issues, null, 2))
    throw createError({
      status: 400,
      statusText: `Validation Error: ${result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')}`,
    })
  }

  const microsite = result.data
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

function safeValidate(rawBody: any, schema: any) {
  const result = schema.safeParse(rawBody)
  if (!result.success) {
    console.error('[create microsite body] Zod validation errors:', JSON.stringify(result.error.issues, null, 2))
    throw createError({
      status: 400,
      statusText: `Validation Error: ${result.error.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ')}`,
    })
  }
  return result.data
}
