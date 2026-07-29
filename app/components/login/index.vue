<script setup lang="ts">
import { toast } from 'vue-sonner'
import { z } from 'zod'

const { t } = useI18n()
const { setToken, removeToken, setUser } = useAuthToken()

const username = ref('admin')
const password = ref('')
const error = ref('')

const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

async function handleSubmit() {
  error.value = ''
  const result = LoginSchema.safeParse({ username: username.value, password: password.value })

  if (!result.success) {
    error.value = 'Username and password are required'
    return
  }

  try {
    const response = await $fetch<{ token: string, user: { id: string, username: string, role: 'admin' | 'editor' | 'viewer' } }>('/api/auth/login', {
      method: 'POST',
      body: result.data,
    })
    setToken(response.token)
    setUser(response.user)
    navigateTo('/dashboard')
  }
  catch (e) {
    removeToken()
    console.error(e)
    toast.error(t('login.failed'), {
      description: e instanceof Error ? e.message : String(e),
    })
  }
}
</script>

<template>
  <Card class="w-full max-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl">
        {{ $t('login.title') }}
      </CardTitle>
      <CardDescription>
        {{ $t('login.description') }}
      </CardDescription>
    </CardHeader>
    <CardContent class="grid gap-4">
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <FieldGroup>
          <Field :data-invalid="!!error">
            <FieldLabel for="username">
              Username
            </FieldLabel>
            <Input
              id="username"
              v-model="username"
              autocomplete="username"
              :aria-invalid="!!error"
            />
          </Field>
          <Field :data-invalid="!!error">
            <FieldLabel for="password">
              Password
            </FieldLabel>
            <Input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              :aria-invalid="!!error"
            />
            <FieldError v-if="error" :errors="[error]" />
          </Field>
        </FieldGroup>

        <Button class="w-full" type="submit">
          {{ $t('login.submit') }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
