import { LoginSchema } from '../../../schemas/user'
import { authenticateUser, createSession } from '../../utils/user-store'

export default eventHandler(async (event) => {
  const input = await readValidatedBody(event, LoginSchema.parse)
  const user = await authenticateUser(input.username, input.password)
  if (!user)
    throw createError({ status: 401, statusText: 'Invalid username or password' })

  return { token: createSession(user.id), user }
})
