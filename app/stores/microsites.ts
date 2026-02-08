import type { Microsite, MicrositeUpdateType } from '@/types'
import { defineStore } from '#imports'
import { createEventHook, tryOnScopeDispose } from '@vueuse/core'
import { ref } from 'vue'

export interface MicrositeUpdateEvent {
  microsite: Microsite
  type: MicrositeUpdateType
}

export const useDashboardMicrositesStore = defineStore('dashboard-microsites', () => {
  const showMicrositeEditor = ref(false)
  const editingMicrosite = ref<Record<string, unknown> | null>(null)

  const micrositeUpdateHook = createEventHook<MicrositeUpdateEvent>()

  function openMicrositeEditor(microsite?: Record<string, unknown>) {
    editingMicrosite.value = microsite || null
    showMicrositeEditor.value = true
  }

  function closeMicrositeEditor() {
    showMicrositeEditor.value = false
    editingMicrosite.value = null
  }

  function notifyMicrositeUpdate(microsite: Microsite, type: MicrositeUpdateType) {
    micrositeUpdateHook.trigger({ microsite, type })
  }

  function onMicrositeUpdate(callback: (event: MicrositeUpdateEvent) => void) {
    const { off } = micrositeUpdateHook.on(callback)
    tryOnScopeDispose(off)
    return off
  }

  return {
    showMicrositeEditor,
    editingMicrosite,
    openMicrositeEditor,
    closeMicrositeEditor,
    notifyMicrositeUpdate,
    onMicrositeUpdate,
  }
})
