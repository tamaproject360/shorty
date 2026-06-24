<script setup lang="ts">
import NuxtLogo from '@/assets/images/nuxtjs.png'
</script>

<template>
  <section class="border-y bg-background">
    <div
      class="
        mx-auto max-w-6xl px-6 py-24
        md:py-32
      "
    >
      <div
        class="
          mb-16 flex flex-wrap items-center justify-center gap-8
          md:justify-start
        "
      >
        <img
          :src="NuxtLogo"
          alt="Nuxt.js"
          class="
            h-7 opacity-50 grayscale
            md:h-8
          "
          loading="lazy"
        >
        <span class="text-sm text-muted-foreground/40">
          {{ $t('home.quote.powered_by') }}
        </span>
      </div>

      <div class="max-w-4xl space-y-4">
        <h2
          class="
            text-4xl font-bold tracking-tight text-foreground
            md:text-5xl
            lg:text-6xl
          "
        >
          {{ $t('home.quote.headline') }}
        </h2>
        <p
          class="
            text-2xl text-muted-foreground
            md:text-3xl
            lg:text-4xl
          "
        >
          {{ $t('home.quote.body') }}
        </p>
      </div>
    </div>
  </section>
</template>
