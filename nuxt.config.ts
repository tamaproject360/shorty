import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import { currentLocales } from './i18n/i18n'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@vueuse/motion/nuxt',
    'shadcn-nuxt',
  ],
  devtools: { enabled: true },
  css: ['@/assets/css/tailwind.css'],
  colorMode: {
    classSuffix: '',
  },
  runtimeConfig: {
    siteToken: process.env.NUXT_SITE_TOKEN || crypto.randomUUID(),
    redirectStatusCode: '301',
    linkCacheTtl: 60,
    redirectWithQuery: false,
    homeURL: process.env.NUXT_HOME_URL || '',
    dataset: 'shorty',
    aiModel: process.env.NUXT_AI_MODEL || 'gpt-4o-mini',
    aiPrompt: `You are a URL shortening assistant, please shorten the URL provided by the user into a SLUG. The SLUG information must come from the URL itself, do not make any assumptions. A SLUG is human-readable and should not exceed three words and can be validated using regular expressions {slugRegex} . Only the best one is returned, the format must be JSON reference {"slug": "example-slug"}`,
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY || '',
    openaiBaseUrl: process.env.NUXT_OPENAI_BASE_URL || '',
    caseSensitive: false,
    listQueryLimit: 500,
    disableBotAccessLog: false,
    public: {
      previewMode: '',
      slugDefaultLength: '6',
      kvBatchLimit: '50',
    },
  },
  routeRules: {
    '/': {
      ssr: false,
    },
    '/dashboard/**': {
      ssr: false,
    },
    '/dashboard': {
      redirect: '/dashboard/links',
    },
    '/api/**': {
      cors: process.env.NUXT_API_CORS === 'true',
    },
  },
  experimental: {
    enforceModuleCompatibility: true,
  },
  compatibilityDate: 'latest',
  nitro: {
    // preset: !import.meta.env.CI ? 'cloudflare-module' : undefined,
    sourcemap: false,
    experimental: {
      openAPI: true,
    },
    storage: {
      data: {
        driver: 'fs',
        base: './.data/links',
      },
      images: {
        driver: 'fs',
        base: './.data/assets',
      },
    },
    devStorage: {
      data: {
        driver: 'fs',
        base: './.data/links',
      },
      images: {
        driver: 'fs',
        base: './.data/assets',
      },
    },
    timing: true,
    openAPI: {
      production: 'runtime',
      meta: {
        title: 'Shorty API',
        description: 'A Simple / Speedy / Secure Link Shortener with Analytics.',
      },
      route: '/_docs/openapi.json',
      ui: {
        scalar: {
          route: '/_docs/scalar',
        },
        swagger: {
          route: '/_docs/swagger',
        },
      },
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    build: {
      sourcemap: false,
    },
  },
  typescript: {
    tsConfig: {
      include: ['../schemas/**/*'],
    },
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  i18n: {
    locales: currentLocales,
    compilation: {
      strictMessage: false,
      escapeHtml: true,
    },
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'shorty_i18n_redirected',
      redirectOn: 'root',
    },
    baseUrl: '/',
    defaultLocale: 'en-US',
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui',
  },
})
