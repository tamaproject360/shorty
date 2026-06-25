<script setup lang="ts">
import type { Link as DashboardLink, LinkListResponse, Microsite, MicrositeItem, SocialLink } from '@/types'
import {
  AtSign,
  BookOpen,
  Briefcase,
  Camera,
  Check,
  Code,
  ExternalLink,
  Facebook,
  FileText,
  Gift,
  Globe,
  GripVertical,
  Heart,
  Home,
  Image,
  Instagram,
  Link,
  Mail,
  MapPin,
  MessageCircle,
  Music,
  Phone,
  Plus,
  Send,
  ShoppingCart,
  Sparkles,
  Star,
  Timer,
  Trash2,
  Type,
  User,
  Video,
  Wallet,
} from 'lucide-vue-next'
import { nanoid } from 'nanoid'
import { toast } from 'vue-sonner'

const { t } = useI18n()
const micrositesStore = useDashboardMicrositesStore()

type MicrositeItemType = NonNullable<MicrositeItem['type']>

interface ComponentOption {
  type: MicrositeItemType
  title: string
  description: string
  icon: Component
  badge?: string
}

const COMPONENT_OPTIONS: ComponentOption[] = [
  { type: 'profile', title: 'Profile', description: 'Komponen profil yang memuat gambar, teks, dan sub teks', icon: User },
  { type: 'link', title: 'Link', description: 'Tautan standar untuk website atau halaman penting', icon: Link },
  { type: 'separator', title: 'Separator', description: 'Pembatas antar section di halaman microsite', icon: Type },
  { type: 'text', title: 'Text', description: 'Komponen teks pendek untuk pengumuman atau bio', icon: FileText },
  { type: 'image', title: 'Image', description: 'Komponen gambar untuk banner atau visual promosi', icon: Image, badge: 'Baru' },
  { type: 'embed', title: 'Embed', description: 'Media embed seperti YouTube atau Spotify', icon: Video },
  { type: 'whatsapp', title: 'WhatsApp', description: 'Tautan chat WhatsApp', icon: MessageCircle },
  { type: 'email', title: 'Email', description: 'Tautan untuk mengirim email', icon: Mail },
  { type: 'phone', title: 'Phone', description: 'Aksi kontak telepon', icon: Phone },
  { type: 'instagram', title: 'Instagram', description: 'Tautan menuju Instagram', icon: Instagram },
  { type: 'facebook', title: 'Facebook', description: 'Tautan menuju Facebook', icon: Facebook },
  { type: 'tiktok', title: 'TikTok', description: 'Tautan menuju TikTok', icon: Music },
  { type: 'telegram', title: 'Telegram', description: 'Tautan menuju Telegram', icon: Send },
  { type: 'countdown', title: 'Countdown', description: 'Waktu hitung mundur untuk event atau launch', icon: Timer, badge: 'Baru' },
]

const URL_REQUIRED_TYPES = new Set<MicrositeItemType>([
  'link',
  'image',
  'embed',
  'whatsapp',
  'email',
  'phone',
  'instagram',
  'facebook',
  'tiktok',
  'telegram',
])

const DESCRIPTION_TYPES = new Set<MicrositeItemType>(['profile', 'text'])

const ITEM_ICONS = [
  { name: 'Link', icon: Link },
  { name: 'Globe', icon: Globe },
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Code', icon: Code },
  { name: 'Camera', icon: Camera },
  { name: 'Music', icon: Music },
  { name: 'Video', icon: Video },
  { name: 'Heart', icon: Heart },
  { name: 'Star', icon: Star },
  { name: 'MessageCircle', icon: MessageCircle },
  { name: 'Mail', icon: Mail },
  { name: 'MapPin', icon: MapPin },
  { name: 'Phone', icon: Phone },
  { name: 'FileText', icon: FileText },
  { name: 'Image', icon: Image },
  { name: 'Gift', icon: Gift },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Wallet', icon: Wallet },
  { name: 'Home', icon: Home },
  { name: 'User', icon: User },
]

