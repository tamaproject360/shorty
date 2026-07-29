import { UpdateUserSchema } from '../../../schemas/user'
import { updateUser } from '../../utils/user-store'

export default eventHandler(async (event) => {
  const input = await readValidatedBody(event, UpdateUserSchema.parse)
  const user = await updateUser(input.id, input)
  if (!user)
    throw createError({ status: 404, statusText: 'User not found' })
  return user
})
