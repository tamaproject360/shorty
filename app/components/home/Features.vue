<script setup lang="ts">
import { AreaChart, Languages, LayoutTemplate, Link, QrCode, Sparkles } from 'lucide-vue-next'

interface Feature {
  icon: Component
  titleKey: string
  descriptionKey: string
}

const features: Feature[] = [
  { icon: Link, titleKey: 'home.features.short_links.title', descriptionKey: 'home.features.short_links.description' },
  { icon: AreaChart, titleKey: 'home.features.analytics.title', descriptionKey: 'home.features.analytics.description' },
  { icon: Sparkles, titleKey: 'home.features.ai.title', descriptionKey: 'home.features.ai.description' },
  { icon: LayoutTemplate, titleKey: 'home.features.microsites.title', descriptionKey: 'home.features.microsites.description' },
  { icon: QrCode, titleKey: 'home.features.qr.title', descriptionKey: 'home.features.qr.description' },
  { icon: Languages, titleKey: 'home.features.i18n.title', descriptionKey: 'home.features.i18n.description' },
]
</script>

<template>
  <section
    class="
      py-16
      md:py-24
    "
  >
    <div class="mx-auto max-w-6xl px-6">
      <div class="mb-12 text-center">
        <h2
          class="
            text-3xl font-medium tracking-tight
            md:text-4xl
          "
        >
          {{ $t('home.features.headline') }}
        </h2>
      </div>
      <div
        class="
          grid gap-6
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        <div
          v-for="feature in features"
          :key="feature.titleKey"
          class="
            group rounded-xl border bg-background p-6 transition-shadow
            hover:shadow-md
          "
        >
          <div
            class="
              mb-4 inline-flex size-10 items-center justify-center rounded-lg
              border bg-muted/50
            "
          >
            <component :is="feature.icon" class="size-5 text-muted-foreground" />
          </div>
          <h3 class="mb-2 font-medium">
            {{ $t(feature.titleKey) }}
          </h3>
          <p class="text-sm text-muted-foreground">
            {{ $t(feature.descriptionKey) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
