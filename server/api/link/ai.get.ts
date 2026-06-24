import { createOpenAI } from '@ai-sdk/openai'
import { generateText, Output } from 'ai'
import { z } from 'zod'

export default eventHandler(async (event) => {
  const url = (await getValidatedQuery(event, z.object({
    url: z.string().url(),
  }).parse)).url

  const { aiPrompt, aiModel, openaiApiKey, openaiBaseUrl } = useRuntimeConfig(event)
  const { slugRegex } = useAppConfig()

  if (!openaiApiKey) {
    return { slug: null }
  }

  const openai = createOpenAI({
    apiKey: openaiApiKey,
    baseURL: openaiBaseUrl || 'https://api.openai.com/v1',
    compatibility: 'strict',
  })

  const { output } = await generateText({
    model: openai(aiModel),
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

      { role: 'user', content: 'https://github.com/tamaproject360/shorty' },
      { role: 'assistant', content: JSON.stringify({ slug: 'shorty' }) },

      { role: 'user', content: url },
    ],
  })
  return output
})
