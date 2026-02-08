import type { AnalyticsEvent } from '../../utils/analytics-store'
import { getEvents } from '../../utils/analytics-store'

export default eventHandler(async (event) => {
  const query = getQuery(event)
  const slug = query.slug as string

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Missing slug' })
  }

  const events: AnalyticsEvent[] = await getEvents('view', slug)

  const totalViews = events.length

  const chartData: Record<string, number> = {}
  const countryData: Record<string, number> = {}
  const deviceData: Record<string, number> = {}
  const referrerData: Record<string, number> = {}

  events.forEach((e) => {
    const day = new Date(e.timestamp).toISOString().split('T')[0]
    if (day) {
      chartData[day] = (chartData[day] || 0) + 1
    }

    const country = e.country || 'Unknown'
    countryData[country] = (countryData[country] || 0) + 1

    const device = e.device || 'Desktop'
    deviceData[device] = (deviceData[device] || 0) + 1

    let ref = 'Direct'
    if (e.referrer) {
      try {
        const url = new URL(e.referrer)
        ref = url.hostname
      }
      catch {
        ref = e.referrer
      }
    }
    referrerData[ref] = (referrerData[ref] || 0) + 1
  })

  return {
    totalViews,
    chart: Object.entries(chartData).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date)),
    countries: Object.entries(countryData).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
    devices: Object.entries(deviceData).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
    referrers: Object.entries(referrerData).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
  }
})
