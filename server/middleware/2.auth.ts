export default eventHandler((event) => {
  const publicPaths = [
    '/api/auth/login',
    '/api/microsite/get',
    '/api/microsite/track',
  ]

  if (!event.path.startsWith('/api/'))
    return
  if (publicPaths.some(p => event.path.startsWith(p)))
    return

  const token = getHeader(event, 'Authorization')?.replace(/^Bearer\s+/, '')
  const legacyToken = useRuntimeConfig(event).siteToken
  const user = token === legacyToken
    ? { id: 'legacy-admin', username: 'admin', role: 'admin' as const, active: true, createdAt: 0, updatedAt: 0 }
    : token ? getSessionUser(token) : null

  if (!user) {
    throw createError({
      status: 401,
      statusText: 'Unauthorized',
    })
  }
  event.context.user = user

  if (event.path.startsWith('/api/user/') && user.role !== 'admin')
    throw createError({ status: 403, statusText: 'Administrator role required' })

  if (event.path.startsWith('/api/migrate/') && user.role !== 'admin')
    throw createError({ status: 403, statusText: 'Administrator role required' })

  if (user.role === 'viewer' && event.method !== 'GET')
    throw createError({ status: 403, statusText: 'Viewer role is read-only' })
})
