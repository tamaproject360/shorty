export default eventHandler((event) => {
  const publicPaths = [
    '/api/microsite/get',
    '/api/microsite/track',
  ]

  if (!event.path.startsWith('/api/'))
    return
  if (publicPaths.some(p => event.path.startsWith(p)))
    return

  const token = getHeader(event, 'Authorization')?.replace(/^Bearer\s+/, '')
  if (token !== useRuntimeConfig(event).siteToken) {
    throw createError({
      status: 401,
      statusText: 'Unauthorized',
    })
  }
  if (token && token.length < 8) {
    throw createError({
      status: 401,
      statusText: 'Token is too short',
    })
  }
})
