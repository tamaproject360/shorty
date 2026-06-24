import { QuerySchema } from '@@/schemas/query'
import { z } from 'zod'
import { getDb } from '../../utils/db'

const ViewsQuerySchema = QuerySchema.extend({
  unit: z.enum(['minute', 'hour', 'day']),
})

export default eventHandler(async (event) => {
  const query = await getValidatedQuery(event, ViewsQuerySchema.parse)
  const db = getDb()

  const format = query.unit === 'minute' ? '%Y-%m-%d %H:%M' : query.unit === 'hour' ? '%Y-%m-%d %H' : '%Y-%m-%d'
  const { where, params } = buildWhere(query)

  const rows = db.prepare(
    `SELECT strftime('${format}', datetime(created_at, 'unixepoch')) as time, COUNT(*) as visits, COUNT(DISTINCT ip) as visitors FROM clicks ${where} AND is_bot = 0 GROUP BY time ORDER BY time`,
  ).all(...params) as { time: string, visits: number, visitors: number }[]

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
