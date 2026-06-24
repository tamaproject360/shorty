<script setup lang="ts">
import type { Link } from '@/types'
import { useClipboard } from '@vueuse/core'
import { Copy, CopyCheck, Eraser, Link as LinkIcon, QrCode, SquareChevronDown, SquarePen } from 'lucide-vue-next'
import { parseURL } from 'ufo'
import { toast } from 'vue-sonner'

const props = defineProps<{
  link: Link
}>()

const linksStore = useDashboardLinksStore()
const { t } = useI18n()
const editPopoverOpen = ref(false)

const requestUrl = useRequestURL()
const host = requestUrl.host
const origin = requestUrl.origin

function getLinkHost(url: string): string | undefined {
  const { host } = parseURL(url)
  return host
}

const shortLink = computed(() => `${origin}/${props.link.slug}`)
const linkIcon = computed(() => `https://unavatar.webp.se/${getLinkHost(props.link.url)}?fallback=${origin}/icon.png`)

const { copy, copied } = useClipboard({ source: shortLink.value, copiedDuring: 400 })

function copyLink() {
  copy(shortLink.value)
  toast(t('links.copy_success'))
}
</script>

<template>
  <Card>
    <CardContent :class="{ 'p-4': linksStore.viewMode === 'list', 'relative': linksStore.viewMode === 'card' }">
      <NuxtLink
        class="flex" :class="[
          linksStore.viewMode === 'list' ? 'flex-row items-center space-x-4' : `
            flex-col space-y-3
          `,
        ]"
        :to="`/dashboard/link?slug=${link.slug}`"
      >
        <div class="flex items-center justify-center space-x-3" :class="{ 'flex-1 justify-start': linksStore.viewMode === 'list' }">
          <Avatar>
            <AvatarImage
              :src="linkIcon"
              :alt="link.slug"
              loading="lazy"
            />
            <AvatarFallback>
              <img
                src="/icon.png"
                :alt="link.slug"
                loading="lazy"
              >
            </AvatarFallback>
          </Avatar>

          <div class="flex-1 overflow-hidden">
            <div class="flex items-center">
              <div class="truncate leading-5 font-bold">
                {{ host }}/{{ link.slug }}
              </div>

              <Button
                v-if="copied"
                variant="ghost"
                size="icon"
                class="ml-1 h-auto w-auto p-0"
                aria-label="Link copied"
                @click.prevent
              >
                <CopyCheck class="h-4 w-4 shrink-0" />
              </Button>
              <Button
                v-else
                variant="ghost"
                size="icon"
                class="ml-1 h-auto w-auto p-0"
                aria-label="Copy link"
                @click.prevent="copyLink"
              >
                <Copy class="h-4 w-4 shrink-0" />
              </Button>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <p class="truncate text-sm">
                    {{ link.comment || link.title || link.description }}
                  </p>
                </TooltipTrigger>
                <TooltipContent class="max-w-[90svw] break-all">
                  <p>{{ link.comment || link.title || link.description }}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div
          v-if="linksStore.viewMode === 'list'"
          class="flex items-center space-x-2"
        >
          <!-- Actions for List View (Moved here for better layout) -->
          <a
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open original link"
            @click.stop
          >
            <LinkIcon
              class="
                h-5 w-5 text-muted-foreground
                hover:text-foreground
              "
            />
          </a>

          <Popover>
            <PopoverTrigger aria-label="Show QR code">
              <QrCode
                class="
                  h-5 w-5 text-muted-foreground
                  hover:text-foreground
                "
                @click.prevent
              />
            </PopoverTrigger>
            <PopoverContent>
              <DashboardLinksQRCode
                :data="shortLink"
                :image="linkIcon"
              />
            </PopoverContent>
          </Popover>

          <Popover v-model:open="editPopoverOpen">
            <PopoverTrigger aria-label="More actions">
              <SquareChevronDown
                class="
                  h-5 w-5 text-muted-foreground
                  hover:text-foreground
                "
                @click.prevent
              />
            </PopoverTrigger>
            <PopoverContent
              class="w-auto p-0"
              :hide-when-detached="false"
            >
              <LazyDashboardLinksEditor
                :link="link"
              >
                <div
                  class="
                    flex cursor-pointer items-center rounded-sm px-2 py-1.5
                    text-sm outline-hidden select-none
                    hover:bg-accent hover:text-accent-foreground
                  "
                >
                  <SquarePen
                    aria-hidden="true"
                    class="mr-2 h-5 w-5"
                  />
                  {{ $t('common.edit') }}
                </div>
              </LazyDashboardLinksEditor>

              <Separator />

              <LazyDashboardLinksDelete
                :link="link"
              >
                <div
                  class="
                    flex cursor-pointer items-center rounded-sm px-2 py-1.5
                    text-sm outline-hidden select-none
                    hover:bg-accent hover:text-accent-foreground
                  "
                >
                  <Eraser
                    aria-hidden="true"
                    class="mr-2 h-5 w-5"
                  /> {{ $t('common.delete') }}
                </div>
              </LazyDashboardLinksDelete>
            </PopoverContent>
          </Popover>
        </div>
      </NuxtLink>

      <!-- Actions for Card View (outside NuxtLink to prevent navigation) -->
      <div
        v-if="linksStore.viewMode === 'card'"
        class="absolute top-4 right-4 flex items-center space-x-2"
      >
        <a
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open original link"
          @click.stop
        >
          <LinkIcon
            class="
              h-5 w-5 text-muted-foreground
              hover:text-foreground
            "
          />
        </a>

        <Popover>
          <PopoverTrigger aria-label="Show QR code">
            <QrCode
              class="
                h-5 w-5 text-muted-foreground
                hover:text-foreground
              "
              @click.prevent
            />
          </PopoverTrigger>
          <PopoverContent>
            <DashboardLinksQRCode
              :data="shortLink"
              :image="linkIcon"
            />
          </PopoverContent>
        </Popover>

        <Popover v-model:open="editPopoverOpen">
          <PopoverTrigger aria-label="More actions">
            <SquareChevronDown
              class="
                h-5 w-5 text-muted-foreground
                hover:text-foreground
              "
              @click.prevent
            />
          </PopoverTrigger>
          <PopoverContent
            class="w-auto p-0"
            :hide-when-detached="false"
          >
            <LazyDashboardLinksEditor
              :link="link"
            >
              <div
                class="
                  flex cursor-pointer items-center rounded-sm px-2 py-1.5
                  text-sm outline-hidden select-none
                  hover:bg-accent hover:text-accent-foreground
                "
              >
                <SquarePen
                  aria-hidden="true"
                  class="mr-2 h-5 w-5"
                />
                {{ $t('common.edit') }}
              </div>
            </LazyDashboardLinksEditor>

            <Separator />

            <LazyDashboardLinksDelete
              :link="link"
            >
              <div
                class="
                  flex cursor-pointer items-center rounded-sm px-2 py-1.5
                  text-sm outline-hidden select-none
                  hover:bg-accent hover:text-accent-foreground
                "
              >
                <Eraser
                  aria-hidden="true"
                  class="mr-2 h-5 w-5"
                />
                {{ $t('common.delete') }}
              </div>
            </LazyDashboardLinksDelete>
          </PopoverContent>
        </Popover>
      </div>
    </CardContent>
  </Card>
</template>
