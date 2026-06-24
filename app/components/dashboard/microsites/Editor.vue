<script setup lang="ts">
import type { Microsite, MicrositeItem, SocialLink } from '@/types'
import {
  BookOpen,
  Briefcase,
  Camera,
  Code,
  FileText,
  Gift,
  Globe,
  GripVertical,
  Heart,
  Home,
  Image,
  Link,
  Mail,
  MapPin,
  MessageCircle,
  Music,
  Phone,
  Plus,
  ShoppingCart,
  Sparkles,
  Star,
  Trash2,
  User,
  Video,
  Wallet,
} from 'lucide-vue-next'
import { nanoid } from 'nanoid'
import { toast } from 'vue-sonner'

const { t } = useI18n()
const micrositesStore = useDashboardMicrositesStore()

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

function addItem() {
  form.items.push({
    id: nanoid(),
    type: 'link',
    title: '',
    url: '',
    icon: 'Link',
    order: form.items.length,
    visible: true,
    gridSpan: '1x1',
  })
}

function addSeparator() {
  form.items.push({
    id: nanoid(),
    type: 'separator',
    title: '',
    url: '',
    order: form.items.length,
    visible: true,
    gridSpan: '1x1',
  })
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
    if (item.type === 'separator')
      return !item.title || !item.title.trim()
    return !item.title || !item.title.trim() || !item.url || !item.url.trim()
  })) {
    toast.error('All links must have a title and URL')
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
    content-class="max-w-2xl"
  >
    <div class="space-y-4 p-6">
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
          rows="3"
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

      <Separator />

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <Label>Items</Label>
          <div class="flex gap-2">
            <Button type="button" variant="outline" size="sm" @click="addSeparator">
              <Plus class="mr-2 h-4 w-4" />
              Add Separator
            </Button>
            <Button type="button" variant="outline" size="sm" @click="addItem">
              <Plus class="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </div>
        </div>

        <div
          v-if="form.items.length === 0"
          class="py-8 text-center text-muted-foreground"
        >
          No items yet. Add links and separators!
        </div>

        <div v-else class="space-y-3">
          <Card
            v-for="(item, index) in form.items"
            :key="item.id"
            class="p-4"
            :class="{ 'border-dashed bg-muted/30': item.type === 'separator' }"
          >
            <div v-if="item.type === 'separator'" class="flex items-center gap-3">
              <span class="text-xs font-medium text-muted-foreground whitespace-nowrap">Separator</span>
              <Input
                v-model="item.title"
                placeholder="Section heading (e.g. Social Media)"
                class="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                @click="removeItem(index)"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>

            <div v-else class="flex items-start gap-3">
              <div class="cursor-move pt-2">
                <GripVertical class="h-5 w-5 text-muted-foreground" />
              </div>
              <div class="flex-1 space-y-3">
                <div class="flex gap-2">
                  <Input
                    v-model="item.title"
                    placeholder="Link title"
                    class="flex-1"
                  />
                </div>
                <Input
                  v-model="item.url"
                  placeholder="https://..."
                />
                <div class="flex gap-2">
                  <Popover>
                    <PopoverTrigger as-child>
                      <Button variant="outline" class="w-full justify-start gap-2">
                        <component
                          :is="ITEM_ICONS.find(i => i.name === (item.icon || 'Link'))?.icon || Link"
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
