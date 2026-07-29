import { randomUUID } from 'node:crypto'
import { afterEach, describe, expect, it } from 'vitest'
import { authenticateUser, createUser, deleteUser, getUserByUsername, listUsers } from '../../server/utils/user-store'

let createdUserId = ''

afterEach(() => {
  if (createdUserId) {
    deleteUser(createdUserId)
    createdUserId = ''
  }
})

describe('user store', () => {
  it('creates users with a hashed password and authenticates correct credentials', async () => {
    const username = `editor-${randomUUID()}`
    const password = 'strong-password-123'

    const user = await createUser({ username, password, role: 'editor' })
    createdUserId = user.id

    expect(user.passwordHash).not.toBe(password)
    expect(await authenticateUser(username, password)).toMatchObject({
      id: user.id,
      username,
      role: 'editor',
      active: true,
    })
    expect(await authenticateUser(username, 'incorrect-password')).toBeNull()
  })

  it('creates the default administrator once and excludes password hashes from listed users', async () => {
    const admin = await getUserByUsername('admin')
    const users = await listUsers()

    expect(admin).toMatchObject({ username: 'admin', role: 'admin', active: true })
    expect(users.find(user => user.username === 'admin')).not.toHaveProperty('passwordHash')
  })
})
