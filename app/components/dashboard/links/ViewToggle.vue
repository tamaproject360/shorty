<script setup lang="ts">
import { LayoutGrid, List } from 'lucide-vue-next'

const linksStore = useDashboardLinksStore()
</script>

<template>
  <div class="flex items-center rounded-md border bg-background p-1">
    <Button
      variant="ghost"
      size="icon"
      class="h-7 w-7 rounded-sm"
      :class="{ 'bg-accent text-accent-foreground': linksStore.viewMode === 'card' }"
      @click="linksStore.viewMode = 'card'"
    >
      <LayoutGrid class="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      class="h-7 w-7 rounded-sm"
      :class="{ 'bg-accent text-accent-foreground': linksStore.viewMode === 'list' }"
      @click="linksStore.viewMode = 'list'"
    >
      <List class="h-4 w-4" />
    </Button>
  </div>
</template>
