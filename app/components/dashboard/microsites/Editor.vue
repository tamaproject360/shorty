<script setup lang="ts">
import type { Microsite, MicrositeItem } from '@/types'
import { GripVertical, Plus, Trash2 } from 'lucide-vue-next'
import { nanoid } from 'nanoid'
import { toast } from 'vue-sonner'

const { t } = useI18n()
const micrositesStore = useDashboardMicrositesStore()

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
  theme: 'auto' as 'light' | 'dark' | 'auto',
  bgColor: '',
  textColor: '',
  items: [] as MicrositeItem[],
  published: false,
})

const submitting = ref(false)

watch(() => micrositesStore.editingMicrosite, (microsite) => {
  if (microsite) {
    Object.assign(form, microsite)
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
  form.theme = 'auto'
  form.bgColor = ''
  form.textColor = ''
  form.items = []
  form.published = false
}

function addItem() {
  form.items.push({
    id: nanoid(),
    title: '',
    url: '',
    order: form.items.length,
    visible: true,
  })
}

function removeItem(index: number) {
  form.items.splice(index, 1)
  // Reorder
  form.items.forEach((item, idx) => {
    item.order = idx
  })
}

async function handleSubmit() {
  if (!form.title.trim()) {
    toast.error('Title is required')
    return
  }

  if (form.items.some(item => !item.title.trim() || !item.url.trim())) {
    toast.error('All items must have a title and URL')
    return
  }

  submitting.value = true

  try {
    if (isEditing.value) {
      const updated = await $fetch('/api/microsite/update', {
        method: 'PUT',
        body: form,
      })
      toast.success('Microsite updated successfully')
      micrositesStore.notifyMicrositeUpdate(updated as Microsite, 'update')
    }
    else {
      const created = await $fetch('/api/microsite/create', {
        method: 'POST',
        body: form,
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
        <Label for="avatar">Avatar URL</Label>
        <Input id="avatar" v-model="form.avatar" placeholder="https://..." />
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
        <Switch id="published" v-model:checked="form.published" />
        <Label for="published">Published</Label>
      </div>

      <Separator />

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <Label>Links</Label>
          <Button type="button" variant="outline" size="sm" @click="addItem">
            <Plus class="mr-2 h-4 w-4" />
            Add Link
          </Button>
        </div>

        <div
          v-if="form.items.length === 0" class="
            py-8 text-center text-muted-foreground
          "
        >
          No links yet. Add your first link!
        </div>

        <div v-else class="space-y-3">
          <Card
            v-for="(item, index) in form.items"
            :key="item.id"
            class="p-4"
          >
            <div class="flex items-start gap-3">
              <div class="cursor-move pt-2">
                <GripVertical class="h-5 w-5 text-muted-foreground" />
              </div>
              <div class="flex-1 space-y-3">
                <Input
                  v-model="item.title"
                  placeholder="Link title"
                />
                <Input
                  v-model="item.url"
                  placeholder="https://..."
                />
                <div class="flex items-center space-x-2">
                  <Switch v-model:checked="item.visible" />
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
