import type { Query } from '@@/schemas/query'
import { QuerySchema } from '@@/schemas/query'
import { getDb } from '../../utils/db'

export default eventHandler(async (event) => {
  const query = await getValidatedQuery(event, QuerySchema.parse)
  const db = getDb()
  const { where, params } = buildWhere(query)

  const rows = db.prepare(
    `SELECT city as name, latitude, longitude, COUNT(*) as count FROM clicks ${where} AND is_bot = 0 AND latitude != 0 AND longitude != 0 GROUP BY city, latitude, longitude`,
  ).all(...params) as { name: string, latitude: number, longitude: number, count: number }[]

  return { data: rows }
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
