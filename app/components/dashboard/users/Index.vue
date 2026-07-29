<script setup lang="ts">
import { Pencil, Plus, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

interface User {
  id: string
  username: string
  role: 'admin' | 'editor' | 'viewer'
  active: boolean
}

const users = ref<User[]>([])
const search = ref('')
const modalOpen = ref(false)
const editingUser = ref<User | null>(null)
const form = reactive({ username: '', password: '', role: 'editor' as User['role'], active: true })

const filteredUsers = computed(() => users.value.filter(user => user.username.toLowerCase().includes(search.value.toLowerCase())))

async function loadUsers() {
  try {
    users.value = await useAPI<User[]>('/api/user/list')
  }
  catch (error) {
    toast.error('Unable to load users', { description: error instanceof Error ? error.message : String(error) })
  }
}

function openCreate() {
  editingUser.value = null
  Object.assign(form, { username: '', password: '', role: 'editor', active: true })
  modalOpen.value = true
}

function openEdit(user: User) {
  editingUser.value = user
  Object.assign(form, { username: user.username, password: '', role: user.role, active: user.active })
  modalOpen.value = true
}

async function saveUser() {
  try {
    if (editingUser.value) {
      await useAPI('/api/user/update', {
        method: 'PUT',
        body: { id: editingUser.value.id, role: form.role, active: form.active, ...(form.password ? { password: form.password } : {}) },
      })
    }
    else {
      await useAPI('/api/user/create', { method: 'POST', body: form })
    }
    modalOpen.value = false
    await loadUsers()
    toast.success(editingUser.value ? 'User updated' : 'User created')
  }
  catch (error) {
    toast.error('Unable to save user', { description: error instanceof Error ? error.message : String(error) })
  }
}

async function removeUser(user: User) {
  try {
    await useAPI('/api/user/delete', { method: 'POST', body: { id: user.id } })
    await loadUsers()
    toast.success('User deleted')
  }
  catch (error) {
    toast.error('Unable to delete user', { description: error instanceof Error ? error.message : String(error) })
  }
}

onMounted(loadUsers)
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold">
          User Management
        </h1>
        <p class="text-sm text-muted-foreground">
          Manage dashboard access and roles.
        </p>
      </div>
      <Button @click="openCreate">
        <Plus /> Add user
      </Button>
    </div>

    <Input v-model="search" placeholder="Search users..." aria-label="Search users" class="max-w-sm" />

    <div class="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead class="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="user in filteredUsers" :key="user.id">
            <TableCell class="font-medium">
              {{ user.username }}
            </TableCell>
            <TableCell>
              <Badge variant="secondary" class="capitalize">
                {{ user.role }}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge :variant="user.active ? 'default' : 'outline'">
                {{ user.active ? 'Active' : 'Inactive' }}
              </Badge>
            </TableCell>
            <TableCell class="space-x-1 text-right">
              <Button variant="ghost" size="icon" :aria-label="`Edit ${user.username}`" @click="openEdit(user)">
                <Pencil />
              </Button>
              <Button v-if="user.role !== 'admin'" variant="ghost" size="icon" :aria-label="`Delete ${user.username}`" @click="removeUser(user)">
                <Trash2 />
              </Button>
            </TableCell>
          </TableRow>
          <TableEmpty v-if="!filteredUsers.length" :colspan="4">
            No users found.
          </TableEmpty>
        </TableBody>
      </Table>
    </div>

    <ResponsiveModal v-model:open="modalOpen" :title="editingUser ? 'Edit user' : 'Create user'" description="Set account credentials and access level." content-class="sm:max-w-md">
      <form class="space-y-4 p-1" @submit.prevent="saveUser">
        <FieldGroup>
          <Field v-if="!editingUser">
            <FieldLabel for="user-username">
              Username
            </FieldLabel><Input id="user-username" v-model="form.username" required autocomplete="username" />
          </Field>
          <Field>
            <FieldLabel for="user-password">
              {{ editingUser ? 'New password (optional)' : 'Password' }}
            </FieldLabel><Input id="user-password" v-model="form.password" type="password" :required="!editingUser" :minlength="8" autocomplete="new-password" />
          </Field>
          <Field>
            <FieldLabel for="user-role">
              Role
            </FieldLabel><Select v-model="form.role">
              <SelectTrigger id="user-role">
                <SelectValue />
              </SelectTrigger><SelectContent>
                <SelectItem value="admin">
                  Admin
                </SelectItem><SelectItem value="editor">
                  Editor
                </SelectItem><SelectItem value="viewer">
                  Viewer
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <div class="flex items-center gap-2">
              <Checkbox id="user-active" v-model="form.active" /><FieldLabel for="user-active">
                Active
              </FieldLabel>
            </div>
          </Field>
        </FieldGroup>
        <div class="flex justify-end gap-2">
          <Button type="button" variant="outline" @click="modalOpen = false">
            Cancel
          </Button><Button type="submit">
            Save user
          </Button>
        </div>
      </form>
    </ResponsiveModal>
  </section>
</template>
