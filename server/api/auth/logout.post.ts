import { deleteSession } from '../../utils/user-store'

export default eventHandler((event) => {
  const token = getHeader(event, 'Authorization')?.replace(/^Bearer\s+/, '')
  if (token)
    deleteSession(token)
  return { success: true }
})
