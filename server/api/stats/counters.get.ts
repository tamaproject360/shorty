import { QuerySchema } from '@@/schemas/query'
import { buildClickWhere } from '../../utils/click-query'
import { getDb } from '../../utils/db'

export default eventHandler(async (event) => {
  const query = await getValidatedQuery(event, QuerySchema.parse)
  const db = getDb()

  const { where, params } = buildClickWhere(query)

  const row = db.prepare(
    `SELECT COUNT(*) as visits, COUNT(DISTINCT ip) as visitors, COUNT(DISTINCT referer) as referers FROM clicks ${where}`,
  ).get(...params) as { visits: number, visitors: number, referers: number }

  return {
    data: [
      { visits: row?.visits ?? 0, visitors: row?.visitors ?? 0, referers: row?.referers ?? 0 },
    ],
  }
})
