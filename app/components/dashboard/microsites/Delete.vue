<script setup lang="ts">
import type { Microsite } from '@/types'
import { toast } from 'vue-sonner'

const props = defineProps<{
  microsite: Microsite
}>()

const { t } = useI18n()
const micrositesStore = useDashboardMicrositesStore()
const open = ref(false)
const deleting = ref(false)

async function handleDelete() {
  deleting.value = true
  try {
    await $fetch('/api/microsite/delete', {
      method: 'POST',
      body: { slug: props.microsite.slug },
    })

    toast.success(t('common.delete_success'))
    micrositesStore.notifyMicrositeUpdate(props.microsite, 'delete')
    open.value = false
  }
  catch (error) {
    console.error('Delete microsite error:', error)
    toast.error('Failed to delete microsite')
  }
  finally {
    deleting.value = false
  }
}
</script>

<template>
  <AlertDialog v-model:open="open">
    <AlertDialogTrigger as-child>
      <slot />
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ t('links.delete_confirm_title') }}</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete "{{ microsite.title }}" and all its links.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{{ t('common.cancel') }}</AlertDialogCancel>
        <AlertDialogAction
          :disabled="deleting"
          @click.prevent="handleDelete"
        >
          {{ deleting ? 'Deleting...' : t('common.delete') }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
