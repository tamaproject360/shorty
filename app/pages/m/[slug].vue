<script setup lang="ts">
import type { Microsite } from '@/types'
import {
  BookOpen,
  Briefcase,
  Camera,
  Code,
  ExternalLink,
  Facebook,
  FileText,
  Gift,
  Github,
  Globe,
  Heart,
  Home,
  Image,
  Instagram,
  Link,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Music,
  Phone,
  Send,
  ShoppingCart,
  Sparkles,
  Star,
  Timer,
  Twitter,
  Type,
  User,
  Video,
  Wallet,
  Youtube,
} from 'lucide-vue-next'

const ITEM_ICON_MAP: Record<string, Component> = {
  Link,
  Globe,
  ShoppingCart,
  BookOpen,
  Code,
  Camera,
  Music,
  Video,
  Heart,
  Star,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
  FileText,
  Image,
  Gift,
  Briefcase,
  Sparkles,
  Wallet,
  Home,
  User,
}

const ITEM_TYPE_ICON_MAP: Record<string, Component> = {
  profile: User,
  link: Link,
  separator: Type,
  text: FileText,
  image: Image,
  embed: Video,
  whatsapp: MessageCircle,
  email: Mail,
  phone: Phone,
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Music,
  telegram: Send,
  countdown: Timer,
}

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

function getItemIcon(item: Microsite['items'][number]) {
  if (item.icon && ITEM_ICON_MAP[item.icon])
    return ITEM_ICON_MAP[item.icon]

  return ITEM_TYPE_ICON_MAP[item.type || 'link'] || Link
}

function getCountdownLabel(targetDate?: string) {
  if (!targetDate)
    return 'Coming soon'

  const target = new Date(targetDate).getTime()
  if (Number.isNaN(target))
    return targetDate

  const diff = target - Date.now()
  if (diff <= 0)
    return 'Live now'

  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)

  if (days > 0)
    return `${days}d ${hours}h remaining`
  if (hours > 0)
    return `${hours}h ${minutes}m remaining`
  return `${minutes}m remaining`
}

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  const id = match?.[2]
  return id && id.length === 11 ? id : null
}

function getSpotifyEmbedUrl(url: string) {
  return url.replace('open.spotify.com', 'open.spotify.com/embed')
}

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

    <div
      v-else-if="microsite.bgColor"
      class="fixed inset-0 z-0 transition-colors duration-300"
      :style="{ backgroundColor: microsite.bgColor }"
    />

    <div class="relative z-10 mx-auto max-w-2xl px-4 py-12">
      <div class="flex flex-col items-center space-y-6">
        <div v-if="microsite.avatarIcon || microsite.avatar" class="flex h-24 w-24 items-center justify-center rounded-full border bg-muted">
          <Avatar v-if="microsite.avatar" class="h-24 w-24">
            <AvatarImage :src="microsite.avatar" :alt="microsite.title" />
            <AvatarFallback>{{ microsite.title[0] }}</AvatarFallback>
          </Avatar>
          <component
            :is="ITEM_ICON_MAP[microsite.avatarIcon]"
            v-else-if="microsite.avatarIcon && ITEM_ICON_MAP[microsite.avatarIcon]"
            class="h-12 w-12"
            :style="textStyle"
          />
        </div>

        <div class="space-y-2 text-center">
          <h1 class="text-3xl font-bold" :style="textStyle">
            {{ microsite.title }}
          </h1>
          <p v-if="microsite.description" class="text-muted-foreground" :style="textStyle">
            {{ microsite.description }}
          </p>
        </div>

        <div v-if="socialLinks.length > 0" class="flex flex-wrap justify-center gap-4">
          <a
            v-for="link in socialLinks"
            :key="link.platform"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="transition-transform hover:scale-110"
            :style="textStyle"
            :aria-label="link.platform"
          >
            <component :is="getSocialIcon(link.platform)" class="h-6 w-6" />
          </a>
        </div>

        <div class="mt-8 grid w-full auto-rows-min grid-cols-1 gap-4">
          <template v-for="item in visibleItems" :key="item.id">
            <div v-if="item.type === 'separator'" class="py-3 text-center">
              <h2 class="text-lg font-semibold" :style="textStyle">
                {{ item.title }}
              </h2>
            </div>

            <div
              v-else-if="item.type === 'text'"
              class="rounded-lg border bg-card p-4 text-center shadow-sm"
              :style="textStyle"
            >
              <h2 class="font-semibold">
                {{ item.title }}
              </h2>
              <p v-if="item.description" class="mt-2 text-sm text-muted-foreground" :style="textStyle">
                {{ item.description }}
              </p>
            </div>

            <div
              v-else-if="item.type === 'profile'"
              class="rounded-lg border bg-card p-5 text-center shadow-sm"
            >
              <User class="mx-auto h-10 w-10 text-muted-foreground" />
              <h2 class="mt-3 text-lg font-semibold" :style="textStyle">
                {{ item.title }}
              </h2>
              <p v-if="item.description" class="mt-2 text-sm text-muted-foreground" :style="textStyle">
                {{ item.description }}
              </p>
            </div>

            <img
              v-else-if="item.type === 'image' && item.url"
              :src="item.url"
              :alt="item.title"
              class="max-h-96 w-full rounded-lg border object-cover shadow-lg transition-transform hover:scale-[1.02]"
            >

            <div
              v-else-if="item.type === 'countdown'"
              class="rounded-lg border bg-card p-5 text-center shadow-sm"
            >
              <Timer class="mx-auto h-8 w-8 text-muted-foreground" />
              <h2 class="mt-3 text-lg font-semibold" :style="textStyle">
                {{ item.title }}
              </h2>
              <p class="mt-2 text-sm text-muted-foreground" :style="textStyle">
                {{ getCountdownLabel(item.targetDate) }}
              </p>
            </div>

            <div
              v-else-if="item.url && (item.type === 'embed' || item.type === 'link') && getEmbedType(item.url) === 'youtube' && getYouTubeId(item.url)"
              class="aspect-video h-full w-full overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-[1.02]"
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

            <div
              v-else-if="item.url && (item.type === 'embed' || item.type === 'link') && getEmbedType(item.url) === 'spotify'"
              class="h-full w-full overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-[1.02]"
            >
              <iframe
                style="border-radius:12px"
                :src="getSpotifyEmbedUrl(item.url)"
                width="100%"
                height="152"
                frameBorder="0"
                :allowfullscreen="true"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                class="h-full"
              />
            </div>

            <a
              v-else
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-full w-full items-center rounded-lg border bg-card p-4 transition-all hover:scale-105 hover:shadow-lg"
            >
              <component
                :is="getItemIcon(item)"
                class="mr-3 h-5 w-5 shrink-0 text-muted-foreground"
              />
              <div class="flex w-full items-center justify-between">
                <span class="font-medium" :style="textStyle">{{ item.title }}</span>
                <ExternalLink class="h-5 w-5 text-muted-foreground" />
              </div>
            </a>
          </template>
        </div>

        <div class="mt-12 text-center text-sm text-muted-foreground">
          <p>Powered by Shorty</p>
        </div>
      </div>
    </div>
  </div>
</template>
