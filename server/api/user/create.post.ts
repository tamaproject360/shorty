import { CreateUserSchema } from '../../../schemas/user'
import { createUser } from '../../utils/user-store'

export default eventHandler(async (event) => {
  const input = await readValidatedBody(event, CreateUserSchema.parse)
  try {
    const user = await createUser(input)
    const { passwordHash: _, ...safeUser } = user
    return safeUser
  }
  catch (error) {
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed'))
      throw createError({ status: 409, statusText: 'Username already exists' })
    throw error
  }
})
