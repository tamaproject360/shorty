<script setup lang="ts">
import type { Microsite } from '@/types'
import { Plus } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()
const micrositesStore = useDashboardMicrositesStore()

const { data: micrositesData, refresh, pending } = await useFetch('/api/microsite/list', {
  query: { limit: 100 },
  default: () => ({ microsites: [], list_complete: true }),
})

const microsites = computed(() => {
  return (micrositesData.value?.microsites || []).filter((m): m is Microsite => m !== null)
})

micrositesStore.onMicrositeUpdate(() => {
  refresh()
})
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">
          {{ t('nav.microsites') }}
        </h1>
        <p class="text-muted-foreground">
          Create and manage your microsites (like Linktree)
        </p>
      </div>
      <Button @click="micrositesStore.openMicrositeEditor()">
        <Plus class="mr-2 h-4 w-4" />
        Create Microsite
      </Button>
    </div>

    <div v-if="pending" class="flex items-center justify-center py-12">
      <div class="text-muted-foreground">
        Loading microsites...
      </div>
    </div>

    <div
      v-else-if="microsites.length === 0" class="
        flex flex-col items-center justify-center py-12 text-center
      "
    >
      <p class="mb-4 text-muted-foreground">
        No microsites yet. Create your first one!
      </p>
      <Button @click="micrositesStore.openMicrositeEditor()">
        <Plus class="mr-2 h-4 w-4" />
        Create Microsite
      </Button>
    </div>

    <div
      v-else class="
        grid gap-4
        md:grid-cols-2
        lg:grid-cols-3
      "
    >
      <DashboardMicrositesMicrositeCard
        v-for="microsite in microsites"
        :key="microsite!.id"
        :microsite="microsite!"
      />
    </div>

    <LazyDashboardMicrositesEditor />
  </div>
</template>
