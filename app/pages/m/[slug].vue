<script setup lang="ts">
import type { Microsite } from '@/types'
import { ExternalLink } from 'lucide-vue-next'

const route = useRoute()
const slug = route.params.slug as string

const { data: microsite, error } = await useFetch<Microsite>('/api/microsite/get', {
  query: { slug },
})

if (error.value || !microsite.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Microsite not found',
  })
}

if (!microsite.value.published) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Microsite not published',
  })
}

const visibleItems = computed(() => {
  return microsite.value?.items.filter(item => item.visible).sort((a, b) => a.order - b.order) || []
})

const themeClass = computed(() => {
  if (microsite.value?.theme === 'dark')
    return 'dark'
  if (microsite.value?.theme === 'light')
    return ''
  return ''
})

const bgStyle = computed(() => {
  if (microsite.value?.bgColor) {
    return { backgroundColor: microsite.value.bgColor }
  }
  return {}
})

const textStyle = computed(() => {
  if (microsite.value?.textColor) {
    return { color: microsite.value.textColor }
  }
  return {}
})

useHead({
  title: microsite.value?.title || 'Microsite',
  meta: [
    { name: 'description', content: microsite.value?.description || microsite.value?.title || '' },
    { property: 'og:title', content: microsite.value?.title || '' },
    { property: 'og:description', content: microsite.value?.description || microsite.value?.title || '' },
    ...(microsite.value?.avatar ? [{ property: 'og:image', content: microsite.value.avatar }] : []),
  ],
})
</script>

<template>
  <div
    v-if="microsite"
    :class="themeClass"
    class="min-h-screen w-full"
    :style="bgStyle"
  >
    <div class="mx-auto max-w-2xl px-4 py-12">
      <div class="flex flex-col items-center space-y-6">
        <!-- Avatar -->
        <Avatar v-if="microsite.avatar" class="h-24 w-24">
          <AvatarImage :src="microsite.avatar" :alt="microsite.title" />
          <AvatarFallback>{{ microsite.title[0] }}</AvatarFallback>
        </Avatar>

        <!-- Title & Description -->
        <div class="space-y-2 text-center">
          <h1
            class="text-3xl font-bold"
            :style="textStyle"
          >
            {{ microsite.title }}
          </h1>
          <p
            v-if="microsite.description"
            class="text-muted-foreground"
            :style="textStyle"
          >
            {{ microsite.description }}
          </p>
        </div>

        <!-- Links -->
        <div class="mt-8 w-full space-y-3">
          <a
            v-for="item in visibleItems"
            :key="item.id"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            class="
              block w-full rounded-lg border bg-card p-4 transition-all
              hover:scale-105 hover:shadow-lg
            "
          >
            <div class="flex items-center justify-between">
              <span class="font-medium" :style="textStyle">
                {{ item.title }}
              </span>
              <ExternalLink class="h-5 w-5 text-muted-foreground" />
            </div>
          </a>
        </div>

        <!-- Footer -->
        <div class="mt-12 text-center text-sm text-muted-foreground">
          <p>Powered by Shorty</p>
        </div>
      </div>
    </div>
  </div>
</template>
