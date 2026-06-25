import { QuerySchema } from '@@/schemas/query'
import { buildClickWhere } from '../../utils/click-query'
import { getDb } from '../../utils/db'

export default eventHandler(async (event) => {
  const query = await getValidatedQuery(event, QuerySchema.parse)
  const db = getDb()

  const { where, params } = buildClickWhere(query)

  const rows = db.prepare(
    `SELECT CASE CAST(strftime('%w', datetime(created_at, 'unixepoch')) AS INTEGER) WHEN 0 THEN 7 ELSE CAST(strftime('%w', datetime(created_at, 'unixepoch')) AS INTEGER) END as weekday, CAST(strftime('%H', datetime(created_at, 'unixepoch')) AS INTEGER) as hour, COUNT(*) as visits, COUNT(DISTINCT ip) as visitors FROM clicks ${where} GROUP BY weekday, hour ORDER BY weekday, hour`,
  ).all(...params) as { weekday: number, hour: number, visits: number, visitors: number }[]

  return { data: rows }
})
