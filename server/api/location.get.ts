import geoip from 'geoip-lite'

defineRouteMeta({
  openAPI: {
    description: 'Get the location of the user',
    responses: {
      200: {
        description: 'The location of the user',
      },
    },
  },
})

export default eventHandler((event) => {
  const ip = getRequestIP(event, { xForwardedFor: true })
  const geo = ip ? geoip.lookup(ip) : null
  return {
    latitude: geo?.ll?.[0],
    longitude: geo?.ll?.[1],
  }
})
