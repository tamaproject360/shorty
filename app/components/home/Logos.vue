<script setup lang="ts">
import NuxtLogo from '@/assets/images/nuxtjs.png'
</script>

<template>
  <section class="border-y bg-muted/30">
    <div class="mx-auto max-w-6xl px-6 py-16">
      <p class="mb-8 text-center text-sm text-muted-foreground">
        {{ $t('home.logos.title') }}
      </p>
      <div class="flex items-center justify-center">
        <img
          :src="NuxtLogo"
          alt="Nuxt.js"
          class="
            h-20
            md:h-24
          "
          loading="lazy"
        >
      </div>
    </div>
  </section>
</template>
