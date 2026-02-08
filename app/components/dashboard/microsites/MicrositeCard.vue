<script setup lang="ts">
import type { Microsite } from '@/types'
import { BarChart, Edit, ExternalLink, Globe, Trash2 } from 'lucide-vue-next'

const props = defineProps<{
  microsite: Microsite
}>()

const micrositesStore = useDashboardMicrositesStore()
const requestUrl = useRequestURL()
const origin = requestUrl.origin

const micrositeUrl = computed(() => `${origin}/m/${props.microsite.slug}`)

function handleEdit() {
  micrositesStore.openMicrositeEditor(props.microsite as unknown as Record<string, unknown>)
}
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
          <Avatar v-if="microsite.avatar" class="h-12 w-12">
            <AvatarImage :src="microsite.avatar" :alt="microsite.title" />
            <AvatarFallback>{{ microsite.title[0] }}</AvatarFallback>
          </Avatar>
          <div
            v-else class="
              flex h-12 w-12 items-center justify-center rounded-full bg-muted
            "
          >
            <Globe class="h-6 w-6 text-muted-foreground" />
          </div>
          <div class="flex-1">
            <CardTitle class="text-lg">
              {{ microsite.title }}
            </CardTitle>
            <p class="text-sm text-muted-foreground">
              {{ microsite.items.length }} links
            </p>
          </div>
        </div>
        <Badge v-if="microsite.published" variant="default">
          Published
        </Badge>
        <Badge v-else variant="secondary">
          Draft
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p
        v-if="microsite.description" class="
          line-clamp-2 text-sm text-muted-foreground
        "
      >
        {{ microsite.description }}
      </p>
      <div class="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Globe class="h-4 w-4" />
        <a
          :href="micrositeUrl" target="_blank" class="
            truncate
            hover:text-foreground
          "
        >
          {{ micrositeUrl }}
        </a>
      </div>
    </CardContent>
    <CardFooter class="grid grid-cols-4 gap-2">
      <Button variant="outline" size="icon" class="w-full" as-child title="View Page">
        <a :href="micrositeUrl" target="_blank">
          <ExternalLink class="h-4 w-4" />
        </a>
      </Button>

      <Button variant="outline" size="icon" class="w-full" as-child title="Analytics">
        <NuxtLink :to="`/dashboard/microsite-analytics/${microsite.slug}`">
          <BarChart class="h-4 w-4" />
        </NuxtLink>
      </Button>

      <Button variant="outline" size="icon" class="w-full" title="Edit" @click="handleEdit">
        <Edit class="h-4 w-4" />
      </Button>

      <LazyDashboardMicrositesDelete :microsite="microsite">
        <Button variant="destructive" size="icon" class="w-full" title="Delete">
          <Trash2 class="h-4 w-4" />
        </Button>
      </LazyDashboardMicrositesDelete>
    </CardFooter>
  </Card>
</template>
