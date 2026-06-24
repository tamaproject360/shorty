import geoip from 'geoip-lite'
import { getDb } from './db'

interface ClickData {
  link_id: string
  slug: string
  url: string
  ip: string
  referer: string
  user_agent: string
  language: string
  os: string
  browser: string
  browser_type: string
  device: string
  device_type: string
}

export function recordClick(data: ClickData): void {
  const db = getDb()
  const geo = geoip.lookup(data.ip)

  db.prepare(`
    INSERT INTO clicks (link_id, slug, url, ip, referer, country, region, city, timezone, language, os, browser, browser_type, device, device_type, user_agent, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.link_id,
    data.slug,
    data.url,
    data.ip,
    data.referer,
    geo?.country || null,
    geo?.region || null,
    geo?.city || null,
    geo?.timezone || null,
    data.language,
    data.os,
    data.browser,
    data.browser_type,
    data.device,
    data.device_type,
    data.user_agent,
    geo?.ll?.[0] ?? 0,
    geo?.ll?.[1] ?? 0,
  )
}

export function getClickStats(linkId: string): {
  visits: number
  visitors: number
  referrers: number
} {
  const db = getDb()
  const visits = db.prepare('SELECT COUNT(*) as count FROM clicks WHERE link_id = ?').get(linkId) as { count: number }
  const visitors = db.prepare('SELECT COUNT(DISTINCT ip) as count FROM clicks WHERE link_id = ?').get(linkId) as { count: number }
  const referrers = db.prepare('SELECT COUNT(DISTINCT referer) as count FROM clicks WHERE link_id = ? AND referer IS NOT NULL').get(linkId) as { count: number }

  return { visits: visits.count, visitors: visitors.count, referrers: referrers.count }
}

interface MicrositeEvent {
  id: string
  type: string
  targetId: string
  timestamp: number
  userAgent: string | undefined
  ip: string | undefined
  country: string
  city: string
  referrer: string | undefined
  device: string
  browser: string | undefined
  os: string | undefined
}

export function trackEvent(event: MicrositeEvent): void {
  const db = getDb()
  db.prepare(`
    INSERT INTO microsite_events (id, type, target_id, timestamp, user_agent, ip, country, city, referrer, device, browser, os)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    event.id,
    event.type,
    event.targetId,
    event.timestamp,
    event.userAgent || null,
    event.ip || null,
    event.country || null,
    event.city || null,
    event.referrer || null,
    event.device || null,
    event.browser || null,
    event.os || null,
  )
}
