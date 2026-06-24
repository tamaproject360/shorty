<script setup lang="ts">
</script>

<template>
  <section class="border-y bg-background">
    <div
      class="
        mx-auto max-w-6xl px-6 py-24
        md:py-32
      "
    >
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
