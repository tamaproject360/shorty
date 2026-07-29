import { Buffer } from 'node:buffer'
import { createHash, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { getDb } from './db'

const scrypt = promisify(scryptCallback)
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7
const DEFAULT_ADMIN = { username: 'admin', password: 'shorty@123' }

export type UserRole = 'admin' | 'editor' | 'viewer'

interface UserRow {
  id: string
  username: string
  password_hash: string
  role: UserRole
  active: number
  created_at: number
  updated_at: number
}

export interface User {
  id: string
  username: string
  role: UserRole
  active: boolean
  createdAt: number
  updatedAt: number
}

export interface StoredUser extends User {
  passwordHash: string
}

interface SessionRow extends UserRow {
  expires_at: number
}

function toUser(row: UserRow): StoredUser {
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    role: row.role,
    active: Boolean(row.active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function withoutPassword(user: StoredUser): User {
  const { passwordHash: _, ...safeUser } = user
  return safeUser
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const hash = await scrypt(password, salt, 64) as Buffer
  return `${salt}:${hash.toString('hex')}`
}

async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  const [salt, storedHash] = passwordHash.split(':')
  if (!salt || !storedHash)
    return false

  const derivedHash = await scrypt(password, salt, 64) as Buffer
  const expectedHash = Buffer.from(storedHash, 'hex')
  return expectedHash.length === derivedHash.length && timingSafeEqual(expectedHash, derivedHash)
}

async function ensureDefaultAdmin(): Promise<void> {
  const db = getDb()
  const exists = db.prepare('SELECT 1 FROM users WHERE username = ?').get(DEFAULT_ADMIN.username)
  if (exists)
    return

  const passwordHash = await hashPassword(DEFAULT_ADMIN.password)
  db.prepare('INSERT OR IGNORE INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)').run(
    randomUUID(),
    DEFAULT_ADMIN.username,
    passwordHash,
    'admin',
  )
}

/** Creates a local dashboard user. */
export async function createUser(input: { username: string, password: string, role: UserRole }): Promise<StoredUser> {
  await ensureDefaultAdmin()
  const db = getDb()
  const user: StoredUser = {
    id: randomUUID(),
    username: input.username,
    passwordHash: await hashPassword(input.password),
    role: input.role,
    active: true,
    createdAt: Math.floor(Date.now() / 1000),
    updatedAt: Math.floor(Date.now() / 1000),
  }
  db.prepare('INSERT INTO users (id, username, password_hash, role, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(user.id, user.username, user.passwordHash, user.role, 1, user.createdAt, user.updatedAt)
  return user
}

/** Returns a stored user, including their password hash, by username. */
export async function getUserByUsername(username: string): Promise<StoredUser | null> {
  await ensureDefaultAdmin()
  const row = getDb().prepare('SELECT * FROM users WHERE username = ?').get(username) as UserRow | undefined
  return row ? toUser(row) : null
}

/** Returns users without password hashes. */
export async function listUsers(): Promise<User[]> {
  await ensureDefaultAdmin()
  const rows = getDb().prepare('SELECT * FROM users ORDER BY username COLLATE NOCASE').all() as UserRow[]
  return rows.map(row => withoutPassword(toUser(row)))
}

/** Verifies a username/password pair and returns a safe user record. */
export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const user = await getUserByUsername(username)
  if (!user || !user.active || !(await verifyPassword(password, user.passwordHash)))
    return null
  return withoutPassword(user)
}

/** Creates an opaque session token for a user. */
export function createSession(userId: string): string {
  const token = randomBytes(32).toString('base64url')
  getDb().prepare('INSERT INTO user_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(hashToken(token), userId, Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS)
  return token
}

/** Resolves an active session token to a safe user record. */
export function getSessionUser(token: string): User | null {
  const row = getDb().prepare(`
    SELECT users.*, user_sessions.expires_at FROM user_sessions
    JOIN users ON users.id = user_sessions.user_id
    WHERE user_sessions.token_hash = ?
  `).get(hashToken(token)) as SessionRow | undefined
  if (!row || !row.active || row.expires_at <= Math.floor(Date.now() / 1000)) {
    getDb().prepare('DELETE FROM user_sessions WHERE token_hash = ?').run(hashToken(token))
    return null
  }
  return withoutPassword(toUser(row))
}

/** Removes a user session. */
export function deleteSession(token: string): void {
  getDb().prepare('DELETE FROM user_sessions WHERE token_hash = ?').run(hashToken(token))
}

/** Updates a user account without permitting password hashes to leave the server. */
export async function updateUser(id: string, input: { role: UserRole, active: boolean, password?: string }): Promise<User | null> {
  const db = getDb()
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined
  if (!existing)
    return null

  const passwordHash = input.password ? await hashPassword(input.password) : existing.password_hash
  db.prepare('UPDATE users SET password_hash = ?, role = ?, active = ?, updated_at = unixepoch() WHERE id = ?')
    .run(passwordHash, input.role, Number(input.active), id)
  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow
  return withoutPassword(toUser(updated))
}

/** Deletes a non-administrator user account. */
export function deleteUser(id: string): boolean {
  return getDb().prepare('DELETE FROM users WHERE id = ? AND role != \'admin\'').run(id).changes > 0
}
