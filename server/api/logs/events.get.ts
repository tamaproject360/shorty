import { QuerySchema } from '@@/schemas/query'
import { getDb } from '../../utils/db'

function date2unix(date: Date): number {
  return Math.floor(date.getTime() / 1000)
}

export default eventHandler(async (event) => {
  const query = await getValidatedQuery(event, QuerySchema.parse)
  const db = getDb()
  const { where, params } = buildWhere(query)
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

function buildWhere(query: { slug?: string, start?: number, end?: number }) {
  const conditions: string[] = []
  const params: (string | number)[] = []

  if (query.slug) {
    conditions.push('slug = ?')
    params.push(query.slug)
  }
  if (query.start) {
    conditions.push('created_at >= ?')
    params.push(query.start)
  }
  if (query.end) {
    conditions.push('created_at <= ?')
    params.push(query.end)
  }

  return {
    where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    params,
  }
}
