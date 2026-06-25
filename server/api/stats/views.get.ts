import { QuerySchema } from '@@/schemas/query'
import { z } from 'zod'
import { buildClickWhere } from '../../utils/click-query'
import { getDb } from '../../utils/db'

const ViewsQuerySchema = QuerySchema.extend({
  unit: z.enum(['minute', 'hour', 'day']),
})

export default eventHandler(async (event) => {
  const query = await getValidatedQuery(event, ViewsQuerySchema.parse)
  const db = getDb()

  const format = query.unit === 'minute' ? '%Y-%m-%d %H:%M' : query.unit === 'hour' ? '%Y-%m-%d %H' : '%Y-%m-%d'
  const { where, params } = buildClickWhere(query)

  const rows = db.prepare(
    `SELECT strftime('${format}', datetime(created_at, 'unixepoch')) as time, COUNT(*) as visits, COUNT(DISTINCT ip) as visitors FROM clicks ${where} GROUP BY time ORDER BY time`,
  ).all(...params) as { time: string, visits: number, visitors: number }[]

  return { data: rows }
})
