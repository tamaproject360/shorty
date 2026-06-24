import type { H3Event } from 'h3'
import { parseAcceptLanguage } from 'intl-parse-accept-language'
import { UAParser } from 'ua-parser-js'
import {
  CLIs,
  Crawlers,
  Emails,
  ExtraDevices,
  Fetchers,
  InApps,
  MediaPlayers,
  Vehicles,
} from 'ua-parser-js/extensions'
import { parseURL } from 'ufo'
import { recordClick } from './analytics'

export function useAccessLog(event: H3Event) {
  const ip = getHeader(event, 'x-real-ip') || getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() || getRequestIP(event, { xForwardedFor: true })

  const { host: referer } = parseURL(getHeader(event, 'referer'))

  const acceptLanguage = getHeader(event, 'accept-language') || ''
  const language = (parseAcceptLanguage(acceptLanguage) || [])[0]

  const userAgent = getHeader(event, 'user-agent') || ''
  const uaInfo = (new UAParser(userAgent, {
    // @ts-expect-error
    browser: [Crawlers.browser || [], CLIs.browser || [], Emails.browser || [], Fetchers.browser || [], InApps.browser || [], MediaPlayers.browser || [], Vehicles.browser || []].flat(),
    // @ts-expect-error
    device: [ExtraDevices.device || []].flat(),
  })).getResult()

  const link = event.context.link || {}

  const isBot = ['crawler', 'fetcher'].includes(uaInfo?.browser?.type || '')
    || ['spider', 'bot'].includes(uaInfo?.browser?.name?.toLowerCase() || '')

  const { disableBotAccessLog } = useRuntimeConfig(event)
  if (isBot && disableBotAccessLog) {
    return Promise.resolve()
  }

  if (link.id && link.slug) {
    recordClick({
      link_id: link.id,
      slug: link.slug,
      url: link.url || '',
      ip: ip || '',
      referer: referer || '',
      user_agent: userAgent,
      language: language || '',
      os: uaInfo?.os?.name || '',
      browser: uaInfo?.browser?.name || '',
      browser_type: uaInfo?.browser?.type || '',
      device: uaInfo?.device?.model || '',
      device_type: uaInfo?.device?.type || '',
    })
  }

  return Promise.resolve()
}