const AVATAR_ICONS = [
  { name: 'User', icon: User },
  { name: 'Star', icon: Star },
  { name: 'Heart', icon: Heart },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Globe', icon: Globe },
  { name: 'Camera', icon: Camera },
  { name: 'Code', icon: Code },
]

const open = computed({
  get: () => micrositesStore.showMicrositeEditor,
  set: (value) => {
    if (!value)
      micrositesStore.closeMicrositeEditor()
  },
})

const isEditing = computed(() => !!micrositesStore.editingMicrosite)

const form = reactive({
  slug: '',
  title: '',
  description: '',
  avatar: '',
  avatarIcon: '' as string,
  theme: 'auto' as 'light' | 'dark' | 'auto',
  bgColor: '',
  bgImage: '',
  bgOverlayOpacity: 0.2,
  textColor: '',
  socialLinks: [] as SocialLink[],
  items: [] as MicrositeItem[],
  published: false,
})

const submitting = ref(false)
const dragIndex = ref<number | null>(null)
const dropOverIndex = ref<number | null>(null)
const componentPickerOpen = ref(false)
const componentSearch = ref('')
const linkImportOpen = ref(false)
const linkImportSearch = ref('')
const linkImportLoading = ref(false)
const linkImportError = ref(false)
const availableLinks = ref<DashboardLink[]>([])
const selectedLinkIds = ref<string[]>([])

const filteredComponentOptions = computed(() => {
  const query = componentSearch.value.trim().toLowerCase()
  if (!query)
    return COMPONENT_OPTIONS

  return COMPONENT_OPTIONS.filter(option => `${option.title} ${option.description}`.toLowerCase().includes(query))
})

const filteredAvailableLinks = computed(() => {
  const query = linkImportSearch.value.trim().toLowerCase()
  if (!query)
    return availableLinks.value

  return availableLinks.value.filter((link) => {
    return [link.title, link.slug, link.url, link.description]
      .filter(Boolean)
      .some(value => value!.toLowerCase().includes(query))
  })
})

const previewVisibleItems = computed(() => {
  return form.items
    .filter(item => item.visible)
    .slice()
    .sort((a, b) => a.order - b.order)
})

const previewTitle = computed(() => form.title.trim() || 'Your Microsite')
const previewDescription = computed(() => form.description.trim())
const previewSlug = computed(() => form.slug.trim() || 'your-page')

