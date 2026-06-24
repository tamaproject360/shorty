import { getDb } from '../../utils/db'

export default eventHandler(async (event) => {
  const query = getQuery(event)
  const slug = query.slug as string

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Missing slug' })
  }

  const db = getDb()

  const totalViews = db.prepare(
    'SELECT COUNT(*) as count FROM clicks WHERE slug = ? AND is_bot = 0',
  ).get(slug) as { count: number }

  const chartRows = db.prepare(
    `SELECT date(created_at, 'unixepoch') as date, COUNT(*) as count FROM clicks WHERE slug = ? AND is_bot = 0 GROUP BY date ORDER BY date`,
  ).all(slug) as { date: string, count: number }[]

  const countryRows = db.prepare(
    'SELECT COALESCE(country, \'Unknown\') as name, COUNT(*) as value FROM clicks WHERE slug = ? AND is_bot = 0 GROUP BY name ORDER BY value DESC',
  ).all(slug) as { name: string, value: number }[]

  const deviceRows = db.prepare(
    'SELECT COALESCE(device_type, \'Desktop\') as name, COUNT(*) as value FROM clicks WHERE slug = ? AND is_bot = 0 GROUP BY name ORDER BY value DESC',
  ).all(slug) as { name: string, value: number }[]

  const referrerRows = db.prepare(
    'SELECT COALESCE(referer, \'Direct\') as name, COUNT(*) as count FROM clicks WHERE slug = ? AND is_bot = 0 GROUP BY name ORDER BY count DESC',
  ).all(slug) as { name: string, count: number }[]

  return {
    totalViews: totalViews?.count ?? 0,
    chart: chartRows,
    countries: countryRows,
    devices: deviceRows,
    referrers: referrerRows,
  }
})
