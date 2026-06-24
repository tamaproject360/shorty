import { QuerySchema } from '@@/schemas/query'
import { getDb } from '../../utils/db'

export default eventHandler(async (event) => {
  const query = await getValidatedQuery(event, QuerySchema.parse)
  const db = getDb()

  const { where, params } = buildWhere(query)

  const row = db.prepare(
    `SELECT COUNT(*) as visits, COUNT(DISTINCT ip) as visitors, COUNT(DISTINCT referer) as referers FROM clicks ${where} AND is_bot = 0`,
  ).get(...params) as { visits: number, visitors: number, referrers: number }

  return {
    data: [
      { visits: row?.visits ?? 0, visitors: row?.visitors ?? 0, referers: row?.referers ?? 0 },
    ],
  }
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