const previewFrameStyle = computed(() => {
  if (form.bgImage) {
    return {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, ${form.bgOverlayOpacity ?? 0.2}), rgba(0, 0, 0, ${form.bgOverlayOpacity ?? 0.2})), url(${form.bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }

  if (form.bgColor)
    return { backgroundColor: form.bgColor }

  return {}
})

const previewTextStyle = computed(() => {
  if (form.textColor)
    return { color: form.textColor }

  return {}
})

function getItemIcon(name?: string) {
  return ITEM_ICONS.find(icon => icon.name === name)?.icon || Link
}

function getComponentIcon(type?: MicrositeItemType) {
  return COMPONENT_OPTIONS.find(option => option.type === type)?.icon || Link
}

function getAvatarIcon(name?: string) {
  return AVATAR_ICONS.find(icon => icon.name === name)?.icon || User
}

function getDefaultItem(type: MicrositeItemType): MicrositeItem {
  const option = COMPONENT_OPTIONS.find(component => component.type === type)
  const title = option?.title || 'Link'

  const defaults: Partial<Record<MicrositeItemType, Partial<MicrositeItem>>> = {
    profile: { title: form.title || 'Profile', description: form.description || 'Short profile description', icon: 'User' },
    link: { title: 'New Link', url: 'https://example.com', icon: 'Link' },
    separator: { title: 'Section title' },
    text: { title: 'Text block', description: 'Write a short message for your visitors.' },
    image: { title: 'Image', url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643', icon: 'Image' },
    embed: { title: 'Embed', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', icon: 'Video' },
    whatsapp: { title: 'Chat on WhatsApp', url: 'https://wa.me/6281234567890' },
    email: { title: 'Send Email', url: 'mailto:hello@example.com' },
    phone: { title: 'Call Me', url: 'tel:+6281234567890' },
    instagram: { title: 'Instagram', url: 'https://instagram.com/username' },
    facebook: { title: 'Facebook', url: 'https://facebook.com/username' },
    tiktok: { title: 'TikTok', url: 'https://tiktok.com/@username' },
    telegram: { title: 'Telegram', url: 'https://t.me/username' },
    countdown: { title: 'Countdown', targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16) },
  }

  return {
    id: nanoid(),
    type,
    title,
    url: '',
    order: form.items.length,
    visible: true,
    gridSpan: '1x1',
    ...defaults[type],
  }
}

function onDragStart(event: DragEvent, index: number) {
  dragIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }
}

function onDragEnter(index: number) {
  if (dragIndex.value !== null && dragIndex.value !== index) {
    dropOverIndex.value = index
  }
}

function onDragLeave() {
  dropOverIndex.value = null
}

function onDrop(index: number) {
  if (dragIndex.value === null || dragIndex.value === index)
    return

  const [moved] = form.items.splice(dragIndex.value, 1)
  if (!moved)
    return

  form.items.splice(index, 0, moved)

  form.items.forEach((item, idx) => {
    item.order = idx
  })

  dragIndex.value = null
  dropOverIndex.value = null
}

function onDragEnd() {
  dragIndex.value = null
  dropOverIndex.value = null
}

watch(() => micrositesStore.editingMicrosite, (microsite) => {
  if (microsite) {
    Object.assign(form, microsite)
    if (!form.socialLinks)
      form.socialLinks = []
    if (!form.avatarIcon)
      form.avatarIcon = ''
    if (!form.bgColor)
      form.bgColor = ''
    if (!form.bgImage)
      form.bgImage = ''
    if (!form.textColor)
      form.textColor = ''
    if (!form.description)
      form.description = ''
    if (!form.avatar)
      form.avatar = ''
    if (form.bgOverlayOpacity == null)
      form.bgOverlayOpacity = 0.2
  }
  else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.slug = ''
  form.title = ''
  form.description = ''
  form.avatar = ''
  form.avatarIcon = ''
  form.theme = 'auto'
  form.bgColor = ''
  form.bgImage = ''
  form.bgOverlayOpacity = 0.2
  form.textColor = ''
  form.socialLinks = []
  form.items = []
  form.published = false
}

function addComponent(type: MicrositeItemType) {
  form.items.push(getDefaultItem(type))
  componentPickerOpen.value = false
  componentSearch.value = ''
}

async function openLinkImport() {
  linkImportOpen.value = true
  if (availableLinks.value.length > 0)
    return

  await loadAvailableLinks()
}

async function loadAvailableLinks() {
  linkImportLoading.value = true
  linkImportError.value = false

  try {
    const data = await useAPI<LinkListResponse>('/api/link/list', {
      query: { limit: 1024 },
    })
    availableLinks.value = data.links.filter(Boolean)
  }
  catch (error) {
    console.error(error)
    linkImportError.value = true
  }
  finally {
    linkImportLoading.value = false
  }
}

function toggleLinkSelection(id: string) {
  const index = selectedLinkIds.value.indexOf(id)
  if (index >= 0) {
    selectedLinkIds.value.splice(index, 1)
    return
  }

  selectedLinkIds.value.push(id)
}

function importSelectedLinks() {
  const selected = availableLinks.value.filter(link => selectedLinkIds.value.includes(link.id))

  for (const link of selected) {
    form.items.push({
      id: nanoid(),
      type: 'link',
      title: link.title || link.comment || link.slug,
      url: link.url,
      description: link.description,
      icon: 'Link',
      order: form.items.length,
      visible: true,
      gridSpan: '1x1',
    })
  }

  selectedLinkIds.value = []
  linkImportSearch.value = ''
  linkImportOpen.value = false
}

function removeItem(index: number) {
  form.items.splice(index, 1)
  form.items.forEach((item, idx) => {
    item.order = idx
  })
}

async function handleSubmit() {
  if (!form.title || !form.title.trim()) {
    toast.error('Title is required')
    return
  }

  if (form.items.some((item) => {
    const type = item.type || 'link'
    if (type === 'separator')
      return !item.title || !item.title.trim()
    if (URL_REQUIRED_TYPES.has(type))
      return !item.title || !item.title.trim() || !item.url || !item.url.trim()
    if (type === 'countdown')
      return !item.title || !item.title.trim() || !item.targetDate || !item.targetDate.trim()
    return !item.title || !item.title.trim()
  })) {
    toast.error('Please complete required fields for all components')
    return
  }

  submitting.value = true

  try {
    if (isEditing.value) {
      const updated = await useAPI('/api/microsite/update', {
        method: 'PUT',
        body: { ...form },
      })
      toast.success('Microsite updated successfully')
      micrositesStore.notifyMicrositeUpdate(updated as Microsite, 'update')
    }
    else {
      const created = await useAPI('/api/microsite/create', {
        method: 'POST',
        body: { ...form },
      })
      toast.success('Microsite created successfully')
      micrositesStore.notifyMicrositeUpdate(created as Microsite, 'create')
    }

    micrositesStore.closeMicrositeEditor()
  }
  catch (error: any) {
    console.error('Submit error:', error)
    toast.error(error?.data?.statusMessage || 'Failed to save microsite')
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <ResponsiveModal
    v-model:open="open"
    :title="isEditing ? 'Edit Microsite' : 'Create Microsite'"
    description="Create a beautiful link-in-bio page for your audience"
    content-class="!max-w-[95vw] md:!max-w-7xl"
  >
    <div class="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div class="grid gap-6 md:grid-cols-2">
        <!-- Settings -->
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="title">Title *</Label>
            <Input id="title" v-model="form.title" placeholder="My Awesome Page" />
          </div>

          <div class="space-y-2">
            <Label for="slug">Slug</Label>
            <Input id="slug" v-model="form.slug" placeholder="my-page" />
            <p class="text-xs text-muted-foreground">
              Leave empty for auto-generated slug
            </p>
          </div>

          <div class="space-y-2">
            <Label for="description">Description</Label>
            <Textarea
              id="description"
              v-model="form.description"
              placeholder="Tell your audience about yourself"
              rows="4"
              class="resize-none"
            />
          </div>

          <div class="space-y-2">
            <Label>Avatar Icon</Label>
            <div class="grid grid-cols-8 gap-2">
              <button
                v-for="opt in AVATAR_ICONS"
                :key="opt.name"
                type="button"
                class="flex size-10 items-center justify-center rounded-lg border transition-colors"
                :class="form.avatarIcon === opt.name ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'"
                @click="form.avatarIcon = form.avatarIcon === opt.name ? '' : opt.name"
              >
                <component :is="opt.icon" class="size-5" />
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="theme">Theme</Label>
            <Select v-model="form.theme">
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  Light
                </SelectItem>
                <SelectItem value="dark">
                  Dark
                </SelectItem>
                <SelectItem value="auto">
                  Auto
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="flex items-center space-x-2">
            <Switch id="published" v-model="form.published" />
            <Label for="published">Published</Label>
          </div>
        </div>

        <!-- Items -->
        <div class="space-y-4 md:border-l md:pl-6">
          <div class="flex items-center justify-between">
            <Label>Items</Label>
            <div class="flex flex-wrap justify-end gap-2">
              <Button type="button" variant="outline" size="sm" @click="openLinkImport">
                <Link class="mr-2 h-4 w-4" />
                Import Links
              </Button>
              <ResponsiveModal
                v-model:open="componentPickerOpen"
                title="Tambah komponen baru"
                description="Pilih komponen yang ingin ditambahkan ke microsite."
                content-class="md:!max-w-3xl"
              >
                <template #trigger>
                  <Button type="button" variant="outline" size="sm">
                    <Plus class="mr-2 h-4 w-4" />
                    Add Component
                  </Button>
                </template>

                <div class="space-y-4 p-1">
                  <div class="relative">
                    <Input
                      v-model="componentSearch"
                      placeholder="Search component"
                      class="pr-10"
                    />
                    <AtSign class="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  </div>

                  <div class="grid max-h-[60vh] gap-2 overflow-y-auto pr-1 md:grid-cols-2">
                    <button
                      v-for="component in filteredComponentOptions"
                      :key="component.type"
                      type="button"
                      class="flex gap-3 rounded-xl border p-3 text-left transition-colors hover:border-primary/60 hover:bg-muted/50"
                      @click="addComponent(component.type)"
                    >
                      <component :is="component.icon" class="mt-1 size-5 shrink-0 text-muted-foreground" />
                      <span class="min-w-0 flex-1">
                        <span class="flex items-center gap-2 font-medium">
                          {{ component.title }}
                          <Badge v-if="component.badge" variant="secondary" class="text-[10px]">
                            {{ component.badge }}
                          </Badge>
                        </span>
                        <span class="mt-1 block text-xs text-muted-foreground">
                          {{ component.description }}
                        </span>
                      </span>
                    </button>
                  </div>
                </div>

                <template #footer>
                  <Button type="button" variant="secondary" @click="componentPickerOpen = false">
                    Close
                  </Button>
                </template>
              </ResponsiveModal>
            </div>
          </div>

          <ResponsiveModal
            v-model:open="linkImportOpen"
            title="Import existing links"
            description="Pilih link dashboard yang ingin ditambahkan ke microsite."
            content-class="md:!max-w-3xl"
          >
            <div class="space-y-4 p-1">
              <div class="relative">
                <Input
                  v-model="linkImportSearch"
                  placeholder="Search existing links"
                  class="pr-10"
                />
                <AtSign class="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>

              <div v-if="linkImportLoading" class="py-8 text-center text-sm text-muted-foreground">
                Loading links...
              </div>

              <div v-else-if="linkImportError" class="py-8 text-center text-sm text-muted-foreground">
                Failed to load links.
                <Button type="button" variant="link" @click="loadAvailableLinks">
                  Try again
                </Button>
              </div>

              <div v-else-if="availableLinks.length === 0" class="py-8 text-center text-sm text-muted-foreground">
                No existing links found.
              </div>

              <div v-else class="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
                <button
                  v-for="link in filteredAvailableLinks"
                  :key="link.id"
                  type="button"
                  class="flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors hover:border-primary/60 hover:bg-muted/50"
                  :class="selectedLinkIds.includes(link.id) ? 'border-primary bg-primary/5' : ''"
                  @click="toggleLinkSelection(link.id)"
                >
                  <div class="mt-1 flex size-5 items-center justify-center rounded border text-xs">
                    <Check v-if="selectedLinkIds.includes(link.id)" class="size-3" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="truncate font-medium">
                      {{ link.title || link.comment || link.slug }}
                    </div>
                    <div class="truncate text-xs text-muted-foreground">
                      /{{ link.slug }} -> {{ link.url }}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <template #footer>
              <Button type="button" variant="secondary" @click="linkImportOpen = false">
                Cancel
              </Button>
              <Button type="button" :disabled="selectedLinkIds.length === 0" @click="importSelectedLinks">
                Import {{ selectedLinkIds.length || '' }} Links
              </Button>
            </template>
          </ResponsiveModal>

          <div
            v-if="form.items.length === 0"
            class="py-8 text-center text-muted-foreground"
          >
            No items yet. Add components to build your microsite!
          </div>

          <div v-else class="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
            <Card
              v-for="(item, index) in form.items"
              :key="item.id"
              class="p-4 transition-colors"
              :class="{
                'border-dashed bg-muted/30': item.type === 'separator',
                'border-primary/50 bg-primary/5': dropOverIndex === index,
              }"
              @dragover.prevent
              @dragenter.prevent="onDragEnter(index)"
              @dragleave="onDragLeave()"
              @drop.prevent="onDrop(index)"
              @dragend="onDragEnd()"
            >
              <div class="flex items-start gap-3">
                <div
                  class="cursor-grab pt-2 active:cursor-grabbing"
                  draggable="true"
                  @dragstart="onDragStart($event, index)"
                >
                  <GripVertical class="h-5 w-5 text-muted-foreground" />
                </div>

                <div class="min-w-0 flex-1 space-y-3">
                  <div class="flex items-center gap-2">
                    <component :is="getComponentIcon(item.type || 'link')" class="size-4 text-muted-foreground" />
                    <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {{ COMPONENT_OPTIONS.find(component => component.type === (item.type || 'link'))?.title || 'Link' }}
                    </span>
                  </div>

                  <Input
                    v-model="item.title"
                    :placeholder="item.type === 'separator' ? 'Section heading' : 'Title'"
                  />

                  <Textarea
                    v-if="DESCRIPTION_TYPES.has(item.type || 'link')"
                    v-model="item.description"
                    placeholder="Description"
                    rows="3"
                    class="resize-none"
                  />

                  <Input
                    v-if="URL_REQUIRED_TYPES.has(item.type || 'link')"
                    v-model="item.url"
                    :placeholder="item.type === 'image' ? 'Image URL' : item.type === 'email' ? 'mailto:hello@example.com' : item.type === 'phone' ? 'tel:+6281234567890' : 'https://...'"
                  />

                  <Input
                    v-if="item.type === 'countdown'"
                    v-model="item.targetDate"
                    type="datetime-local"
                  />

                  <div v-if="!['separator', 'text', 'profile', 'image', 'embed', 'countdown'].includes(item.type || 'link')" class="flex gap-2">
                    <Popover>
                      <PopoverTrigger as-child>
                        <Button variant="outline" class="w-full justify-start gap-2">
                          <component
                            :is="getItemIcon(item.icon)"
                            class="size-4"
                          />
                          {{ item.icon || 'Link' }}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent class="w-72 p-2">
                        <div class="grid grid-cols-6 gap-1">
                          <button
                            v-for="opt in ITEM_ICONS"
                            :key="opt.name"
                            type="button"
                            class="flex size-9 items-center justify-center rounded-md transition-colors"
                            :class="(item.icon || 'Link') === opt.name ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
                            @click="item.icon = opt.name"
                          >
                            <component :is="opt.icon" class="size-4" />
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Select v-model="item.gridSpan">
                      <SelectTrigger class="w-[100px]">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1x1">
                          1x1
                        </SelectItem>
                        <SelectItem value="2x1">
                          2x1
                        </SelectItem>
                        <SelectItem value="2x2">
                          2x2
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div class="flex items-center space-x-2">
                    <Switch v-model="item.visible" />
                    <span class="text-sm text-muted-foreground">Visible</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  @click="removeItem(index)"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <aside class="hidden xl:block">
        <div class="sticky top-0 space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium">
                Live preview
              </p>
              <p class="text-xs text-muted-foreground">
                shorty/{{ previewSlug }}
              </p>
            </div>
            <Badge variant="secondary">
              {{ form.published ? 'Published' : 'Draft' }}
            </Badge>
          </div>

          <div class="rounded-[2rem] border bg-muted/40 p-3 shadow-sm">
            <div
              class="flex h-[640px] flex-col overflow-hidden rounded-[1.5rem] border bg-background shadow-xl"
              :class="form.theme === 'dark' ? 'dark bg-zinc-950 text-zinc-50' : 'bg-background'"
              :style="previewFrameStyle"
            >
              <div class="flex items-center justify-between p-4">
                <div class="flex size-9 items-center justify-center rounded-full bg-background/80 shadow-sm backdrop-blur">
                  <Sparkles class="size-4 text-primary" />
                </div>
                <Button size="sm" variant="secondary" class="h-8 rounded-full bg-background/80 px-3 text-xs shadow-sm backdrop-blur">
                  Subscribe
                </Button>
              </div>

              <div class="flex-1 overflow-y-auto px-5 pb-5 pt-10">
                <div class="flex flex-col items-center text-center">
                  <Avatar v-if="form.avatar" class="size-20 border bg-muted shadow-sm">
                    <AvatarImage :src="form.avatar" :alt="previewTitle" />
                    <AvatarFallback>{{ previewTitle[0] }}</AvatarFallback>
                  </Avatar>
                  <div
                    v-else
                    class="flex size-20 items-center justify-center rounded-full border bg-muted shadow-sm"
                  >
                    <component :is="getAvatarIcon(form.avatarIcon)" class="size-10" :style="previewTextStyle" />
                  </div>

                  <h3 class="mt-5 text-xl font-bold" :style="previewTextStyle">
                    {{ previewTitle }}
                  </h3>
                  <p v-if="previewDescription" class="mt-2 line-clamp-3 text-sm text-muted-foreground" :style="previewTextStyle">
                    {{ previewDescription }}
                  </p>
                </div>

                <div class="mt-8 space-y-3">
                  <div v-if="previewVisibleItems.length === 0" class="rounded-2xl border border-dashed bg-background/70 p-4 text-center text-sm text-muted-foreground backdrop-blur">
                    Add links to preview your page.
                  </div>

                  <template v-for="item in previewVisibleItems" :key="item.id">
                    <div v-if="item.type === 'separator'" class="px-2 py-2 text-center">
                      <p class="text-sm font-semibold" :style="previewTextStyle">
                        {{ item.title || 'Section title' }}
                      </p>
                    </div>

                    <div v-else-if="item.type === 'text'" class="rounded-2xl border bg-background/80 p-3 text-sm backdrop-blur" :style="previewTextStyle">
                      <p class="font-medium">
                        {{ item.title || 'Text block' }}
                      </p>
                      <p v-if="item.description" class="mt-1 text-muted-foreground" :style="previewTextStyle">
                        {{ item.description }}
                      </p>
                    </div>

                    <div v-else-if="item.type === 'profile'" class="rounded-2xl border bg-background/90 p-4 text-center shadow-sm backdrop-blur">
                      <component :is="getComponentIcon('profile')" class="mx-auto size-8 text-muted-foreground" />
                      <p class="mt-2 font-semibold" :style="previewTextStyle">
                        {{ item.title || 'Profile' }}
                      </p>
                      <p v-if="item.description" class="mt-1 text-xs text-muted-foreground" :style="previewTextStyle">
                        {{ item.description }}
                      </p>
                    </div>

                    <img
                      v-else-if="item.type === 'image' && item.url"
                      :src="item.url"
                      :alt="item.title"
                      class="max-h-44 w-full rounded-2xl border object-cover shadow-sm"
                    >

                    <div v-else-if="item.type === 'countdown'" class="rounded-2xl border bg-background/90 p-4 text-center shadow-sm backdrop-blur">
                      <Timer class="mx-auto size-5 text-muted-foreground" />
                      <p class="mt-2 font-semibold" :style="previewTextStyle">
                        {{ item.title || 'Countdown' }}
                      </p>
                      <p class="mt-1 text-xs text-muted-foreground" :style="previewTextStyle">
                        {{ item.targetDate || 'Set date and time' }}
                      </p>
                    </div>

                    <div v-else class="flex items-center gap-3 rounded-2xl border bg-background/90 p-3 shadow-sm backdrop-blur">
                      <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted">
                        <component :is="getComponentIcon(item.type || 'link')" class="size-4 text-muted-foreground" />
                      </div>
                      <span class="min-w-0 flex-1 truncate text-sm font-medium" :style="previewTextStyle">
                        {{ item.title || 'Link title' }}
                      </span>
                      <ExternalLink class="size-4 shrink-0 text-muted-foreground" />
                    </div>
                  </template>
                </div>

                <div class="mt-10 text-center text-xs text-muted-foreground" :style="previewTextStyle">
                  Powered by Shorty
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
    <template #footer>
      <Button
        variant="outline"
        @click="micrositesStore.closeMicrositeEditor()"
      >
        {{ t('common.cancel') }}
      </Button>
      <Button
        :disabled="submitting"
        @click="handleSubmit"
      >
        {{ submitting ? 'Saving...' : t('common.save') }}
      </Button>
    </template>
  </ResponsiveModal>
</template>
