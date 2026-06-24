defineRouteMeta({
  openAPI: {
    description: 'Verify the site token',
    responses: {
      200: {
        description: 'The site token is valid',
      },
      default: {
        description: 'The site token is invalid',
      },
    },
  },
})

export default eventHandler((event) => {
  const { homeURL } = useRuntimeConfig(event)
  return {
    name: 'Shorty',
    url: homeURL || '',
  }
})
