<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <section
    class="
      py-16
      md:py-24
    "
  >
    <div class="mx-auto max-w-6xl px-6">
      <div
        class="
          flex flex-col items-center rounded-2xl border bg-muted/30 px-6 py-16
          text-center
        "
      >
        <h2
          class="
            text-3xl font-medium tracking-tight
            md:text-4xl
          "
        >
          {{ $t('home.cta.headline') }}
        </h2>
        <p class="mt-4 max-w-md text-muted-foreground">
          {{ $t('home.cta.subtitle') }}
        </p>
        <Button as-child size="lg" class="mt-8 px-8 text-base">
          <NuxtLink to="/dashboard">
            {{ $t('home.cta.button') }}
            <ArrowRight class="ml-1 size-4" />
          </NuxtLink>
        </Button>
      </div>
    </div>
  </section>
</template>
