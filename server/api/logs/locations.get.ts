import { QuerySchema } from '@@/schemas/query'
import { buildClickWhere } from '../../utils/click-query'
import { getDb } from '../../utils/db'

export default eventHandler(async (event) => {
  const query = await getValidatedQuery(event, QuerySchema.parse)
  const db = getDb()
  const { where, params } = buildClickWhere(query, ['latitude != 0', 'longitude != 0'])

  const rows = db.prepare(
    `SELECT city as name, latitude, longitude, COUNT(*) as count FROM clicks ${where} GROUP BY city, latitude, longitude`,
  ).all(...params) as { name: string, latitude: number, longitude: number, count: number }[]

  return { data: rows }
})
