<script setup lang="ts">
import type { Microsite } from '@/types'
import { ExternalLink, Facebook, Github, Globe, Instagram, Linkedin, Mail, Twitter, Video, Youtube } from 'lucide-vue-next'

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

const socialLinks = computed(() => {
  return microsite.value?.socialLinks || []
})

const themeClass = computed(() => {
  if (microsite.value?.theme === 'dark')
    return 'dark'
  if (microsite.value?.theme === 'light')
    return ''
  return ''
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

function getSocialIcon(platform: string) {
  switch (platform) {
    case 'github': return Github
    case 'twitter': return Twitter
    case 'instagram': return Instagram
    case 'linkedin': return Linkedin
    case 'youtube': return Youtube
    case 'tiktok': return Video
    case 'facebook': return Facebook
    case 'email': return Mail
    default: return Globe
  }
}

function getEmbedType(url: string) {
  if (url.includes('youtube.com/watch') || url.includes('youtu.be/'))
    return 'youtube'
  if (url.includes('open.spotify.com/'))
    return 'spotify'
  return 'link'
}

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

function getSpotifyEmbedUrl(url: string) {
  return url.replace('open.spotify.com', 'open.spotify.com/embed')
}

function getGridClass(span?: string) {
  switch (span) {
    case '2x1': return 'col-span-2'
    case '2x2': return 'col-span-2 row-span-2'
    case '1x1': return 'col-span-1'
    default: return 'col-span-2 sm:col-span-1' // Fallback for existing items
  }
}

// Track view
onMounted(() => {
  if (microsite.value) {
    $fetch('/api/microsite/track', {
      method: 'POST',
      body: {
        slug: microsite.value.slug,
        referrer: document.referrer,
      },
    })
  }
})
</script>

<template>
  <div
    v-if="microsite"
    :class="themeClass"
    class="relative min-h-screen w-full overflow-x-hidden"
  >
    <!-- Background Image -->
    <div
      v-if="microsite.bgImage"
      class="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${microsite.bgImage})` }"
    >
      <div
        class="absolute inset-0 bg-black transition-opacity duration-300"
        :style="{ opacity: microsite.bgOverlayOpacity ?? 0.2 }"
      />
    </div>

    <!-- Background Color -->
    <div
      v-else-if="microsite.bgColor"
      class="fixed inset-0 z-0 transition-colors duration-300"
      :style="{ backgroundColor: microsite.bgColor }"
    />

    <!-- Content -->
    <div class="relative z-10 mx-auto max-w-2xl px-4 py-12">
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

        <!-- Social Icons -->
        <div
          v-if="socialLinks.length > 0" class="
            flex flex-wrap justify-center gap-4
          "
        >
          <a
            v-for="link in socialLinks"
            :key="link.platform"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="
              transition-transform
              hover:scale-110
            "
            :style="textStyle"
            :aria-label="link.platform"
          >
            <component :is="getSocialIcon(link.platform)" class="h-6 w-6" />
          </a>
        </div>

        <!-- Links & Embeds -->
        <div class="mt-8 grid w-full auto-rows-min grid-cols-2 gap-4">
          <div v-for="item in visibleItems" :key="item.id" :class="getGridClass(item.gridSpan)">
            <!-- YouTube Embed -->
            <div
              v-if="getEmbedType(item.url) === 'youtube' && getYouTubeId(item.url)"
              class="
                aspect-video h-full w-full overflow-hidden rounded-lg shadow-lg
                transition-transform
                hover:scale-[1.02]
              "
            >
              <iframe
                :src="`https://www.youtube.com/embed/${getYouTubeId(item.url)}`"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                class="h-full w-full"
              />
            </div>

            <!-- Spotify Embed -->
            <div
              v-else-if="getEmbedType(item.url) === 'spotify'"
              class="
                h-full w-full overflow-hidden rounded-lg shadow-lg
                transition-transform
                hover:scale-[1.02]
              "
            >
              <iframe
                style="border-radius:12px"
                :src="getSpotifyEmbedUrl(item.url)"
                width="100%"
                height="152"
                frameBorder="0"
                allowfullscreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                class="h-full"
              />
            </div>

            <!-- Standard Link -->
            <a
              v-else
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              class="
                flex h-full w-full items-center rounded-lg border bg-card p-4
                transition-all
                hover:scale-105 hover:shadow-lg
              "
            >
              <div class="flex w-full items-center justify-between">
                <span class="font-medium" :style="textStyle">
                  {{ item.title }}
                </span>
                <ExternalLink class="h-5 w-5 text-muted-foreground" />
              </div>
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-12 text-center text-sm text-muted-foreground">
          <p>Powered by Shorty</p>
        </div>
      </div>
    </div>
  </div>
</template>
