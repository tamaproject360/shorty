import { DeleteUserSchema } from '../../../schemas/user'
import { deleteUser } from '../../utils/user-store'

export default eventHandler(async (event) => {
  const { id } = await readValidatedBody(event, DeleteUserSchema.parse)
  if (!deleteUser(id))
    throw createError({ status: 400, statusText: 'Administrator accounts cannot be deleted' })
  return { success: true }
})
