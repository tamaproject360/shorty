import { MicrositeSchema } from '@@/schemas/microsite'

export default eventHandler(async (event) => {
  const rawBody = await readBody(event)
  const body = readValidatedBodySafe(event, rawBody, MicrositeSchema.partial({ id: true, createdAt: true, items: true }))

  const normalizedSlug = normalizeMicrositeSlug(event, body.slug)
  const existingMicrosite = await getMicrosite(event, normalizedSlug)

  if (!existingMicrosite) {
    throw createError({
      status: 404,
      statusText: 'Microsite not found',
    })
  }

  const now = Math.floor(Date.now() / 1000)

  const merged = {
    ...existingMicrosite,
    ...body,
    id: existingMicrosite.id,
    slug: normalizedSlug,
    createdAt: existingMicrosite.createdAt,
    updatedAt: now,
  }

  const result = MicrositeSchema.safeParse(merged)
  if (!result.success) {
    console.error('[update microsite] Zod validation errors:', JSON.stringify(result.error.issues, null, 2))
    throw createError({
      status: 400,
      statusText: `Validation Error: ${result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')}`,
    })
  }

  await putMicrosite(event, result.data)

  return result.data
})

function readValidatedBodySafe(event: any, rawBody: any, schema: any) {
  const result = schema.safeParse(rawBody)
  if (!result.success) {
    console.error('[update microsite body] Zod validation errors:', JSON.stringify(result.error.issues, null, 2))
    throw createError({
      status: 400,
      statusText: `Validation Error: ${result.error.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ')}`,
    })
  }
  return result.data
}
