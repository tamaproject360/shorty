export default defineAppConfig({
  title: 'Shorty',
  github: '',
  twitter: '',
  telegram: '',
  description: 'A Simple / Speedy / Secure Link Shortener with Analytics.',
  image: '/banner.png',
  previewTTL: 300, // 5 minutes
  slugRegex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
  reserveSlug: [
    'dashboard',
    'm',
  ],
})
