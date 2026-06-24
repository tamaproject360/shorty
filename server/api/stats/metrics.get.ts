import { QuerySchema } from '@@/schemas/query'
import { z } from 'zod'
import { getDb } from '../../utils/db'

const METRIC_COLUMNS: Record<string, string> = {
  country: 'country',
  region: 'region',
  city: 'city',
  referer: 'referer',
  slug: 'slug',
  language: 'language',
  timezone: 'timezone',
  device: 'device',
  deviceType: 'device_type',
  os: 'os',
  browser: 'browser',
  browserType: 'browser_type',
}

const MetricsQuerySchema = QuerySchema.extend({
  type: z.enum(Object.keys(METRIC_COLUMNS) as [string, ...string[]]),
})

export default eventHandler(async (event) => {
  const query = await getValidatedQuery(event, MetricsQuerySchema.parse)
  const db = getDb()

  const column = METRIC_COLUMNS[query.type] || query.type
  const { where, params } = buildWhere(query)
  const limit = Math.max(0, Math.floor(query.limit ?? 20))

  const rows = db.prepare(
    `SELECT ${column} as name, COUNT(*) as count FROM clicks ${where} AND is_bot = 0 AND ${column} IS NOT NULL AND ${column} != '' GROUP BY name ORDER BY count DESC LIMIT ?`,
  ).all(...params, limit) as { name: string, count: number }[]

  return { data: rows }
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
