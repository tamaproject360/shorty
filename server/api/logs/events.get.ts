import type { Query } from '@@/schemas/query'
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

function buildWhere(query: Query) {
  const conditions: string[] = []
  const params: (string | number)[] = []

  if (query.id) {
    conditions.push('link_id = ?')
    params.push(query.id)
  }
  if (query.slug) {
    conditions.push('slug = ?')
    params.push(query.slug)
  }
  if (query.startAt) {
    conditions.push('created_at >= ?')
    params.push(query.startAt)
  }
  if (query.endAt) {
    conditions.push('created_at <= ?')
    params.push(query.endAt)
  }
  if (query.country) {
    conditions.push('country = ?')
    params.push(query.country)
  }
  if (query.referer) {
    conditions.push('referer = ?')
    params.push(query.referer)
  }
  if (query.deviceType) {
    conditions.push('device_type = ?')
    params.push(query.deviceType)
  }
  if (query.device) {
    conditions.push('device = ?')
    params.push(query.device)
  }
  if (query.os) {
    conditions.push('os = ?')
    params.push(query.os)
  }
  if (query.browser) {
    conditions.push('browser = ?')
    params.push(query.browser)
  }
  if (query.browserType) {
    conditions.push('browser_type = ?')
    params.push(query.browserType)
  }
  if (query.language) {
    conditions.push('language = ?')
    params.push(query.language)
  }
  if (query.timezone) {
    conditions.push('timezone = ?')
    params.push(query.timezone)
  }
  if (query.region) {
    conditions.push('region = ?')
    params.push(query.region)
  }
  if (query.city) {
    conditions.push('city = ?')
    params.push(query.city)
  }

  return {
    where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    params,
  }
}
