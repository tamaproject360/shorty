import { nanoid } from 'nanoid'
import { UAParser } from 'ua-parser-js'

export default eventHandler(async (event) => {
  const body = await readBody(event)
  const headers = getHeaders(event)

  const userAgent = headers['user-agent']
  const ip = headers['x-forwarded-for'] || event.node.req.socket.remoteAddress
  const referrer = body.referrer || headers.referer

  const parser = new UAParser(userAgent)
  const browser = parser.getBrowser().name
  const os = parser.getOS().name
  const device = parser.getDevice().type || 'desktop' // default to desktop if type is undefined

  // Mock GeoIP for localhost
  const country = ip === '127.0.0.1' || ip === '::1' ? 'Localhost' : 'Unknown'
  const city = ip === '127.0.0.1' || ip === '::1' ? 'Local City' : 'Unknown'

  const analyticsEvent = {
    id: nanoid(),
    type: body.type || 'view',
    targetId: body.slug,
    timestamp: Date.now(),
    userAgent,
    ip: Array.isArray(ip) ? ip[0] : ip,
    country,
    city,
    referrer,
    device,
    browser,
    os,
  }

  await trackEvent(analyticsEvent)

  return { success: true }
})
