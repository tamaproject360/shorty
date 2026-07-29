import { z } from 'zod'

export const UserRoleSchema = z.enum(['admin', 'editor', 'viewer'])

export const LoginSchema = z.object({
  username: z.string().trim().min(3).max(64),
  password: z.string().min(8).max(128),
})

export const CreateUserSchema = LoginSchema.extend({
  role: UserRoleSchema,
})

export const UpdateUserSchema = z.object({
  id: z.string().uuid(),
  role: UserRoleSchema,
  active: z.boolean(),
  password: z.string().min(8).max(128).optional(),
})

export const DeleteUserSchema = z.object({
  id: z.string().uuid(),
})
