<script setup lang="ts">
import { ArrowLeft, Users } from 'lucide-vue-next'

const route = useRoute()
const slug = route.params.slug as string
const router = useRouter()

const { data: stats, pending, error } = await useAsyncData(`microsite-stats-${slug}`, () =>
  useAPI('/api/microsite/stats', { query: { slug } }))

const { data: microsite } = await useFetch('/api/microsite/get', {
  query: { slug },
})

// Helper for bar height
function getBarHeight(count: number) {
  if (!stats.value?.chart.length)
    return 0
  const max = Math.max(...stats.value.chart.map(d => d.count))
  return (count / max) * 100
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" @click="router.back()">
        <ArrowLeft class="h-4 w-4" />
      </Button>
      <div>
        <h1 class="text-2xl font-bold tracking-tight">
          Analytics: {{ microsite?.title || slug }}
        </h1>
        <p class="text-muted-foreground">
          Performance metrics for your microsite
        </p>
      </div>
    </div>

    <div v-if="pending" class="py-12 text-center">
      Loading analytics...
    </div>

    <div v-else-if="error" class="py-12 text-center text-red-500">
      Failed to load analytics
    </div>

    <div v-else class="space-y-6">
      <!-- Summary Cards -->
      <div
        class="
          grid gap-4
          md:grid-cols-2
          lg:grid-cols-4
        "
      >
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">
              Total Views
            </CardTitle>
            <Users class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              {{ stats.totalViews }}
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Views Over Time Chart -->
      <Card>
        <CardHeader>
          <CardTitle>Views Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex h-[200px] w-full items-end gap-2 pt-4">
            <div
              v-for="item in stats.chart"
              :key="item.date"
              class="group relative flex flex-1 flex-col items-center"
            >
              <div
                class="
                  relative w-full rounded-t bg-primary/20 transition-colors
                  hover:bg-primary
                "
                :style="{ height: `${getBarHeight(item.count)}%` }"
              >
                <div
                  class="
                    absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded
                    bg-popover px-2 py-1 text-xs whitespace-nowrap
                    text-popover-foreground opacity-0 shadow
                    group-hover:opacity-100
                  "
                >
                  {{ item.count }} views
                </div>
              </div>
              <div
                class="
                  mt-1 origin-left translate-y-2 rotate-45 text-[10px]
                  text-muted-foreground
                "
              >
                {{ formatDate(item.date) }}
              </div>
            </div>
            <div
              v-if="stats.chart.length === 0" class="
                flex h-full w-full items-center justify-center
                text-muted-foreground
              "
            >
              No data available yet
            </div>
          </div>
        </CardContent>
      </Card>

      <div
        class="
          grid gap-4
          md:grid-cols-2
          lg:grid-cols-3
        "
      >
        <!-- Top Countries -->
        <Card class="col-span-1">
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div
                v-for="item in stats.countries.slice(0, 5)" :key="item.name" class="
                  flex items-center
                "
              >
                <div class="ml-4 space-y-1">
                  <p class="text-sm leading-none font-medium">
                    {{ item.name }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {{ item.value }} views
                  </p>
                </div>
                <div class="ml-auto font-medium">
                  {{ Math.round((item.value / stats.totalViews) * 100) }}%
                </div>
              </div>
              <div
                v-if="stats.countries.length === 0" class="
                  py-4 text-center text-sm text-muted-foreground
                "
              >
                No data
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Top Referrers -->
        <Card class="col-span-1">
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div
                v-for="item in stats.referrers.slice(0, 5)" :key="item.name" class="
                  flex items-center
                "
              >
                <div class="ml-4 space-y-1">
                  <p class="w-[150px] truncate text-sm leading-none font-medium">
                    {{ item.name }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {{ item.count }} clicks
                  </p>
                </div>
                <div class="ml-auto font-medium">
                  {{ Math.round((item.count / stats.totalViews) * 100) }}%
                </div>
              </div>
              <div
                v-if="stats.referrers.length === 0" class="
                  py-4 text-center text-sm text-muted-foreground
                "
              >
                No data
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Top Devices -->
        <Card class="col-span-1">
          <CardHeader>
            <CardTitle>Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div
                v-for="item in stats.devices" :key="item.name" class="
                  flex items-center
                "
              >
                <div class="ml-4 space-y-1">
                  <p class="text-sm leading-none font-medium">
                    {{ item.name }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {{ item.value }} views
                  </p>
                </div>
                <div class="ml-auto font-medium">
                  {{ Math.round((item.value / stats.totalViews) * 100) }}%
                </div>
              </div>
              <div
                v-if="stats.devices.length === 0" class="
                  py-4 text-center text-sm text-muted-foreground
                "
              >
                No data
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
