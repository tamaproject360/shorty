import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'

const storage = createStorage({
  driver: fsDriver({ base: './data/analytics' }),
})

export interface AnalyticsEvent {
  id: string
  type: 'view' | 'click'
  targetId: string // slug or link id
  timestamp: number
  userAgent?: string
  ip?: string
  country?: string
  city?: string
  referrer?: string
  device?: string
  browser?: string
  os?: string
}

export async function trackEvent(event: AnalyticsEvent) {
  const date = new Date(event.timestamp).toISOString().split('T')[0] // YYYY-MM-DD
  const key = `${event.type}:${event.targetId}:${date}`

  // Append to daily log
  // Note: This is not atomic, but fine for local dev
  const existing = (await storage.getItem<AnalyticsEvent[]>(key)) || []
  existing.push(event)
  await storage.setItem(key, existing)
}

export async function getEvents(type: 'view' | 'click', targetId: string, _startDate?: string, _endDate?: string) {
  // List keys matching pattern
  const keys = await storage.getKeys(`${type}:${targetId}:`)
  const events: AnalyticsEvent[] = []

  for (const key of keys) {
    // Filter by date if needed
    const dayEvents = (await storage.getItem<AnalyticsEvent[]>(key)) || []
    events.push(...dayEvents)
  }

  return events
}
