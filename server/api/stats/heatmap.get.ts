import { QuerySchema } from '@@/schemas/query'
import { getDb } from '../../utils/db'

export default eventHandler(async (event) => {
  const query = await getValidatedQuery(event, QuerySchema.parse)
  const db = getDb()

  const { where, params } = buildWhere(query)

  const rows = db.prepare(
    `SELECT CAST(strftime('%w', datetime(created_at, 'unixepoch')) AS INTEGER) as weekday, CAST(strftime('%H', datetime(created_at, 'unixepoch')) AS INTEGER) as hour, COUNT(*) as visits, COUNT(DISTINCT ip) as visitors FROM clicks ${where} AND is_bot = 0 GROUP BY weekday, hour ORDER BY weekday, hour`,
  ).all(...params) as { weekday: number, hour: number, visits: number, visitors: number }[]

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
