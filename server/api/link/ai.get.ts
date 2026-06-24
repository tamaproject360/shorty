import { createOpenAI } from '@ai-sdk/openai'
import { generateText, Output } from 'ai'
import { createWorkersAI } from 'workers-ai-provider'
import { z } from 'zod'

export default eventHandler(async (event) => {
  const url = (await getValidatedQuery(event, z.object({
    url: z.string().url(),
  }).parse)).url

  const { aiPrompt, aiModel, openaiApiKey, openaiBaseUrl } = useRuntimeConfig(event)
  const { slugRegex } = useAppConfig()

  const cloudflare = event.context.cloudflare || {}
  const env = cloudflare.env || {}
  const AI = env.AI

  if (!openaiApiKey && !AI) {
    return { slug: null }
  }

  const { output } = await generateText({
    model: resolveModel(openaiApiKey, openaiBaseUrl, aiModel, AI),
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

function resolveModel(
  openaiApiKey: string,
  openaiBaseUrl: string,
  modelName: string,
  aiBinding: unknown,
) {
  if (openaiApiKey) {
    const openai = createOpenAI({
      apiKey: openaiApiKey,
      baseURL: openaiBaseUrl || 'https://api.openai.com/v1',
      compatibility: 'strict',
    })
    return openai(modelName)
  }

  if (aiBinding) {
    const workersai = createWorkersAI({ binding: aiBinding })
    return workersai(modelName as Parameters<typeof workersai>[0])
  }

  throw new Error('No AI provider configured')
}
