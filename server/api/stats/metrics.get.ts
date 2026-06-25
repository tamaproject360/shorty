import { QuerySchema } from '@@/schemas/query'
import { z } from 'zod'
import { buildClickWhere } from '../../utils/click-query'
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
  const { where, params } = buildClickWhere(query, [`${column} IS NOT NULL`, `${column} != ''`])
  const limit = Math.max(0, Math.floor(query.limit ?? 20))

  const rows = db.prepare(
    `SELECT ${column} as name, COUNT(*) as count FROM clicks ${where} GROUP BY name ORDER BY count DESC LIMIT ?`,
  ).all(...params, limit) as { name: string, count: number }[]

  return { data: rows }
})
