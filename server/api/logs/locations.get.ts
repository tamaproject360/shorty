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
