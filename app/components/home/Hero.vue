<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

const { description } = useAppConfig()
</script>

<template>
  <section>
    <div
      class="
        py-16
        md:py-24
      "
    >
      <div class="mx-auto max-w-6xl px-6">
        <div class="flex flex-col items-center text-center">
          <div
            class="
              mb-6 inline-flex items-center rounded-full border bg-muted/50 px-3
              py-1 text-sm
            "
          >
            <span class="mr-1">✨</span>
            {{ $t('home.hero.badge') }}
          </div>

          <h1
            class="
              max-w-3xl text-4xl font-medium tracking-tight text-balance
              md:text-5xl
              xl:text-6xl
            "
          >
            {{ $t('home.hero.headline') }}
          </h1>
          <p class="mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
            {{ description }}
          </p>

          <div
            class="
              mt-10 flex flex-col items-center gap-3
              sm:flex-row
            "
          >
            <Button as-child size="lg" class="px-6 text-base">
              <NuxtLink to="/dashboard">
                {{ $t('home.hero.cta_dashboard') }}
                <ArrowRight class="ml-1 size-4" />
              </NuxtLink>
            </Button>
            <Button as-child variant="outline" size="lg" class="px-6 text-base">
              <NuxtLink to="/dashboard/links">
                {{ $t('home.hero.cta_create') }}
              </NuxtLink>
            </Button>
          </div>

          <div class="mt-16 w-full max-w-4xl">
            <div class="overflow-hidden rounded-xl border shadow-2xl">
              <img
                src="/asset/dashboard.png"
                :alt="$t('home.hero.screenshot_alt')"
                class="w-full"
                loading="lazy"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
