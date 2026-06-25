import { QuerySchema } from '@@/schemas/query'
import { buildClickWhere } from '../../utils/click-query'
import { getDb } from '../../utils/db'

function date2unix(date: Date): number {
  return Math.floor(date.getTime() / 1000)
}

export default eventHandler(async (event) => {
  const query = await getValidatedQuery(event, QuerySchema.parse)
  const db = getDb()
  const { where, params } = buildClickWhere(query)
  const limit = Math.max(0, Math.floor(query.limit ?? 50))

  const rows = db.prepare(
    `SELECT * FROM clicks ${where} ORDER BY created_at DESC LIMIT ?`,
  ).all(...params, limit) as Record<string, unknown>[]

  return rows.map(row => ({
    id: String(row.id),
    slug: row.slug as string,
    url: row.url as string,
    ip: undefined,
    referer: row.referer as string,
    country: row.country as string,
    region: row.region as string,
    city: row.city as string,
    timezone: row.timezone as string,
    language: row.language as string,
    os: row.os as string,
    browser: row.browser as string,
    browserType: row.browser_type as string,
    device: row.device as string,
    deviceType: row.device_type as string,
    latitude: row.latitude as number,
    longitude: row.longitude as number,
    timestamp: date2unix(new Date((row.created_at as number) * 1000)),
  }))
})
