import { generateText, Output } from 'ai'
import { createWorkersAI } from 'workers-ai-provider'
import { z } from 'zod'

export default eventHandler(async (event) => {
  const url = (await getValidatedQuery(event, z.object({
    url: z.string().url(),
  }).parse)).url

  // Gracefully handle missing Cloudflare context
  const cloudflare = event.context.cloudflare || {}
  const env = cloudflare.env || {}
  const AI = env.AI

  if (!AI) {
    // throw createError({ status: 501, statusText: 'AI not enabled' })
    // Fallback for local development/Netlify
    return {
      slug: null, // or generate a random one if preferred, but let frontend handle null
    }
  }

  const { aiPrompt, aiModel } = useRuntimeConfig(event)
  const { slugRegex } = useAppConfig()

  const workersai = createWorkersAI({ binding: AI })
  const { output } = await generateText({
    model: workersai(aiModel as Parameters<typeof workersai>[0]),
    output: Output.object({
      schema: z.object({
        slug: z.string().describe('The generated slug for the URL'),
      }),
    }),
    system: aiPrompt.replace('{slugRegex}', slugRegex.toString()),
    messages: [
      { role: 'user', content: 'https://www.cloudflare.com/' },
      { role: 'assistant', content: JSON.stringify({ slug: 'cloudflare' }) },

      { role: 'user', content: 'https://github.com/nuxt/' },
      { role: 'assistant', content: JSON.stringify({ slug: 'nuxt' }) },

      { role: 'user', content: 'https://github.com/miantiao-me/shorty' },
      { role: 'assistant', content: JSON.stringify({ slug: 'shorty' }) },

      { role: 'user', content: url },
    ],
  })
  return output
})
