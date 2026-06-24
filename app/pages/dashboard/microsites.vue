<script setup lang="ts">
import type { Microsite } from '@/types'
import { Plus } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()
const micrositesStore = useDashboardMicrositesStore()

const microsites = ref<(Microsite | null)[]>([])
const pending = ref(true)

async function loadMicrosites() {
  try {
    const data = await useAPI<{ microsites: (Microsite | null)[], list_complete: boolean }>('/api/microsite/list', {
      query: { limit: 100 },
    })
    microsites.value = data.microsites || []
  }
  catch (error) {
    console.error('Failed to load microsites:', error)
  }
  finally {
    pending.value = false
  }
}

onMounted(loadMicrosites)

micrositesStore.onMicrositeUpdate(() => {
  loadMicrosites()
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
      v-else-if="microsites.filter(m => m !== null).length === 0" class="
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
        v-for="microsite in microsites.filter(m => m !== null)"
        :key="microsite.id"
        :microsite="microsite"
      />
    </div>

    <LazyDashboardMicrositesEditor />
  </div>
</template>
